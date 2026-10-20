import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { safeRevalidatePath } from '@/lib/security/requests'

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.REVALIDATE_SECRET
  const secret = request.headers.get('x-revalidate-secret')

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid revalidation secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const path = safeRevalidatePath(body?.path)

    if (!path) {
      return NextResponse.json({ message: 'A site path is required' }, { status: 400 })
    }

    revalidatePath(path)
    return NextResponse.json({ revalidated: true, path })
  } catch {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
