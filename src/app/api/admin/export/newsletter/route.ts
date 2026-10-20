import { NextResponse } from 'next/server'
import { canExportSubmissions } from '@/lib/auth/permissions'
import { requireStaff } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const auth = await requireStaff()
    if (!auth.ok) return auth.response
    const session = auth.session
    if (!canExportSubmissions(session.role)) {
      return NextResponse.json(
        { error: 'You do not have permission for this action.' },
        { status: 403 }
      )
    }

    const adminClient = createAdminClient()
    const { data: subscribers } = await adminClient
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false })

    const headers = ['ID', 'Email', 'Status', 'Source', 'Consent At', 'Confirmed At', 'Created At']

    const rows = (subscribers || []).map((sub: any) => [
      `"${sub.id}"`,
      `"${sub.email}"`,
      `"${sub.status}"`,
      `"${sub.source || 'website'}"`,
      `"${sub.consent_at || ''}"`,
      `"${sub.confirmed_at || ''}"`,
      `"${sub.created_at || ''}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="acf_newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
