'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Mail,
  UserCheck,
  Globe,
  Tag,
  ShieldCheck,
} from 'lucide-react'

export default function NewsletterSubscriberForm() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    status: 'subscribed' as 'subscribed' | 'pending' | 'unsubscribed',
    source: 'admin_portal',
    notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address (e.g. name@organisation.org).'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      setNotification({
        type: 'error',
        message: 'Please provide a valid stakeholder email address.',
      })
      return
    }

    setIsSaving(true)
    setNotification(null)

    const payload = {
      id: crypto.randomUUID(),
      email: formData.email.trim().toLowerCase(),
      status: formData.status,
      source: formData.source,
      consent_at: new Date().toISOString(),
      confirmed_at: formData.status === 'subscribed' ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
    }

    try {
      const res = await fetch('/api/admin/crud/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to enrol subscriber.')
      }

      setNotification({
        type: 'success',
        message: 'Subscriber enrolled and verified successfully.',
      })
      setTimeout(() => {
        router.push('/admin/newsletter')
        router.refresh()
      }, 800)
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error enrolling subscriber.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/newsletter"
            className="p-2 text-[#5c6f62] hover:text-[#0f1d14] hover:bg-[#f6f9f6] rounded-xl transition-colors"
            title="Back to Newsletter"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5c6f62]">
              <Link href="/admin/newsletter" className="hover:underline">
                Newsletter Subscribers
              </Link>
              <span>/</span>
              <span className="text-[#175432]">New Subscriber</span>
            </div>
            <h1 className="text-xl font-black text-[#0f1d14] mt-0.5">
              Enrol Newsletter Subscriber
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/newsletter"
            className="px-4 py-2 border border-[#e2ebe4] text-xs font-bold text-[#5c6f62] hover:bg-[#f6f9f6] rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2 bg-[#175432] hover:bg-[#114227] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save size={15} />
            <span>{isSaving ? 'Enrolling...' : 'Enrol Subscriber'}</span>
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs font-semibold shadow-md transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-[#175432] border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Form Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-5">
            <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider flex items-center gap-2">
              <Mail size={16} className="text-[#175432]" />
              Subscriber Identity & Channel
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f1d14]">
                Stakeholder Email Address *
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-3 text-[#5c6f62]" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
                  }}
                  placeholder="e.g. policy.specialist@cooperative.org.zm"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                    errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">Acquisition Channel</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none bg-white font-medium"
                >
                  <option value="admin_portal">Admin Manual Enrollment</option>
                  <option value="website_footer">Public Website Footer</option>
                  <option value="event_registration">Policy Symposium Attendance</option>
                  <option value="partner_referral">Ministry / Partner Referral</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">Initial Subscription Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none bg-white font-bold"
                >
                  <option value="subscribed">Active (Subscribed)</option>
                  <option value="pending">Pending Double Opt-in</option>
                  <option value="unsubscribed">Unsubscribed (Suppressed)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f1d14]">Internal Notes (Optional)</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Institutional affiliation, stakeholder group, or reason for manual enrollment..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Preview & GDPR Notice */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#f6f9f6] to-[#edf4ee] p-6 rounded-3xl border border-[#d6e5d8] space-y-4">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#175432] uppercase tracking-wider">
              <span>Record Summary</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                formData.status === 'subscribed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : formData.status === 'pending'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {formData.status}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#e2ebe4] shadow-xs space-y-2.5">
              <div className="text-xs font-bold text-[#0f1d14] break-all">
                {formData.email || 'recipient@domain.com'}
              </div>
              <div className="text-[11px] text-[#5c6f62]">
                Source: <span className="font-semibold capitalize text-[#175432]">{formData.source.replace(/_/g, ' ')}</span>
              </div>
              <div className="pt-2 border-t border-[#e2ebe4] flex items-center gap-1.5 text-[10px] text-[#5c6f62]">
                <ShieldCheck size={12} className="text-[#175432]" />
                <span>Explicit consent recorded</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2ebe4] shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-[#0f1d14] flex items-center gap-1.5">
              <UserCheck size={14} className="text-[#175432]" />
              ACF Policy Dispatch
            </h3>
            <p className="text-[11px] text-[#5c6f62] leading-relaxed">
              Subscribers receive quarterly agricultural outlooks, immediate policy briefs, and invitations to National Agricultural Policy Roundtables.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
