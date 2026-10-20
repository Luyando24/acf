import { NextResponse } from 'next/server'
import { canManageStaff } from '@/lib/auth/permissions'
import { requireStaff } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateTempPassword } from '@/lib/auth/passwords'
import { staffAccountSchema, staffUpdateSchema } from '@/lib/validations/forms'

interface StaffRow {
  id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  created_at: string
}

export async function GET() {
  const auth = await requireStaff(['super_admin'])
  if (!auth.ok) return auth.response

  try {
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('profiles')
      .select('id, email, full_name, role, is_active, created_at')
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const staff = (data || []) as StaffRow[]

    // Merge last sign-in info from the auth admin API for the activity column.
    let lastSignIn: Record<string, string | null> = {}
    try {
      const { data: userList } = await adminClient.auth.admin.listUsers({ perPage: 1000 })
      lastSignIn = Object.fromEntries(
        (userList?.users || []).map((u) => [u.id, u.last_sign_in_at ?? null])
      )
    } catch {
      // Activity column is best-effort.
    }

    return NextResponse.json({
      staff: staff.map((s) => ({ ...s, last_sign_in_at: lastSignIn[s.id] ?? null })),
    })
  } catch {
    return NextResponse.json({ error: 'Staff directory is not configured.' }, { status: 503 })
  }
}

export async function POST(request: Request) {
  const auth = await requireStaff(['super_admin'])
  if (!auth.ok) return auth.response

  try {
    const payload = await request.json()
    const parsed = staffAccountSchema.safeParse(payload)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid staff account details.' },
        { status: 400 }
      )
    }

    const { full_name, email, role, password } = parsed.data
    const initialPassword = password ? password : generateTempPassword()

    const adminClient = createAdminClient()
    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password: initialPassword,
      email_confirm: true,
      user_metadata: { full_name },
    })

    if (createError) {
      const exists = createError.message.toLowerCase().includes('already')
      return NextResponse.json(
        { error: exists ? 'A user with this email already exists.' : createError.message },
        { status: exists ? 409 : 500 }
      )
    }

    const { error: profileError } = await adminClient.from('profiles').upsert({
      id: created.user.id,
      email,
      full_name,
      role,
      is_active: true,
    })

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({
      staff: {
        id: created.user.id,
        email,
        full_name,
        role,
        is_active: true,
        created_at: new Date().toISOString(),
        last_sign_in_at: null,
      },
      tempPassword: password ? null : initialPassword,
    })
  } catch {
    return NextResponse.json({ error: 'Staff management is not configured.' }, { status: 503 })
  }
}

export async function PATCH(request: Request) {
  const auth = await requireStaff(['super_admin'])
  if (!auth.ok) return auth.response
  const session = auth.session

  try {
    const payload = await request.json()
    const parsed = staffUpdateSchema.safeParse(payload)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid update.' },
        { status: 400 }
      )
    }

    const { userId, role, is_active } = parsed.data

    if (userId === session.userId) {
      return NextResponse.json(
        { error: 'You cannot change your own role or active status.' },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()
    const { data: current, error: fetchError } = await adminClient
      .from('profiles')
      .select('role, is_active')
      .eq('id', userId)
      .maybeSingle()

    if (fetchError || !current) {
      return NextResponse.json({ error: 'Staff account not found.' }, { status: 404 })
    }

    const profile = current as { role: string; is_active: boolean }
    const losesSuperAccess =
      profile.role === 'super_admin' &&
      profile.is_active &&
      ((role && role !== 'super_admin') || is_active === false)

    if (losesSuperAccess) {
      const { count } = await adminClient
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'super_admin')
        .eq('is_active', true)
        .neq('id', userId)

      if (!count) {
        return NextResponse.json(
          { error: 'The last active super admin account cannot be demoted or deactivated.' },
          { status: 400 }
        )
      }
    }

    const updates: { updated_at: string; role?: typeof role; is_active?: boolean } = {
      updated_at: new Date().toISOString(),
    }
    if (role) updates.role = role
    if (typeof is_active === 'boolean') updates.is_active = is_active

    const { data: updated, error: updateError } = await adminClient
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select('id, email, full_name, role, is_active, created_at')
      .maybeSingle()

    if (updateError) {
      const guard = updateError.message.includes('last active super admin')
      return NextResponse.json(
        {
          error: guard
            ? 'The last active super admin account cannot be demoted or deactivated.'
            : updateError.message,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ staff: { ...updated, last_sign_in_at: null } })
  } catch {
    return NextResponse.json({ error: 'Staff management is not configured.' }, { status: 503 })
  }
}
