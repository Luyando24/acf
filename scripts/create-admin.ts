import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import path from 'node:path'

function loadEnvLocal() {
  const raw = readFileSync(path.resolve('.env.local'), 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (!match) continue
    const value = match[2].replace(/^[`'"]|[`'"]$/g, '').trim()
    if (!(match[1] in process.env)) process.env[match[1]] = value
  }
}

function generatePassword() {
  const sets = [
    'abcdefghijkmnpqrstuvwxyz',
    'ABCDEFGHJKLMNPQRSTUVWXYZ',
    '23456789',
    '!@#$%^&*',
  ]
  const all = sets.join('')
  const pick = (set: string) => set[randomBytes(1)[0] % set.length]
  const chars = sets.map(pick)
  while (chars.length < 20) chars.push(pick(all))
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomBytes(1)[0] % (i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }
  return chars.join('')
}

async function main() {
  const email = process.argv[2]
  const role = process.argv[3] || 'admin'
  if (!email) {
    console.error('Usage: tsx scripts/create-admin.ts <email> [role]')
    process.exit(1)
  }

  loadEnvLocal()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const password = generatePassword()
  const fullName = role === 'super_admin' ? 'ACF Super Administrator' : 'ACF Staff'

  let userId: string
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })

  if (created?.user) {
    userId = created.user.id
    console.log(`Created auth user ${email}`)
  } else if (createError?.message.toLowerCase().includes('already')) {
    const { data: list } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    const existing = list?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (!existing) throw createError
    userId = existing.id
    console.log(`Auth user ${email} already exists; resetting password`)
  } else {
    throw createError
  }

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    email,
    full_name: fullName,
    role,
    is_active: true,
  })
  if (profileError) throw profileError
  console.log(`Profile set: role=${role}, is_active=true`)

  console.log('\n========================================')
  console.log(`Email:    ${email}`)
  console.log(`Password: ${password}`)
  console.log('Store it in a password manager now; it will not be shown again.')
  console.log('========================================')
}

main().catch((err) => {
  console.error('Failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
