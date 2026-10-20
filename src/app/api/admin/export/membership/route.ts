import { NextResponse } from 'next/server'
import { canExportSubmissions } from '@/lib/auth/permissions'
import { requireStaff } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'

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

    const supabase = await createClient()
    const { data: apps } = await supabase
      .from('membership_applications')
      .select('*, membership_categories(name)')
      .order('created_at', { ascending: false })

    const headers = ['ID', 'Type', 'Org Name', 'Contact Name', 'Email', 'Phone', 'Category', 'Province', 'Sector Interest', 'Status', 'Submitted At']

    const rows = (apps || []).map((app: any) => [
      `"${app.id}"`,
      `"${app.applicant_type}"`,
      `"${(app.org_name || '').replace(/"/g, '""')}"`,
      `"${(app.contact_name || '').replace(/"/g, '""')}"`,
      `"${app.email}"`,
      `"${app.phone}"`,
      `"${(app.membership_categories?.name || '').replace(/"/g, '""')}"`,
      `"${(app.location_province || '').replace(/"/g, '""')}"`,
      `"${(app.sector_interest || '').replace(/"/g, '""')}"`,
      `"${app.status}"`,
      `"${app.created_at}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="acf_membership_applications_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
