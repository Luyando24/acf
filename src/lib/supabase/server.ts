import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SupabaseDatabase } from '@/types/database.types'

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(
    url &&
    key &&
    !url.includes('placeholder') &&
    !key.includes('placeholder') &&
    url.startsWith('https://')
  )
}

export async function createClient() {
  const cookieStore = await cookies()
  const isConfigured = isSupabaseConfigured()

  return createServerClient<SupabaseDatabase>(
    isConfigured ? process.env.NEXT_PUBLIC_SUPABASE_URL! : 'https://placeholder-url.supabase.co',
    isConfigured ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! : 'placeholder-anon-key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
      // Prevent network timeout delays when Supabase credentials are placeholders
      global: isConfigured
        ? undefined
        : {
            fetch: async () => {
              return new Response(JSON.stringify([]), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              })
            },
          },
    }
  )
}
