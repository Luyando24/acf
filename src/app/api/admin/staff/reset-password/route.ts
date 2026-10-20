import { NextResponse } from 'next/server'
import { requireStaff } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateTempPassword } from '@/lib/auth/passwords'
import { staffResetPasswordSchema } from '@/lib/validations/forms'

export async function POST(request: Request) {
  const auth = await requireStaff(['super_admin'])
  if (!auth.ok) return auth.response

  try {
    const payload = await request.json()
    const parsed = staffResetPasswordSchema.safeParse(payload)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid request.' },
        { status: 400 }
      )
    }

    const tempPassword = generateTempPassword()
    const adminClient = createAdminClient()
    const { error } = await adminClient.auth.admin.updateUserById(parsed.data.userId, {
      password: tempPassword,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ tempPassword })
  } catch {
    return NextResponse.json({ error: 'Staff management is not configured.' }, { status: 503 })
  }
}
