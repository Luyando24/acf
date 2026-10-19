import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { createClient } from '@/lib/supabase/server'

async function verifyAuth(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) return true

  const cookieHeader = request.headers.get('cookie') || ''
  if (cookieHeader.includes('acf_admin_session')) return true

  if (process.env.NODE_ENV !== 'production') return true

  return false
}

// Max 50 MB
const MAX_FILE_SIZE = 50 * 1024 * 1024

const ALLOWED_EXTENSIONS = new Set([
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'png', 'jpg', 'jpeg', 'webp', 'svg', 'gif',
])

export async function POST(request: Request) {
  try {
    const isAuthed = await verifyAuth(request)
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized staff access.' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file was provided in the upload request.' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum allowed threshold of 50MB (received ${(file.size / (1024 * 1024)).toFixed(1)}MB).` },
        { status: 400 }
      )
    }

    const originalName = file.name || 'uploaded-file'
    const ext = originalName.split('.').pop()?.toLowerCase() || ''

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `File type .${ext} is not supported. Allowed formats: PDF, Word, Excel, PNG, JPG, WebP, SVG.` },
        { status: 400 }
      )
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure public/uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Clean, unique filename
    const sanitizedBase = originalName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 50)
    const uniqueFileName = `${Date.now()}-${sanitizedBase}.${ext}`
    const filePath = join(uploadsDir, uniqueFileName)

    await writeFile(filePath, buffer)

    const publicUrl = `/uploads/${uniqueFileName}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: originalName,
      size: file.size,
      mimeType: file.type || `application/${ext}`,
    })
  } catch (error: any) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error processing file upload.' },
      { status: 500 }
    )
  }
}
