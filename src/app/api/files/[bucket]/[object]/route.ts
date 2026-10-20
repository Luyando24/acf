import { NextResponse } from 'next/server'
import { getStaffSession } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { PRIVATE_UPLOADS_BUCKET, PUBLIC_MEDIA_BUCKET, isStoredObject } from '@/lib/uploads/policy'

async function isPublishedFile(objectName: string): Promise<boolean> {
  const admin = createAdminClient()
  const needle = `%${objectName}%`

  const publication = await admin
    .from('publications')
    .select('id')
    .eq('status', 'published')
    .ilike('file_path', needle)
    .limit(1)

  if (publication.data && publication.data.length > 0) return true

  const opportunity = await admin
    .from('opportunities')
    .select('id')
    .eq('status', 'published')
    .ilike('attachment_url', needle)
    .limit(1)

  return Boolean(opportunity.data && opportunity.data.length > 0)
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bucket: string; object: string }> }
) {
  const { bucket, object } = await params
  if (!isStoredObject(bucket, object)) {
    return NextResponse.json({ error: 'File not found.' }, { status: 404 })
  }

  try {
    const admin = createAdminClient()

    if (bucket === PUBLIC_MEDIA_BUCKET) {
      const { data } = admin.storage.from(bucket).getPublicUrl(object)
      return NextResponse.redirect(data.publicUrl)
    }

    if (bucket !== PRIVATE_UPLOADS_BUCKET) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 })
    }

    const staff = await getStaffSession()
    const published = staff ? true : await isPublishedFile(object)
    if (!published) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 })
    }

    const signed = await admin.storage.from(bucket).createSignedUrl(object, 60)
    if (signed.error || !signed.data?.signedUrl) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 })
    }

    return NextResponse.redirect(signed.data.signedUrl)
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return NextResponse.json({ error: 'File storage is not configured.' }, { status: 503 })
    }
    return NextResponse.json({ error: 'File not found.' }, { status: 404 })
  }
}
