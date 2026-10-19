import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPageContent, savePageContent } from '@/lib/supabase/pageContent'

async function verifyAuth(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) return true

  const cookieHeader = request.headers.get('cookie') || ''
  if (cookieHeader.includes('acf_admin_session')) return true

  if (process.env.NODE_ENV !== 'production') return true

  return false
}

export async function GET(request: Request) {
  try {
    const isAuthed = await verifyAuth(request)
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized staff access.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug') || 'home'

    const content = await getPageContent(slug)
    return NextResponse.json({ success: true, slug, content })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to retrieve page content.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const isAuthed = await verifyAuth(request)
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized staff access.' }, { status: 401 })
    }

    const body = await request.json()
    const { slug, content } = body

    if (!slug || !content) {
      return NextResponse.json({ error: 'Missing slug or content in request.' }, { status: 400 })
    }

    const result = await savePageContent(slug, content)

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to save page content.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: `Successfully updated ${slug} page content.` })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update page content.' }, { status: 500 })
  }
}
