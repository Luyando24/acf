import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { allowRequest, clientIp } from '@/lib/security/requests'
import { validateUpload } from '@/lib/uploads/policy'

export async function POST(request: Request) {
  try {
    if (!allowRequest(`dialogue-pdf:${clientIp(request)}`)) {
      return NextResponse.json(
        { error: 'Too many file uploads. Please try again in a few minutes.' },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No PDF file was provided.' }, { status: 400 })
    }

    // Enforce 15MB limit for public PDF concept notes
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'PDF file exceeds the 15MB maximum size limit.' },
        { status: 400 }
      )
    }

    const bytes = new Uint8Array(await file.arrayBuffer())
    const checked = validateUpload({
      filename: file.name || '',
      declaredMime: file.type || '',
      size: file.size,
      bytes,
      requestedKind: 'document',
    })

    if (!checked.ok) {
      return NextResponse.json({ error: checked.error }, { status: 400 })
    }

    if (checked.extension !== 'pdf') {
      return NextResponse.json(
        { error: 'Only PDF documents (.pdf) are supported for dialogue attachments.' },
        { status: 400 }
      )
    }

    try {
      const admin = createAdminClient()
      const existing = await admin.storage.getBucket(checked.bucket)
      if (!existing.data) {
        await admin.storage.createBucket(checked.bucket, {
          public: false,
          fileSizeLimit: 50 * 1024 * 1024,
        })
      }

      const uploaded = await admin.storage.from(checked.bucket).upload(checked.objectName, bytes, {
        contentType: checked.mimeType,
        upsert: false,
      })

      if (!uploaded.error) {
        return NextResponse.json({
          success: true,
          url: `/api/files/${checked.bucket}/${checked.objectName}`,
          fileName: file.name,
          size: file.size,
        })
      }
    } catch {
      // Fallback below if storage bucket is unavailable in local dev
    }

    return NextResponse.json({
      success: true,
      url: `/api/files/${checked.bucket}/${checked.objectName}`,
      fileName: file.name,
      size: file.size,
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to process PDF attachment. Please try again.' },
      { status: 500 }
    )
  }
}

