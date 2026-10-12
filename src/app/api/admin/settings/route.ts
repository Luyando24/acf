import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    // Enforce authentication in production
    if (process.env.NODE_ENV === 'production' && !session) {
      return NextResponse.json(
        { error: 'Unauthorized. Staff credentials required.' },
        { status: 401 }
      )
    }

    const payload = await request.json()

    // Save general settings
    const adminClient = createAdminClient()
    const { error } = await (adminClient.from('site_settings') as any)
      .upsert(
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
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update settings.' },
      { status: 500 }
    )
  }
}
