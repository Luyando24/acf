import { createBrowserClient } from '@supabase/ssr'
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

export function createClient() {
  const isConfigured = isSupabaseConfigured()

  return createBrowserClient<SupabaseDatabase>(
    isConfigured ? process.env.NEXT_PUBLIC_SUPABASE_URL! : 'https://placeholder-url.supabase.co',
    isConfigured ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! : 'placeholder-anon-key',
    {
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
