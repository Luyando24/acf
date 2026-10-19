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
import type { SiteSettings } from '@/lib/supabase/settings'

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
    <footer className="bg-[#0a140e] text-white border-t border-[#1a3020]">
      {/* Top Banner: Newsletter Subscription */}
      <div className="border-b border-[#16291b] bg-[#0d1a12] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#175432] text-[#a3e635] mb-3">
                <Shield size={12} /> Stay Informed
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Subscribe to ACF Agricultural Policy Updates
              </h2>
              <p className="text-emerald-100/70 text-sm mt-2 leading-relaxed">
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
                      className="w-full px-4 py-3.5 bg-[#122419] border border-[#213f2a] rounded-xl text-white placeholder-emerald-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#34a853] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-6 py-3.5 bg-[#2da44e] hover:bg-[#34a853] text-[#0a140e] font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2da44e]/20 disabled:opacity-50 cursor-pointer"
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
                    className="mt-1 h-4 w-4 rounded border-[#213f2a] bg-[#122419] text-[#2da44e] focus:ring-[#2da44e]"
                  />
                  <label htmlFor="newsletter-consent" className="text-xs text-emerald-200/70 leading-normal">
                    I consent to ACF processing my email address in accordance with Zambia's{' '}
                    <Link href="/privacy-policy" className="underline hover:text-white">
                      Data Protection Act, 2021
                    </Link>
                    . You may unsubscribe at any time.
                  </label>
                </div>

                {status === 'success' && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#a3e635] bg-[#175432]/50 p-2.5 rounded-lg border border-[#2da44e]/30">
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
      <div className="container mx-auto px-4 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16">
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

            <p className="text-emerald-100/75 text-sm leading-relaxed max-w-sm">
              The Agricultural Consultative Forum is a multi-stakeholder platform championing evidence-based policy dialogue, sustainable food systems, and secure tenure rights for Zambian smallholders.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#14281b] border border-[#23432d] flex items-center justify-center text-emerald-300 hover:text-white hover:bg-[#175432] transition-colors"
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
                  className="w-9 h-9 rounded-full bg-[#14281b] border border-[#23432d] flex items-center justify-center text-emerald-300 hover:text-white hover:bg-[#175432] transition-colors"
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
                  className="w-9 h-9 rounded-full bg-[#14281b] border border-[#23432d] flex items-center justify-center text-emerald-300 hover:text-white hover:bg-[#175432] transition-colors"
                  aria-label="ACF LinkedIn"
                >
                  <LinkedinIcon size={17} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#a3e635]">
              Organisation
            </h3>
            <ul className="space-y-2 text-sm text-emerald-100/75">
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
            <h3 className="text-xs font-black uppercase tracking-widest text-[#a3e635]">
              Programmes & Work
            </h3>
            <ul className="space-y-2 text-sm text-emerald-100/75">
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
            <h3 className="text-xs font-black uppercase tracking-widest text-[#a3e635]">
              Secretariat
            </h3>
            <div className="space-y-2.5 text-xs text-emerald-100/75 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#a3e635] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#a3e635] shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#a3e635] shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock size={15} className="text-[#a3e635] shrink-0 mt-0.5" />
                <span>{settings.office_hours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Darker Green Copyright & Compliance Section */}
      <div className="bg-[#050b07] border-t border-[#102216] py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-200/50">
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
          </div>
        </div>
      </div>
    </footer>
  )
}
