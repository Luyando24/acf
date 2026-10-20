import { NextResponse } from 'next/server'
import { canManageSettings } from '@/lib/auth/permissions'
import { requireStaff } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const auth = await requireStaff()
    if (!auth.ok) return auth.response
    const session = auth.session
    if (!canManageSettings(session.role)) {
      return NextResponse.json(
        { error: 'You do not have permission for this action.' },
        { status: 403 }
      )
    }

    const payload = await request.json()
    const adminClient = createAdminClient()
    const { error } = await (adminClient.from('site_settings') as any).upsert(
      {
        key: 'general',
        value: payload,
        description: 'Secretariat contact, identity, logo and social links',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, settings: payload })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update settings.'
    if (message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return NextResponse.json({ error: 'Staff data store is not configured.' }, { status: 503 })
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
