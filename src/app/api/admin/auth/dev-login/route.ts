import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const email = body.email || 'admin@acfzambia.org'

    const response = NextResponse.json({
      success: true,
      user: {
        email,
        role: 'super_admin',
        full_name: 'ACF Administrator',
      },
    })

    // Set HTTP-only admin session cookie
    response.cookies.set('acf_admin_session', JSON.stringify({ email, role: 'super_admin' }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 })
  }
}
