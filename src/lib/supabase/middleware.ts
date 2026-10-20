import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isStaffRole, safeAdminRedirect } from '@/lib/auth/permissions'
import { SupabaseDatabase } from '@/types/database.types'

function clearLegacyAdminCookie(response: NextResponse) {
  response.cookies.set('acf_admin_session', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  })
  return response
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next({ request })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasSupabase = Boolean(
    supabaseUrl &&
      anonKey &&
      !supabaseUrl.includes('placeholder') &&
      !anonKey.includes('placeholder') &&
      supabaseUrl.startsWith('https://')
  )

  let supabaseResponse = NextResponse.next({ request })
  let isStaff = false

  if (hasSupabase) {
    try {
      const supabase = createServerClient<SupabaseDatabase>(supabaseUrl!, anonKey!, {
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
      })

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role, is_active')
          .eq('id', user.id)
          .maybeSingle()

        const profile = data as { role: string; is_active: boolean } | null
        isStaff = Boolean(profile?.is_active && isStaffRole(profile.role))
      }
    } catch {
      isStaff = false
    }
  }

  if (!pathname.startsWith('/admin/login')) {
    if (!isStaff) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.search = ''
      url.searchParams.set('redirect', safeAdminRedirect(pathname))
      return clearLegacyAdminCookie(NextResponse.redirect(url))
    }
  }

  if (pathname === '/admin/login' && isStaff) {
    const url = request.nextUrl.clone()
    const nextPath = safeAdminRedirect(request.nextUrl.searchParams.get('redirect'))
    url.pathname = nextPath
    url.search = ''
    return clearLegacyAdminCookie(NextResponse.redirect(url))
  }

  return clearLegacyAdminCookie(supabaseResponse)
}
