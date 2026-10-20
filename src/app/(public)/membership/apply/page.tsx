'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Send,
  Building,
  User,
  Shield,
  FileCheck,
} from 'lucide-react'
import TurnstileBox from '@/components/forms/TurnstileBox'

export default function MembershipApplyPage() {
  const [formData, setFormData] = useState({
    applicant_type: 'organisation',
    org_name: '',
    contact_name: '',
    email: '',
    phone: '',
    category_id: '1',
    location_province: 'Lusaka',
    sector_interest: 'General Agriculture & Policy',
    message: '',
    consent_given: false,
    honeypot: '',
  })

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const provinces = [
    'Central Province',
    'Copperbelt Province',
    'Eastern Province',
    'Luapula Province',
    'Lusaka Province',
    'Muchinga Province',
    'Northern Province',
    'North-Western Province',
    'Southern Province',
    'Western Province',
    'International / Regional',
  ]

  const [turnstileToken, setTurnstileToken] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.honeypot) return // Bot trap

    if (!formData.consent_given) {
      setStatus('error')
      setErrorMessage('You must agree to the data consent statement before submitting.')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, turnstile_token: turnstileToken }),
      })
      const result = await res.json()

      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Failed to submit application. Please check your inputs.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('A network connection error occurred. Please try again.')
    }
  }

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#0f1d14] text-white py-16 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-3xl space-y-3">
          <Link
            href="/membership"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Membership Overview</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Apply for ACF Membership
          </h1>
          <p className="text-emerald-100/80 text-sm sm:text-base">
            Submit your institutional details to join the Agricultural Consultative Forum caucuses.
          </p>
        </div>
      </section>

      {/* Main Form Layout */}
      <div className="container mx-auto px-4 max-w-3xl pt-12">
        {status === 'success' ? (
          <div className="bg-white rounded-3xl border border-[#e2ebe4] p-8 sm:p-12 text-center shadow-lg space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#f0f6f1] text-[#2da44e] flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-black text-[#0f1d14]">
              Application Submitted Successfully!
            </h2>
            <p className="text-sm text-[#5c6f62] max-w-md mx-auto leading-relaxed">
              Thank you for applying for ACF membership. The Secretariat in Lusaka has received your application. A membership officer will review your submission and contact you within 5 business days.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="px-6 py-3 bg-[#175432] hover:bg-[#114227] text-white font-bold text-xs rounded-full transition-colors inline-block"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-[#e2ebe4] p-6 sm:p-10 shadow-xs space-y-8"
          >
            {/* Honeypot field for bot suppression */}
            <input
              type="text"
              name="company_tax_id"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Applicant Type Selection */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-[#0f1d14]">
                Applicant Classification
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, applicant_type: 'organisation' })}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                    formData.applicant_type === 'organisation'
                      ? 'border-[#175432] bg-[#f0f6f1] text-[#175432]'
                      : 'border-[#e2ebe4] text-[#5c6f62] hover:bg-gray-50'
                  }`}
                >
                  <Building size={18} />
                  <span className="text-xs font-bold">Organisation / Entity</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, applicant_type: 'individual' })}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                    formData.applicant_type === 'individual'
                      ? 'border-[#175432] bg-[#f0f6f1] text-[#175432]'
                      : 'border-[#e2ebe4] text-[#5c6f62] hover:bg-gray-50'
                  }`}
                >
                  <User size={18} />
                  <span className="text-xs font-bold">Individual Expert</span>
                </button>
              </div>
            </div>

            {/* Contact Information Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {formData.applicant_type === 'organisation' && (
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-[#0f1d14]">
                    Organisation / Company / Association Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.org_name}
                    onChange={(e) => setFormData({ ...formData, org_name: e.target.value })}
                    placeholder="e.g. Lusaka Grain Growers Cooperative"
                    className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">
                  Contact Person Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  placeholder="e.g. Mwamba Banda"
                  className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@organization.org.zm"
                  className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">
                  Phone Number (Zambia or International) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+260 97 0000000"
                  className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">
                  Primary Location / Province *
                </label>
                <select
                  value={formData.location_province}
                  onChange={(e) => setFormData({ ...formData, location_province: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none bg-white"
                >
                  {provinces.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">
                  Primary Area of Agricultural Focus *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sector_interest}
                  onChange={(e) => setFormData({ ...formData, sector_interest: e.target.value })}
                  placeholder="e.g. Maize and soya value chains, irrigation policy, seed systems"
                  className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">
                  Brief Statement / Expected Engagement (Optional)
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share a brief overview of your organization and why you are seeking to join ACF..."
                  className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
                />
              </div>
            </div>

            <TurnstileBox onToken={setTurnstileToken} />

            {/* Consent Checkbox complying with Data Protection Act 2021 */}
            <div className="p-4 rounded-xl bg-[#f6f9f6] border border-[#e2ebe4] flex items-start gap-3">
              <input
                type="checkbox"
                id="apply-consent"
                checked={formData.consent_given}
                onChange={(e) => setFormData({ ...formData, consent_given: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-[#e2ebe4] text-[#175432] focus:ring-[#175432]"
              />
              <label htmlFor="apply-consent" className="text-xs text-[#3b4d41] leading-relaxed">
                I hereby declare that the information provided is accurate and consent to the Agricultural Consultative Forum processing these details for membership evaluation in compliance with Zambia&apos;s{' '}
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
              <span>{status === 'submitting' ? 'Submitting Application...' : 'Submit Application to Secretariat'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
