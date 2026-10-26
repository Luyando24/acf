import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  PUBLIC_MEDIA_BUCKET,
  isServableDocumentPath,
  parseStoredFileUrl,
} from '@/lib/uploads/policy'

function unavailable() {
  return new Response('Document not available.', { status: 404 })
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const admin = createAdminClient()
    const { data: pub } = await admin
      .from('publications')
      .select('id, file_path, download_count')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (!pub) return unavailable()

    const filePath = pub.file_path || ''
    if (!isServableDocumentPath(filePath)) return unavailable()

    let target: string | null = null
    const stored = parseStoredFileUrl(filePath)

    if (stored) {
      const extension = stored.objectName.split('.').pop() || 'pdf'
      const downloadName = `${slug}.${extension}`

      if (stored.bucket === PUBLIC_MEDIA_BUCKET) {
        target = admin.storage.from(stored.bucket).getPublicUrl(stored.objectName, {
          download: downloadName,
        }).data.publicUrl
      } else {
        const signed = await admin.storage
          .from(stored.bucket)
          .createSignedUrl(stored.objectName, 60, { download: downloadName })
        target = signed.data?.signedUrl ?? null
      }
    } else {
      target = filePath
    }

    if (!target) return unavailable()

    await admin
      .from('publications')
      .update({ download_count: (pub.download_count ?? 0) + 1 })
      .eq('id', pub.id)

    return NextResponse.redirect(target)
  } catch {
    return unavailable()
  }
}
