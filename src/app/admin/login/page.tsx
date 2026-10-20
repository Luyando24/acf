'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react'
import { isStaffRole, safeAdminRedirect } from '@/lib/auth/permissions'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = safeAdminRedirect(searchParams.get('redirect'))
  const configured = isSupabaseConfigured()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error || !data?.session || !data.user) {
        setStatus('error')
        setErrorMessage(error?.message || 'Invalid credentials or authentication error.')
        return
      }

      const { data: profileRow, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_active')
        .eq('id', data.user.id)
        .maybeSingle()

      const profile = profileRow as { role: string; is_active: boolean } | null

      if (profileError || !profile?.is_active || !isStaffRole(profile.role)) {
        await supabase.auth.signOut()
        setStatus('error')
        setErrorMessage(
          'This account is not an active ACF staff profile. Ask a super admin to grant access.'
        )
        return
      }

      router.push(redirect)
      router.refresh()
    } catch {
      setStatus('error')
      setErrorMessage('Authentication failed. Please check credentials.')
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#1b3424] space-y-6">
      <div className="text-center space-y-2">
        <img
          src="/photos/logo.png"
          alt="ACF Zambia"
          className="h-14 w-auto mx-auto object-contain mb-3"
        />
        <h1 className="text-2xl font-black text-[#0f1d14] tracking-tight">
          Staff Portal Login
        </h1>
        <p className="text-xs text-[#5c6f62]">
          Authorised Agricultural Consultative Forum personnel only
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="admin-email" className="text-xs font-bold text-[#0f1d14]">
            Official Email Address
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-3.5 text-[#5c6f62]" />
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@acfzambia.org"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="admin-password" className="text-xs font-bold text-[#0f1d14]">
            Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-3.5 text-[#5c6f62]" />
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || !configured}
          className="w-full py-3.5 bg-[#175432] hover:bg-[#114227] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>{status === 'loading' ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
          <ArrowRight size={14} />
        </button>

        {!configured && (
          <p className="text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl p-3">
            Staff sign-in is not configured. Set the Supabase URL and anon key before using this portal.
          </p>
        )}
      </form>

      <div className="pt-4 border-t border-[#e2ebe4] text-center text-xs text-[#5c6f62]">
        <Link href="/" className="hover:text-[#175432] font-semibold transition-colors">
          ← Return to Public Website
        </Link>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a140e] p-4 text-[#142018]">
      <Suspense fallback={<div className="text-white text-xs">Loading portal...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  )
}
