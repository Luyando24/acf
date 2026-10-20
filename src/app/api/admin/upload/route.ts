import { NextResponse } from 'next/server'
import { canUpload } from '@/lib/auth/permissions'
import { requireStaff } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { PUBLIC_MEDIA_BUCKET, validateUpload } from '@/lib/uploads/policy'

async function ensureBucket(bucket: string, isPublic: boolean) {
  const admin = createAdminClient()
  const existing = await admin.storage.getBucket(bucket)
  if (existing.data) return admin

  const created = await admin.storage.createBucket(bucket, {
    public: isPublic,
    fileSizeLimit: bucket === PUBLIC_MEDIA_BUCKET ? 15 * 1024 * 1024 : 50 * 1024 * 1024,
  })
  if (created.error && !/already exists/i.test(created.error.message)) {
    throw new Error(created.error.message)
  }
  return admin
}

export async function POST(request: Request) {
  try {
    const auth = await requireStaff()
    if (!auth.ok) return auth.response
    if (!canUpload(auth.session.role)) {
      return NextResponse.json(
        { error: 'You do not have permission for this action.' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const requestedKind = formData.get('kind')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file was provided in the upload request.' }, { status: 400 })
    }

    const bytes = new Uint8Array(await file.arrayBuffer())
    const checked = validateUpload({
      filename: file.name || '',
      declaredMime: file.type || '',
      size: file.size,
      bytes,
      requestedKind: typeof requestedKind === 'string' ? requestedKind : undefined,
    })

    if (!checked.ok) {
      return NextResponse.json({ error: checked.error }, { status: 400 })
    }

    const admin = await ensureBucket(checked.bucket, checked.kind === 'image')
    const uploaded = await admin.storage.from(checked.bucket).upload(checked.objectName, bytes, {
      contentType: checked.mimeType,
      upsert: false,
    })

    if (uploaded.error) {
      return NextResponse.json({ error: 'The file could not be stored.' }, { status: 500 })
    }

    const url =
      checked.kind === 'image'
        ? admin.storage.from(checked.bucket).getPublicUrl(checked.objectName).data.publicUrl
        : `/api/files/${checked.bucket}/${checked.objectName}`

    return NextResponse.json({
      success: true,
      url,
      fileName: checked.objectName,
      size: file.size,
      mimeType: checked.mimeType,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error processing file upload.'
    if (message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return NextResponse.json({ error: 'File storage is not configured.' }, { status: 503 })
    }
    return NextResponse.json({ error: 'Internal server error processing file upload.' }, { status: 500 })
  }
}
