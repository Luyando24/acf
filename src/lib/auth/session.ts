import { NextResponse } from 'next/server'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import type { UserRole } from '@/types/database.types'
import { isStaffRole } from './permissions'

export interface StaffSession {
  userId: string
  email: string
  role: UserRole
}

export async function getStaffSession(): Promise<StaffSession | null> {
  if (!isSupabaseConfigured()) return null

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('role, is_active, email')
    .eq('id', user.id)
    .maybeSingle()

  const profile = data as { role: string; is_active: boolean; email: string } | null

  if (error || !profile || !profile.is_active || !isStaffRole(profile.role)) {
    return null
  }

  return {
    userId: user.id,
    email: profile.email || user.email || '',
    role: profile.role,
  }
}

export type StaffGate =
  | { ok: true; session: StaffSession }
  | { ok: false; response: NextResponse }

export async function requireStaff(allowed?: readonly UserRole[]): Promise<StaffGate> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Staff sign-in is not configured.' },
        { status: 503 }
      ),
    }
  }

  const session = await getStaffSession()
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized staff access.' }, { status: 401 }),
    }
  }

  if (allowed && !allowed.includes(session.role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'You do not have permission for this action.' },
        { status: 403 }
      ),
    }
  }

  return { ok: true, session }
}
