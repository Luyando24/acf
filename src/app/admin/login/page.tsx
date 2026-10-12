'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'

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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setStatus('error')
        setErrorMessage(error.message || 'Invalid email or password.')
      } else {
        router.push(redirect)
        router.refresh()
      }
    } catch (err: any) {
      setStatus('error')
      setErrorMessage(err.message || 'Authentication failed. Please try again.')
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
          <label className="text-xs font-bold text-[#0f1d14]">Official Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-3.5 text-[#5c6f62]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@acfzambia.org"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0f1d14]">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-3.5 text-[#5c6f62]" />
            <input
              type="password"
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
          disabled={status === 'loading'}
          className="w-full py-3.5 bg-[#175432] hover:bg-[#114227] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>{status === 'loading' ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
          <ArrowRight size={14} />
        </button>
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
