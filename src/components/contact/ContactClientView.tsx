'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import { ContactPageContent, DEFAULT_CONTACT_PAGE_CONTENT } from '@/types/pageContent'

interface ContactClientViewProps {
  initialContent?: ContactPageContent
}

export default function ContactClientView({ initialContent }: ContactClientViewProps) {
  const content = initialContent || DEFAULT_CONTACT_PAGE_CONTENT

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    consent_given: false,
    honeypot: '',
  })

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.honeypot) return // Bot trap

    if (!formData.consent_given) {
      setStatus('error')
      setFeedback('You must consent to data processing under the Data Protection Act.')
      return
    }

    setStatus('submitting')
    setFeedback('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await res.json()

      if (res.ok) {
        setStatus('success')
        setFeedback('Thank you! Your enquiry has been received by the ACF Secretariat.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          consent_given: false,
          honeypot: '',
        })
      } else {
        setStatus('error')
        setFeedback(result.error || 'Failed to send message. Please review the form.')
      }
    } catch {
      setStatus('error')
      setFeedback('A network error occurred. Please try again.')
    }
  }

  const header = content.header || DEFAULT_CONTACT_PAGE_CONTENT.header
  const details = content.details || DEFAULT_CONTACT_PAGE_CONTENT.details
  const social = content.social_links || DEFAULT_CONTACT_PAGE_CONTENT.social_links
  const mapInfo = content.map_info || DEFAULT_CONTACT_PAGE_CONTENT.map_info

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#0f1d14] text-white py-16 lg:py-20 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#a3e635] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 inline-block">
            {header.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            {header.title}
          </h1>
          <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {header.description}
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-5xl pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#0f1d14]">{details.title}</h2>
              <p className="text-xs text-[#5c6f62] mt-1 leading-relaxed">
                {details.subtitle}
              </p>
            </div>

            <div className="space-y-6 text-sm text-[#3b4d41]">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#e2ebe4] shadow-xs">
                <MapPin size={20} className="text-[#175432] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#0f1d14] text-xs uppercase tracking-wider mb-1">
                    Physical Address
                  </h3>
                  <p className="text-xs text-[#5c6f62]">{details.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#e2ebe4] shadow-xs">
                <Phone size={20} className="text-[#175432] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#0f1d14] text-xs uppercase tracking-wider mb-1">
                    Direct Phone Line
                  </h3>
                  <a href={`tel:${details.phone.replace(/\s+/g, '')}`} className="text-xs font-bold text-[#175432] hover:underline">
                    {details.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#e2ebe4] shadow-xs">
                <Mail size={20} className="text-[#175432] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#0f1d14] text-xs uppercase tracking-wider mb-1">
                    Official Email
                  </h3>
                  <a href={`mailto:${details.email}`} className="text-xs font-bold text-[#175432] hover:underline">
                    {details.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#e2ebe4] shadow-xs">
                <Clock size={20} className="text-[#175432] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#0f1d14] text-xs uppercase tracking-wider mb-1">
                    Working Hours
                  </h3>
                  <p className="text-xs text-[#5c6f62]">{details.working_hours}</p>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f1d14]">
                Social Media Channels
              </h3>
              <div className="flex items-center gap-3">
                {social.facebook_url && (
                  <a
                    href={social.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white border border-[#e2ebe4] text-[#175432] hover:bg-[#175432] hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <FacebookIcon size={18} />
                  </a>
                )}
                {social.twitter_url && (
                  <a
                    href={social.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white border border-[#e2ebe4] text-[#175432] hover:bg-[#175432] hover:text-white transition-colors"
                    aria-label="Twitter"
                  >
                    <TwitterIcon size={18} />
                  </a>
                )}
                {social.linkedin_url && (
                  <a
                    href={social.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white border border-[#e2ebe4] text-[#175432] hover:bg-[#175432] hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Contact Enquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl border border-[#e2ebe4] p-6 sm:p-10 shadow-xs space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-[#0f1d14]">Send an Enquiry</h2>
                <p className="text-xs text-[#5c6f62] mt-1">
                  Fill in the form below and an ACF officer will respond promptly.
                </p>
              </div>

              {/* Honeypot field for bot suppression */}
              <input
                type="text"
                name="user_confirm_token"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {status === 'success' && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-[#2da44e]" />
                  <span>{feedback}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{feedback}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0f1d14]">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Mwamba Banda"
                    className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0f1d14]">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@organization.org.zm"
                    className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0f1d14]">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+260 95 0000000"
                    className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0f1d14]">Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Policy Enquiry / Research Access"
                    className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">Message / Details *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can the Agricultural Consultative Forum assist you?"
                  className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="p-4 rounded-xl bg-[#f6f9f6] border border-[#e2ebe4] flex items-start gap-3">
                <input
                  type="checkbox"
                  id="contact-consent"
                  checked={formData.consent_given}
                  onChange={(e) => setFormData({ ...formData, consent_given: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-[#e2ebe4] text-[#175432] focus:ring-[#175432]"
                />
                <label htmlFor="contact-consent" className="text-xs text-[#3b4d41] leading-relaxed">
                  I consent to the Agricultural Consultative Forum processing my contact details to reply to this enquiry, pursuant to Zambia&apos;s{' '}
                  <Link href="/privacy-policy" className="underline font-bold text-[#175432]">
                    Data Protection Act, 2021
                  </Link>
                  .
                </label>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-4 bg-[#175432] hover:bg-[#114227] text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Send size={16} />
                <span>{status === 'submitting' ? 'Sending Message...' : 'Submit Message to Secretariat'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Interactive Location Map Container */}
        <div className="mt-16 bg-white rounded-3xl border border-[#e2ebe4] p-4 sm:p-6 shadow-xs overflow-hidden space-y-4">
          <div className="flex items-center gap-2 px-2">
            <MapPin size={18} className="text-[#175432]" />
            <h3 className="text-sm font-bold text-[#0f1d14]">{mapInfo.location_title}</h3>
          </div>
          <div className="w-full h-80 rounded-2xl overflow-hidden border border-[#e2ebe4]">
            <iframe
              title="Agricultural Consultative Forum Lusaka Office"
              src={mapInfo.google_maps_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15383.159495427494!2d28.3188!3d-15.4289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19408b0000000001%3A0x1!2sWoodlands%2C%20Lusaka%2C%20Zambia!5e0!3m2!1sen!2szm!4v1700000000000!5m2!1sen!2szm"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
