import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut().catch(() => {})
    const response = NextResponse.json({ success: true })
    response.cookies.delete('acf_admin_session')
    return response
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sign out failed.'
    const response = NextResponse.json({ success: false, error: message }, { status: 500 })
    response.cookies.delete('acf_admin_session')
    return response
  }
}
