'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
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

export interface MembershipCategoryOption {
  id: string
  name: string
}

interface MembershipApplyFormProps {
  categories: MembershipCategoryOption[]
}

export default function MembershipApplyForm({ categories }: MembershipApplyFormProps) {
  const searchParams = useSearchParams()
  const initialCategoryParam = searchParams.get('category') || ''

  const defaultCategory =
    categories.find((c) => c.id === initialCategoryParam)?.id ||
    categories[0]?.id ||
    ''

  const [formData, setFormData] = useState({
    applicant_type: 'organisation' as 'organisation' | 'individual',
    org_name: '',
    contact_name: '',
    email: '',
    phone: '',
    category_id: defaultCategory,
    location_province: 'Lusaka Province',
    sector_interest: 'General Agriculture & Policy',
    message: '',
    consent_given: false,
    honeypot: '',
  })

  // Sync category_id if query parameter changes
  useEffect(() => {
    if (initialCategoryParam && categories.some((c) => c.id === initialCategoryParam)) {
      setFormData((prev) => ({ ...prev, category_id: initialCategoryParam }))
    }
  }, [initialCategoryParam, categories])

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

    if (!formData.category_id) {
      setStatus('error')
      setErrorMessage('Please select a membership category.')
      return
    }

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
      <section className="bg-[#153e28] text-white py-16 border-b border-[#1e4a32]">
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
          <p className="text-emerald-100/90 text-sm sm:text-base">
            Submit your institutional details to join the Agricultural Consultative Forum caucuses.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-3xl pt-12">
        {status === 'success' ? (
          <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 text-center shadow-xs space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#1e7e48] flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#122419]">
                Membership Application Received
              </h2>
              <p className="text-sm text-[#526658] max-w-md mx-auto leading-relaxed">
                Thank you for applying to join the Agricultural Consultative Forum. Your submission has been securely recorded and dispatched to the ACF Secretariat for verification against category criteria.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#f4f8f5] border border-[#dbe6de] text-left text-xs text-[#2d3f33] space-y-2">
              <div className="font-bold text-[#1e7e48]">Next Steps:</div>
              <ul className="list-disc pl-5 space-y-1 text-[#526658]">
                <li>The Secretariat reviews documentation and PACRA/registration credentials.</li>
                <li>You will receive an official confirmation via email ({formData.email}).</li>
                <li>Approved members receive orientation to stakeholder dialogue caucuses and the policy calendar.</li>
              </ul>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/membership"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1e7e48] hover:bg-[#166538] text-white text-xs font-bold transition-colors"
              >
                Return to Membership Overview
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#dbe6de] hover:bg-[#f4f8f5] text-[#122419] text-xs font-bold transition-colors"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-[#dbe6de] p-6 sm:p-10 shadow-xs space-y-8"
          >
            {status === 'error' && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Applicant Type Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#122419]">
                Applicant Classification *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, applicant_type: 'organisation' })}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                    formData.applicant_type === 'organisation'
                      ? 'border-[#1e7e48] bg-[#eef6f1] text-[#1e7e48]'
                      : 'border-[#dbe6de] text-[#526658] hover:bg-gray-50'
                  }`}
                >
                  <Building size={18} />
                  <span className="text-xs font-bold">Organisation / Business / Cooperative</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, applicant_type: 'individual' })}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                    formData.applicant_type === 'individual'
                      ? 'border-[#1e7e48] bg-[#eef6f1] text-[#1e7e48]'
                      : 'border-[#dbe6de] text-[#526658] hover:bg-gray-50'
                  }`}
                >
                  <User size={18} />
                  <span className="text-xs font-bold">Individual Expert / Researcher</span>
                </button>
              </div>
            </div>

            {/* Membership Category Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#122419]">
                Select Membership Category / Caucus *
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#dbe6de] text-xs focus:ring-2 focus:ring-[#1e7e48] focus:outline-none bg-white font-medium text-[#122419]"
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option value="">No categories available</option>
                )}
              </select>
              <p className="text-[11px] text-[#526658]">
                Select the stakeholder category that best represents your institution or area of activity.
              </p>
            </div>

            {/* Contact Information Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {formData.applicant_type === 'organisation' && (
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-[#122419]">
                    Organisation / Company / Association Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.org_name}
                    onChange={(e) => setFormData({ ...formData, org_name: e.target.value })}
                    placeholder="e.g. Lusaka Grain Growers Cooperative"
                    className="w-full px-4 py-3 rounded-xl border border-[#dbe6de] text-xs focus:ring-2 focus:ring-[#1e7e48] focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#122419]">
                  Contact Person Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  placeholder="e.g. Mwamba Banda"
                  className="w-full px-4 py-3 rounded-xl border border-[#dbe6de] text-xs focus:ring-2 focus:ring-[#1e7e48] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#122419]">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@organization.org.zm"
                  className="w-full px-4 py-3 rounded-xl border border-[#dbe6de] text-xs focus:ring-2 focus:ring-[#1e7e48] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#122419]">
                  Phone Number (Zambia or International) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+260 97 0000000"
                  className="w-full px-4 py-3 rounded-xl border border-[#dbe6de] text-xs focus:ring-2 focus:ring-[#1e7e48] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#122419]">
                  Primary Location / Province *
                </label>
                <select
                  value={formData.location_province}
                  onChange={(e) => setFormData({ ...formData, location_province: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#dbe6de] text-xs focus:ring-2 focus:ring-[#1e7e48] focus:outline-none bg-white"
                >
                  {provinces.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-[#122419]">
                  Primary Area of Agricultural Focus *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sector_interest}
                  onChange={(e) => setFormData({ ...formData, sector_interest: e.target.value })}
                  placeholder="e.g. Maize and soya value chains, irrigation policy, seed systems"
                  className="w-full px-4 py-3 rounded-xl border border-[#dbe6de] text-xs focus:ring-2 focus:ring-[#1e7e48] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-[#122419]">
                  Brief Statement / Expected Engagement (Optional)
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share a brief overview of your organization and why you are seeking to join ACF..."
                  className="w-full px-4 py-3 rounded-xl border border-[#dbe6de] text-xs focus:ring-2 focus:ring-[#1e7e48] focus:outline-none"
                />
              </div>
            </div>

            <TurnstileBox onToken={setTurnstileToken} />

            {/* Consent Checkbox complying with Data Protection Act 2021 */}
            <div className="p-4 rounded-xl bg-[#f4f8f5] border border-[#dbe6de] flex items-start gap-3">
              <input
                type="checkbox"
                id="apply-consent"
                checked={formData.consent_given}
                onChange={(e) => setFormData({ ...formData, consent_given: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-[#dbe6de] text-[#1e7e48] focus:ring-[#1e7e48]"
              />
              <label htmlFor="apply-consent" className="text-xs text-[#2d3f33] leading-relaxed">
                I hereby declare that the information provided is accurate and consent to the Agricultural Consultative Forum processing these details for membership evaluation in compliance with Zambia&apos;s{' '}
                <Link href="/privacy-policy" className="underline font-bold text-[#1e7e48]">
                  Data Protection Act, 2021
                </Link>
                .
              </label>
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-4 bg-[#1e7e48] hover:bg-[#166538] text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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

