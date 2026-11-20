'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, AlertCircle, Shield } from 'lucide-react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (honeypot) return // Bot trap

    if (!consent) {
      setStatus('error')
      setMessage('Please consent to receiving updates under the Data Protection Act.')
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent_given: consent, honeypot }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'Your address has been recorded.')
        setEmail('')
        setConsent(false)
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('A network error occurred. Please try again.')
    }
  }

  return (
    <section className="bg-[#eef6f1] border border-[#dbe6de] rounded-3xl p-8 sm:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1e7e48]/10 text-[#1e7e48] border border-[#1e7e48]/20 mb-3">
            <Shield size={12} /> Stay Informed
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#122419] tracking-tight">
            Subscribe to ACF Agricultural Policy Updates
          </h2>
          <p className="text-[#526658] text-sm mt-2 leading-relaxed">
            Receive policy analysis briefs, agricultural dialogue reports, and quarterly sector newsletters directly to your inbox.
          </p>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={handleSubscribe} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Honeypot field for bot suppression */}
              <input
                type="text"
                name="website_verify"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="relative flex-grow">
                <input
                  type="email"
                  required
                  placeholder="Enter your official email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-[#dbe6de] rounded-xl text-[#122419] placeholder-[#526658]/70 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7e48] transition-all shadow-2xs"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3.5 bg-[#1e7e48] hover:bg-[#166538] text-white font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#1e7e48]/20 disabled:opacity-50 cursor-pointer"
              >
                <span>{status === 'loading' ? 'Subscribing...' : 'Subscribe'}</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="newsletter-consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#dbe6de] text-[#1e7e48] focus:ring-[#1e7e48]"
              />
              <label htmlFor="newsletter-consent" className="text-xs text-[#526658] leading-normal">
                I consent to ACF processing my email address in accordance with Zambia&apos;s{' '}
                <Link href="/privacy-policy" className="underline hover:text-[#1e7e48] font-semibold text-[#122419]">
                  Data Protection Act, 2021
                </Link>
                . You may unsubscribe at any time.
              </label>
            </div>

            {status === 'success' && (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1e7e48] bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                <CheckCircle2 size={16} />
                <span>{message}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                <AlertCircle size={16} />
                <span>{message}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
