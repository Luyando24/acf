'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Shield,
} from 'lucide-react'
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import { SiteSettings } from '@/lib/supabase/settings'

interface FooterProps {
  settings: SiteSettings
}

export default function Footer({ settings }: FooterProps) {
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
        setMessage('Thank you for subscribing to ACF quarterly briefs & updates!')
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

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white border-t border-neutral-800">
      {/* Top Banner: Newsletter Subscription */}
      <div className="border-b border-neutral-800 bg-[#0c0c0c] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-800 text-neutral-300 border border-neutral-700 mb-3">
                <Shield size={12} /> Stay Informed
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Subscribe to ACF Agricultural Policy Updates
              </h2>
              <p className="text-neutral-400 text-sm mt-2 leading-relaxed">
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
                      className="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-6 py-3.5 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/40 disabled:opacity-50 cursor-pointer"
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
                    className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-white focus:ring-neutral-400"
                  />
                  <label htmlFor="newsletter-consent" className="text-xs text-neutral-400 leading-normal">
                    I consent to ACF processing my email address in accordance with Zambia's{' '}
                    <Link href="/privacy-policy" className="underline hover:text-white">
                      Data Protection Act, 2021
                    </Link>
                    . You may unsubscribe at any time.
                  </label>
                </div>

                {status === 'success' && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40">
                    <CheckCircle2 size={16} />
                    <span>{message}</span>
                  </div>
                )}

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 bg-rose-950/50 p-2.5 rounded-lg border border-rose-800/40">
                    <AlertCircle size={16} />
                    <span>{message}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Institutional Brand & Mandate */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block py-1">
              <div className="bg-white rounded-xl p-2.5 inline-block shadow-sm">
                <img
                  src={settings.logo_url || '/photos/logo.png'}
                  alt={settings.site_name || 'ACF Zambia'}
                  className="h-10 w-auto max-w-[190px] object-contain"
                />
              </div>
            </Link>

            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              The Agricultural Consultative Forum is a multi-stakeholder platform championing evidence-based policy dialogue, sustainable food systems, and secure tenure rights for Zambian smallholders.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  aria-label="ACF Facebook"
                >
                  <FacebookIcon size={17} />
                </a>
              )}
              {settings.twitter_url && (
                <a
                  href={settings.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  aria-label="ACF Twitter"
                >
                  <TwitterIcon size={17} />
                </a>
              )}
              {settings.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  aria-label="ACF LinkedIn"
                >
                  <LinkedinIcon size={17} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-200">
              Organisation
            </h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About ACF & Mission
                </Link>
              </li>
              <li>
                <Link href="/about/board" className="hover:text-white transition-colors">
                  Board of Directors
                </Link>
              </li>
              <li>
                <Link href="/about/management" className="hover:text-white transition-colors">
                  Management Team
                </Link>
              </li>
              <li>
                <Link href="/about/staff" className="hover:text-white transition-colors">
                  Secretariat Staff
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-white transition-colors">
                  Partners & Networks
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Programmes & Knowledge */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-200">
              Programmes & Work
            </h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/our-work" className="hover:text-white transition-colors">
                  All Thematic Areas
                </Link>
              </li>
              <li>
                <Link href="/publications" className="hover:text-white transition-colors">
                  Publications Repository
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white transition-colors">
                  News & Sector Updates
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Events & Policy Dialogues
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-white transition-colors">
                  Opportunities & Tenders
                </Link>
              </li>
              <li>
                <Link href="/facebook-posts" className="hover:text-white transition-colors">
                  Social Highlights
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Secretariat Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-200">
              Secretariat
            </h3>
            <div className="space-y-2.5 text-xs text-neutral-400 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-neutral-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-neutral-400 shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-neutral-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock size={15} className="text-neutral-400 shrink-0 mt-0.5" />
                <span>{settings.office_hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="border-t border-neutral-900 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {currentYear} Agricultural Consultative Forum (ACF). All rights reserved. Built by SpaceMinds Technologies.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy & Consent
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact Secretariat
            </Link>
            <span>•</span>
            <Link href="/admin/login" className="text-neutral-400 hover:text-white transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
