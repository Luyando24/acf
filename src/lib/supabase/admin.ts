import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { SupabaseDatabase } from '@/types/database.types'

/**
 * Server-only service role client for privileged backend operations (e.g. cron auto-archive, server actions).
 * NEVER import this into client components.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (
    !supabaseUrl ||
    !serviceRoleKey ||
    !supabaseUrl.startsWith('https://') ||
    supabaseUrl.includes('placeholder') ||
    serviceRoleKey.includes('placeholder') ||
    serviceRoleKey === process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured.')
  }

  return createSupabaseClient<SupabaseDatabase>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
