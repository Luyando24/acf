'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Layers,
  Trash2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import { MembershipApplicationItem } from '@/components/admin/MembershipManager'
import { formatDate } from '@/lib/utils/formatters'
import RichTextEditor from '@/components/admin/RichTextEditor'

interface MembershipDetailReviewProps {
  application: MembershipApplicationItem
}

export default function MembershipDetailReview({ application }: MembershipDetailReviewProps) {
  const router = useRouter()
  const [status, setStatus] = useState(application.status)
  const [notes, setNotes] = useState(application.notes || '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (status === 'declined' && (!notes.trim() || notes.trim().length < 10)) {
      errs.notes = 'When declining an application, committee assessment notes must include the specific rationale.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      setNotification({
        type: 'error',
        message: 'Please resolve the highlighted validation errors before saving.',
      })
      return
    }

    setIsSaving(true)
    setNotification(null)

    try {
      const res = await fetch('/api/admin/crud/membership', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: application.id,
          status,
          notes: notes.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save application review.')
      }

      setNotification({
        type: 'success',
        message: 'Application review status and notes saved successfully.',
      })
      setTimeout(() => {
        router.push('/admin/membership')
        router.refresh()
      }, 800)
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error updating application review.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this membership submission?')) return

    try {
      await fetch(`/api/admin/crud/membership?id=${application.id}`, { method: 'DELETE' })
      router.push('/admin/membership')
      router.refresh()
    } catch {
      router.push('/admin/membership')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/membership"
            className="p-2 text-[#5c6f62] hover:text-[#0f1d14] hover:bg-[#f6f9f6] rounded-md transition-colors"
            title="Back to Applications"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#5c6f62]">
              <Link href="/admin/membership" className="hover:underline">
                Membership Inquiries
              </Link>
              <span>/</span>
              <span className="text-[#175432]">Application Review</span>
            </div>
            <h1 className="text-xl font-black text-[#0f1d14] mt-0.5">
              {application.org_name || application.contact_name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/membership"
            className="px-4 py-2 border border-[#e2ebe4] text-sm font-bold text-[#5c6f62] hover:bg-[#f6f9f6] rounded-md transition-colors"
          >
            Back to List
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-[#175432] hover:bg-[#114227] text-white text-sm font-bold rounded-md shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save size={15} />
            <span>{isSaving ? 'Saving...' : 'Save Assessment'}</span>
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2.5 text-sm font-semibold shadow-md transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-[#175432] border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Detailed Applicant Profile & Assessment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Profile Card */}
          <div className="bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#e2ebe4] pb-4">
              <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider flex items-center gap-2">
                <Building2 size={16} className="text-[#175432]" />
                Applicant Entity Profile
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : status === 'in_review'
                    ? 'bg-blue-100 text-blue-800'
                    : status === 'declined'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {status.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <div className="p-3.5 bg-[#f6f9f6] rounded-lg border border-[#e2ebe4] space-y-1">
                <span className="text-[#5c6f62] font-semibold block">Organization / Entity Name:</span>
                <span className="text-sm font-bold text-[#0f1d14]">
                  {application.org_name || 'Individual Applicant'}
                </span>
              </div>

              <div className="p-3.5 bg-[#f6f9f6] rounded-lg border border-[#e2ebe4] space-y-1">
                <span className="text-[#5c6f62] font-semibold block">Primary Representative:</span>
                <span className="text-sm font-bold text-[#0f1d14] flex items-center gap-1.5">
                  <User size={14} className="text-[#175432]" />
                  {application.contact_name}
                </span>
              </div>

              <div className="p-3.5 bg-[#f6f9f6] rounded-lg border border-[#e2ebe4] space-y-1">
                <span className="text-[#5c6f62] font-semibold block">Target Category Caucus:</span>
                <span className="text-sm font-bold text-[#175432]">
                  {application.membership_categories?.name || 'Producer Association'}
                </span>
              </div>

              <div className="p-3.5 bg-[#f6f9f6] rounded-lg border border-[#e2ebe4] space-y-1">
                <span className="text-[#5c6f62] font-semibold block">Applicant Classification:</span>
                <span className="text-sm font-bold text-[#0f1d14] capitalize">
                  {application.applicant_type} Member
                </span>
              </div>

              <div className="p-3.5 bg-[#f6f9f6] rounded-lg border border-[#e2ebe4] space-y-1">
                <span className="text-[#5c6f62] font-semibold block">Email Address:</span>
                <a
                  href={`mailto:${application.email}`}
                  className="text-sm font-bold text-[#175432] hover:underline flex items-center gap-1.5"
                >
                  <Mail size={14} />
                  <span>{application.email}</span>
                </a>
              </div>

              <div className="p-3.5 bg-[#f6f9f6] rounded-lg border border-[#e2ebe4] space-y-1">
                <span className="text-[#5c6f62] font-semibold block">Telephone / WhatsApp:</span>
                <a
                  href={`tel:${application.phone}`}
                  className="text-sm font-bold text-[#0f1d14] hover:text-[#175432] flex items-center gap-1.5"
                >
                  <Phone size={14} />
                  <span>{application.phone}</span>
                </a>
              </div>

              <div className="p-3.5 bg-[#f6f9f6] rounded-lg border border-[#e2ebe4] space-y-1">
                <span className="text-[#5c6f62] font-semibold block">Geographic Location / Province:</span>
                <span className="text-sm font-bold text-[#0f1d14] flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#175432]" />
                  <span>{application.location_province || 'Not specified'}</span>
                </span>
              </div>

              <div className="p-3.5 bg-[#f6f9f6] rounded-lg border border-[#e2ebe4] space-y-1">
                <span className="text-[#5c6f62] font-semibold block">Commodity & Value Chain Interest:</span>
                <span className="text-sm font-bold text-[#0f1d14]">
                  {application.sector_interest || 'General Agriculture'}
                </span>
              </div>
            </div>

            {application.details && Object.keys(application.details).length > 0 && (
              <div className="pt-4 border-t border-[#e2ebe4] space-y-2">
                <span className="text-sm font-bold text-[#0f1d14] block">Additional Submission Metadata</span>
                <pre className="p-4 bg-gray-50 rounded-md text-xs font-mono text-[#5c6f62] overflow-x-auto border border-[#e2ebe4]">
                  {JSON.stringify(application.details, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Assessment Form with Rich Text Editor */}
          <form onSubmit={handleSave} className="bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs space-y-5">
            <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#175432]" />
              Secretariat Assessment & Internal Notes
            </h2>

            <div className="space-y-1.5">
              <RichTextEditor
                label="Secretariat Internal Assessment Notes"
                value={notes}
                onChange={(val) => {
                  setNotes(val)
                  if (errors.notes) setErrors((prev) => ({ ...prev, notes: '' }))
                }}
                placeholder="Record committee evaluation notes, PACRA verification, caucus liaison approval, or reasons for rejection..."
                rows={6}
                error={errors.notes}
                description="Internal notes are only visible to authorized ACF secretariat staff."
              />
            </div>

            <div className="pt-4 border-t border-[#e2ebe4] flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#175432] hover:bg-[#114227] text-white text-sm font-bold rounded-md shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Save size={15} />
                <span>{isSaving ? 'Saving...' : 'Save Assessment Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (1 col): Status Control & Quick Communication */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs space-y-5">
            <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider">Review Decision</h2>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14]">Application Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as any)
                  if (errors.notes) setErrors((prev) => ({ ...prev, notes: '' }))
                }}
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm font-bold focus:ring-2 focus:ring-[#175432] focus:outline-none bg-white"
              >
                <option value="new">Pending Review (New)</option>
                <option value="in_review">Under Committee Verification</option>
                <option value="approved">Approved Member</option>
                <option value="declined">Declined Application</option>
              </select>
            </div>

            <div className="p-3 bg-[#f6f9f6] rounded-md border border-[#e2ebe4] text-xs text-[#5c6f62] space-y-1">
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-[#175432]" />
                <span>Submitted: {formatDate(application.created_at)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers size={13} className="text-[#175432]" />
                <span>ID: #{application.id.slice(0, 8)}</span>
              </div>
            </div>
          </div>

          {/* Quick Communication Box */}
          <div className="bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs space-y-4">
            <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider">Direct Contact</h2>

            <div className="space-y-2">
              <a
                href={`mailto:${application.email}?subject=ACF Membership Application Review - ${encodeURIComponent(application.org_name || application.contact_name)}`}
                className="w-full px-4 py-2.5 bg-[#f6f9f6] hover:bg-[#eaf4ec] text-[#175432] text-sm font-bold rounded-md border border-[#e2ebe4] transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Mail size={15} />
                  <span>Send Formal Email</span>
                </span>
                <ExternalLink size={12} />
              </a>

              <a
                href={`tel:${application.phone}`}
                className="w-full px-4 py-2.5 bg-[#f6f9f6] hover:bg-[#eaf4ec] text-[#0f1d14] text-sm font-bold rounded-md border border-[#e2ebe4] transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Phone size={15} />
                  <span>Call Primary Contact</span>
                </span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white p-6 rounded-lg border border-rose-200 shadow-xs space-y-3">
            <h2 className="text-sm font-black text-rose-700 uppercase tracking-wider">Danger Zone</h2>
            <p className="text-xs text-[#5c6f62]">
              Permanently remove this submission from the system.
            </p>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-bold rounded-md border border-rose-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Delete Submission</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
