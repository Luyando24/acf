import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-revalidate-secret') || request.nextUrl.searchParams.get('secret')
    const expectedSecret = process.env.REVALIDATE_SECRET || 'dev_revalidate_secret_key'

    if (secret !== expectedSecret) {
      return NextResponse.json({ message: 'Invalid revalidation secret' }, { status: 401 })
    }

    const { path } = await request.json()

    if (!path) {
      return NextResponse.json({ message: 'Path is required' }, { status: 400 })
    }

    revalidatePath(path)
    return NextResponse.json({ revalidated: true, path, now: Date.now() })
  } catch (err: any) {
    return NextResponse.json({ message: 'Error revalidating', error: err.message }, { status: 500 })
  }
}
