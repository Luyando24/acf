'use client'

import React, { useState, useRef } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  Send,
  MessageSquarePlus,
  FileText,
  UploadCloud,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react'

interface DialogueProposalFormProps {
  onClose?: () => void
}

const TOPIC_AREAS = [
  'Policy Advocacy & Reform',
  'Research & Evidence',
  'Climate Resilience & Adaptation',
  'Input Markets & FISP Reform',
  'Livestock & Export Competitiveness',
  'Agricultural Finance & Investment (NAIP)',
  'Customary Land Tenure & Governance',
  'Other Multi-Stakeholder Topic',
]

const DIALOGUE_FORMATS = [
  'Hybrid National Policy Dialogue',
  'In-Person Stakeholder Roundtable',
  'Virtual Technical Working Group',
  'Provincial Consultative Forum',
]

export default function DialogueProposalForm({ onClose }: DialogueProposalFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: '',
    topic_area: TOPIC_AREAS[0],
    proposer_name: '',
    organization: '',
    email: '',
    phone: '',
    proposed_format: DIALOGUE_FORMATS[0],
    preferred_timeframe: '',
    description: '',
    document_url: '',
    document_name: '',
    consent_given: true,
    honeypot: '',
  })

  const [isUploadingPdf, setIsUploadingPdf] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  const handlePdfUpload = async (file: File) => {
    setUploadError(null)
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Please select a valid PDF document (.pdf).')
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('PDF file exceeds the 15MB size limit.')
      return
    }

    setIsUploadingPdf(true)
    const body = new FormData()
    body.append('file', file)

    try {
      const res = await fetch('/api/dialogues/upload-pdf', {
        method: 'POST',
        body,
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not upload PDF file.')
      }
      setFormData((prev) => ({
        ...prev,
        document_url: data.url,
        document_name: data.fileName || file.name,
      }))
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading PDF concept note.')
    } finally {
      setIsUploadingPdf(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/dialogues/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit dialogue proposal.')
      }
      setSubmittedId(data.proposalId || 'ACF-PROP')
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to submit your proposal. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submittedId) {
    return (
      <div className="bg-[#f0f9f3] rounded-3xl border border-[#bbf7d0] p-6 sm:p-10 text-center space-y-4 shadow-xs">
        <div className="w-14 h-14 rounded-full bg-[#1e7e48] text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 size={30} />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dcfce7] text-[#166534] text-[11px] font-bold uppercase tracking-wider">
          <Sparkles size={13} />
          <span>Proposal Submitted for Secretariat Review</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-[#122419]">
          Policy Dialogue Proposal Received!
        </h3>
        <p className="text-xs sm:text-sm text-[#2d3f33] max-w-lg mx-auto leading-relaxed">
          Thank you, <strong className="font-bold">{formData.proposer_name}</strong> ({formData.organization}). Your proposed dialogue{' '}
          <strong className="font-bold">&ldquo;{formData.title}&rdquo;</strong> has been submitted to the ACF Secretariat for evaluation and scheduling.
        </p>
        <div className="p-3.5 rounded-2xl bg-white border border-[#d1e7dd] text-xs text-[#1e7e48] max-w-md mx-auto space-y-1">
          <p className="font-bold">
            Proposal Reference: ACF-PROP-{submittedId.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-[#526658]">
            Once approved by the Secretariat, your dialogue will be published to the Active Dialogues tab.
          </p>
        </div>
        <div className="pt-2 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              setSubmittedId(null)
              setFormData({
                title: '',
                topic_area: TOPIC_AREAS[0],
                proposer_name: '',
                organization: '',
                email: '',
                phone: '',
                proposed_format: DIALOGUE_FORMATS[0],
                preferred_timeframe: '',
                description: '',
                document_url: '',
                document_name: '',
                consent_given: true,
                honeypot: '',
              })
            }}
            className="text-xs font-bold text-[#1e7e48] hover:underline cursor-pointer"
          >
            Submit another proposal
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1e7e48] text-white text-xs font-bold hover:bg-[#166538] transition-colors cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      id="propose-dialogue"
      className="bg-white rounded-3xl border border-[#dbe6de] p-6 sm:p-10 shadow-xs space-y-6"
    >
      <div className="border-b border-[#dbe6de] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e8f5ee] text-[#1e7e48] text-[11px] font-bold uppercase tracking-wider mb-2">
          <MessageSquarePlus size={13} />
          <span>Public & Stakeholder Submissions</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-[#122419]">
          Propose a New Policy Dialogue
        </h3>
        <p className="text-xs text-[#526658] mt-1 leading-relaxed">
          Farmer organizations, agribusinesses, research institutions, cooperating partners, and members of the public can propose a policy dialogue topic for convening by the Agricultural Consultative Forum (ACF). You may also attach a PDF concept note or background paper.
        </p>
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
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
              Proposed Policy Dialogue Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. National Roundtable on Smallholder Irrigation Financing & Water Harvesting"
              className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs focus:outline-hidden focus:border-[#1e7e48] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
              Thematic Pillar / Topic Area <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.topic_area}
              onChange={(e) => setFormData({ ...formData, topic_area: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs font-semibold text-[#122419] focus:outline-hidden focus:border-[#1e7e48] focus:bg-white"
            >
              {TOPIC_AREAS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
              Proposed Format <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.proposed_format}
              onChange={(e) => setFormData({ ...formData, proposed_format: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs font-semibold text-[#122419] focus:outline-hidden focus:border-[#1e7e48] focus:bg-white"
            >
              {DIALOGUE_FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
              Your Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.proposer_name}
              onChange={(e) => setFormData({ ...formData, proposer_name: e.target.value })}
              placeholder="e.g. Mrs. Bwalya Mulenga"
              className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs focus:outline-hidden focus:border-[#1e7e48] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
              Organization / Constituency <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder="e.g. Cotton Association of Zambia / IAPRI"
              className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs focus:outline-hidden focus:border-[#1e7e48] focus:bg-white"
            />
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
              placeholder="e.g. bmulenga@example.org"
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
              placeholder="e.g. +260 97 7654321"
              className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs focus:outline-hidden focus:border-[#1e7e48] focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
              Target Timeframe / Preferred Month (Optional)
            </label>
            <input
              type="text"
              value={formData.preferred_timeframe}
              onChange={(e) => setFormData({ ...formData, preferred_timeframe: e.target.value })}
              placeholder="e.g. Q1 2027 or Ahead of the 2026/2027 National Budget Consultations"
              className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs focus:outline-hidden focus:border-[#1e7e48] focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2d3f33] mb-1.5">
            Concept Note Summary, Policy Problem & Key Questions <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the agricultural policy issue, target stakeholders (e.g. Ministry of Agriculture, smallholder unions, private off-takers), and expected policy outcomes..."
            className="w-full px-4 py-2.5 rounded-xl border border-[#dbe6de] bg-[#fcfdfc] text-xs focus:outline-hidden focus:border-[#1e7e48] focus:bg-white resize-y"
          />
        </div>

        {/* Optional PDF Document Attachment */}
        <div className="p-4 rounded-2xl bg-[#f6f9f6] border border-[#dbe6de] space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#122419] flex items-center gap-1.5">
              <FileText size={14} className="text-[#1e7e48]" />
              <span>Attach Concept Note or Background Document (PDF, Optional)</span>
            </label>
            <span className="text-[11px] text-[#526658]">PDF up to 15MB</span>
          </div>

          {formData.document_url ? (
            <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#bbf7d0]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center shrink-0 border border-red-200">
                  <FileText size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#122419] truncate">
                    {formData.document_name || 'Attached Concept Note.pdf'}
                  </div>
                  <div className="text-[11px] text-[#1e7e48] truncate font-mono">
                    {formData.document_url}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, document_url: '', document_name: '' }))
                }
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Remove PDF"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <button
                type="button"
                disabled={isUploadingPdf}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#1e7e48] bg-white hover:bg-[#f0f9f3] text-xs font-bold text-[#1e7e48] transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUploadingPdf ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Uploading PDF...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={15} />
                    <span>Upload PDF from Device</span>
                  </>
                )}
              </button>
              <span className="text-[11px] text-[#526658] text-center">or</span>
              <input
                type="text"
                value={formData.document_url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    document_url: e.target.value,
                    document_name: e.target.value.split('/').pop() || 'Concept-Note.pdf',
                  }))
                }
                placeholder="Paste direct link to a PDF document (https://...)"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#dbe6de] bg-white text-xs focus:outline-hidden focus:border-[#1e7e48]"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handlePdfUpload(e.target.files[0])
                }}
              />
            </div>
          )}

          {uploadError && (
            <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
              <AlertCircle size={12} />
              <span>{uploadError}</span>
            </p>
          )}
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
            I consent to the ACF Secretariat processing this proposal and contacting our organization regarding policy dialogue planning.
          </span>
        </label>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#dbe6de] text-xs font-bold text-[#526658] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || isUploadingPdf}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#1e7e48] hover:bg-[#166538] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send size={14} />
            <span>{isSubmitting ? 'Submitting Proposal...' : 'Submit Proposed Policy Dialogue'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

