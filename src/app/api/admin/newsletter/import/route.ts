import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { canAccessEntity } from '@/lib/auth/permissions'
import { requireStaff } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { parseSubscribersFromSpreadsheet } from '@/lib/uploads/excelSubscribers'

const ALLOWED_EXTENSIONS = new Set(['xlsx', 'xls', 'csv'])

export async function POST(request: Request) {
  try {
    const auth = await requireStaff()
    if (!auth.ok) return auth.response

    if (
      !canAccessEntity(auth.session.role, 'newsletter', 'POST') &&
      auth.session.role !== 'editor'
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to import newsletter subscribers.' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const rawStatus = String(formData.get('defaultStatus') || 'subscribed')
    const rawSource = String(formData.get('defaultSource') || 'excel_upload').trim() || 'excel_upload'

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Please select an Excel (.xlsx, .xls) or CSV (.csv) file to upload.' },
        { status: 400 }
      )
    }

    const ext = (file.name.split('.').pop() || '').toLowerCase()
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload an .xlsx, .xls, or .csv spreadsheet.' },
        { status: 400 }
      )
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Spreadsheet file exceeds the 15MB size limit.' },
        { status: 400 }
      )
    }

    const defaultStatus: 'subscribed' | 'unsubscribed' | 'pending' =
      rawStatus === 'pending' || rawStatus === 'unsubscribed' ? rawStatus : 'subscribed'

    const bytes = new Uint8Array(await file.arrayBuffer())
    const parsed = parseSubscribersFromSpreadsheet(bytes, file.name, defaultStatus, rawSource)

    if (parsed.subscribers.length === 0) {
      return NextResponse.json(
        {
          error:
            'No valid email addresses were found in the uploaded file. Ensure your Excel sheet has an Email column or a list of valid email addresses.',
        },
        { status: 400 }
      )
    }

    const nowIso = new Date().toISOString()
    const rowsToUpsert = parsed.subscribers.map((sub) => ({
      email: sub.email,
      status: sub.status,
      source: sub.source,
      consent_at: nowIso,
      confirmed_at: sub.status === 'subscribed' ? nowIso : null,
      created_at: nowIso,
    }))

    const adminClient = createAdminClient()
    const fromTable = (name: string) => (adminClient.from as (table: string) => any)(name)

    const { error: upsertError } = await fromTable('newsletter_subscribers').upsert(rowsToUpsert, {
      onConflict: 'email',
    })

    if (upsertError) {
      return NextResponse.json(
        { error: upsertError.message || 'Failed to save imported subscribers to database.' },
        { status: 400 }
      )
    }

    const { data: allSubscribers } = await fromTable('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false })

    revalidatePath('/admin/newsletter')

    return NextResponse.json({
      success: true,
      importedCount: parsed.subscribers.length,
      invalidOrSkippedCount: parsed.invalidOrSkippedCount,
      duplicateInFileCount: parsed.duplicateInFileCount,
      subscribers: allSubscribers || [],
    })
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'Failed to import Excel subscribers.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
