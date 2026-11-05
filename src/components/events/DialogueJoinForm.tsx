'use client'

import React, { useState } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  Send,
  Users,
  ShieldCheck,
  Building2,
  UserCheck,
} from 'lucide-react'

interface DialogueJoinFormProps {
  eventId: string
  eventSlug: string
  eventTitle: string
  compact?: boolean
  onClose?: () => void
}

export default function DialogueJoinForm({
  eventId,
  eventSlug,
  eventTitle,
  compact = false,
  onClose,
}: DialogueJoinFormProps) {
  const [formData, setFormData] = useState({
    participant_name: '',
    organization: '',
    role_title: '',
    email: '',
    phone: '',
    attendance_mode: 'In-Person' as 'In-Person' | 'Virtual / Online' | 'Either',
    contribution_note: '',
    consent_given: true,
    honeypot: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [submittedRef, setSubmittedRef] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/dialogues/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          event_slug: eventSlug,
          event_title: eventTitle,
          ...formData,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Unable to submit your request to join this dialogue.')
      }

      setSubmittedRef(data.registrationId || 'ACF-DLG')
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit registration request.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submittedRef) {
    return (
      <div className="bg-[#f0f9f3] rounded-3xl border border-[#bbf7d0] p-6 sm:p-10 text-center space-y-4 shadow-xs">
        <div className="w-14 h-14 rounded-full bg-[#1e7e48] text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 size={30} />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold uppercase tracking-wider">
          <ShieldCheck size={13} />
          <span>Pending Secretariat Approval</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-[#122419]">
          Request to Join Dialogue Received!
        </h3>
        <p className="text-xs sm:text-sm text-[#2d3f33] max-w-lg mx-auto leading-relaxed">
          Thank you, <strong className="font-bold">{formData.participant_name}</strong>. Your request to join{' '}
          <strong className="font-bold">&ldquo;{eventTitle}&rdquo;</strong> ({formData.attendance_mode}) has been submitted to the ACF Secretariat for administrator review and approval.
        </p>
        <div className="p-3.5 rounded-2xl bg-white border border-[#d1e7dd] text-xs text-[#1e7e48] max-w-md mx-auto space-y-1">
          <p className="font-bold">
            Reference: ACF-JOIN-{submittedRef.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-[#526658]">
            You will receive confirmation at <strong>{formData.email}</strong> once your participation is approved.
          </p>
        </div>
        <div className="pt-2 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              setSubmittedRef(null)
              setFormData({
                participant_name: '',
                organization: '',
                role_title: '',
                email: '',
                phone: '',
                attendance_mode: 'In-Person',
                contribution_note: '',
                consent_given: true,
                honeypot: '',
              })
            }}
            className="text-xs font-bold text-[#1e7e48] hover:underline cursor-pointer"
          >
            Register another participant
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1e7e48] text-white text-xs font-bold hover:bg-[#166538] transition-colors cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      id="join-dialogue"
      className={`bg-white rounded-3xl border border-[#dbe6de] ${
        compact ? 'p-5 sm:p-7' : 'p-6 sm:p-10'
      } shadow-xs space-y-6`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#dbe6de] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e8f5ee] text-[#1e7e48] text-[11px] font-bold uppercase tracking-wider mb-2">
            <UserCheck size={13} />
            <span>Admin Approval Required</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-[#122419]">
            Request to Join This Policy Dialogue
          </h3>
          <p className="text-xs text-[#526658] mt-1">
            Register your interest to participate in <strong className="text-[#122419]">&ldquo;{eventTitle}&rdquo;</strong>. The ACF Secretariat reviews and approves participant requests to ensure balanced multi-stakeholder representation.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.participant_name}
              onChange={(e) => setFormData({ ...formData, participant_name: e.target.value })}
              placeholder="e.g. Dr. Mutale Chanda"
              className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs focus:outline-hidden focus:border-[#1e7e48] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
              Organization / Constituency <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#526658]"
              />
              <input
                type="text"
                required
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. ZNFU / Ministry of Agriculture / Agribusiness"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs focus:outline-hidden focus:border-[#1e7e48] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. mchanda@example.org"
              className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs focus:outline-hidden focus:border-[#1e7e48] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
              Phone / Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. +260 97 1234567"
              className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs focus:outline-hidden focus:border-[#1e7e48] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
              Role / Designation (Optional)
            </label>
            <input
              type="text"
              value={formData.role_title}
              onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
              placeholder="e.g. Policy Analyst / Smallholder Representative"
              className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs focus:outline-hidden focus:border-[#1e7e48] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
              Preferred Attendance Mode <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.attendance_mode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  attendance_mode: e.target.value as 'In-Person' | 'Virtual / Online' | 'Either',
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs font-semibold text-[#122419] focus:outline-hidden focus:border-[#1e7e48] focus:bg-white"
            >
              <option value="In-Person">In-Person Attendance</option>
              <option value="Virtual / Online">Virtual / Online Stream</option>
              <option value="Either">Either (In-Person or Virtual)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
            Expected Contribution / Thematic Interest (Optional)
          </label>
          <textarea
            rows={3}
            value={formData.contribution_note}
            onChange={(e) => setFormData({ ...formData, contribution_note: e.target.value })}
            placeholder="Briefly share your organization's interest or any technical perspective you wish to contribute to this dialogue..."
            className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs focus:outline-hidden focus:border-[#1e7e48] focus:bg-white resize-y"
          />
        </div>

        <label className="flex items-start gap-2.5 text-xs text-[#526658] cursor-pointer">
          <input
            type="checkbox"
            required
            checked={formData.consent_given}
            onChange={(e) => setFormData({ ...formData, consent_given: e.target.checked })}
            className="mt-0.5 rounded border-[#dbe6de] text-[#1e7e48] focus:ring-[#1e7e48]"
          />
          <span>
            I consent to the ACF Secretariat storing my registration details for participant review, approval, and dialogue coordination under the Data Protection Act.
          </span>
        </label>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-[#526658]">
            <Users size={14} className="text-[#1e7e48]" />
            <span>Status after submission: Pending Admin Approval</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 rounded-xl border border-[#dbe6de] text-xs font-bold text-[#526658] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial px-7 py-3 bg-[#1e7e48] hover:bg-[#166538] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send size={14} />
              <span>
                {isSubmitting ? 'Submitting Request...' : 'Submit Request to Join Dialogue'}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

