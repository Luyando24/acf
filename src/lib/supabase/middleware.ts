import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/database.types'

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Fast path: Public routes (/about, /contact, /our-work, /news, /, etc.)
  // do not require admin session checks. Return immediately with zero overhead.
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next({ request })
  }

  // Admin auth check
  const adminCookie = request.cookies.get('acf_admin_session')?.value
  let isAuthenticated = Boolean(adminCookie)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasSupabase = Boolean(
    supabaseUrl &&
    anonKey &&
    !supabaseUrl.includes('placeholder') &&
    !anonKey.includes('placeholder')
  )

  let supabaseResponse = NextResponse.next({ request })

  if (!isAuthenticated && hasSupabase) {
    try {
      const supabase = createServerClient<Database>(
        supabaseUrl!,
        anonKey!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
              supabaseResponse = NextResponse.next({ request })
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              )
            },
          },
        }
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (user) isAuthenticated = true
    } catch {
      // Supabase connection fallback
    }
  }

  // Protect /admin routes (except login and auth callbacks)
  if (!pathname.startsWith('/admin/login') && !pathname.startsWith('/admin/auth')) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  // Redirect logged-in admin from /admin/login to /admin
  if (pathname === '/admin/login' && isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
