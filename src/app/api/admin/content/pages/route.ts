import { NextResponse } from 'next/server'
import { canEditPages } from '@/lib/auth/permissions'
import { requireStaff } from '@/lib/auth/session'
import { getPageContent, savePageContent } from '@/lib/supabase/pageContent'

const PAGE_SLUGS = new Set(['home', 'about', 'contact', 'membership'])

export async function GET(request: Request) {
  try {
    const auth = await requireStaff()
    if (!auth.ok) return auth.response

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug') || 'home'
    if (!PAGE_SLUGS.has(slug)) {
      return NextResponse.json({ error: 'Unknown page.' }, { status: 400 })
    }

    const content = await getPageContent(slug)
    return NextResponse.json({ success: true, slug, content })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve page content.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireStaff()
    if (!auth.ok) return auth.response
    const session = auth.session
    if (!canEditPages(session.role)) {
      return NextResponse.json(
        { error: 'You do not have permission for this action.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { slug, content } = body

    if (!slug || !content || !PAGE_SLUGS.has(slug)) {
      return NextResponse.json({ error: 'Missing slug or content in request.' }, { status: 400 })
    }

    const result = await savePageContent(slug, content)

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to save page content.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: `Successfully updated ${slug} page content.` })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update page content.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
