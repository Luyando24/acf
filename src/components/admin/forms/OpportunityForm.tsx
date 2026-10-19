'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  FileCheck,
  PlusCircle,
  X,
  Globe,
  Clock,
  FileText,
  Mail,
} from 'lucide-react'
import { OpportunityItem } from '@/components/admin/OpportunityManager'
import FileUpload from '@/components/admin/FileUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'

const COMMON_DOCUMENTS = [
  'Curriculum Vitae (CV)',
  'Cover Letter',
  'Academic & Professional Qualifications',
  'National Registration Card (NRC) / ID',
  'Technical Proposal',
  'Financial Bid / Cost Quotation',
  'Company Registration & ZRA Tax Clearance',
  'Professional References (3 Letters)',
]

interface OpportunityFormProps {
  initialData?: OpportunityItem | null
}

export default function OpportunityForm({ initialData }: OpportunityFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initialData)

  const [formData, setFormData] = useState<Partial<OpportunityItem>>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    type: initialData?.type || 'Job',
    opens_on: initialData?.opens_on || new Date().toISOString().split('T')[0],
    closes_on: initialData?.closes_on || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    description: initialData?.description || '',
    application_instructions: initialData?.application_instructions || 'Please submit all required documents listed above through the portal before the closing deadline.',
    apply_url: initialData?.apply_url || '',
    contact_info: initialData?.contact_info || 'opportunities@acfzambia.org',
    attachment_url: initialData?.attachment_url || '',
    status: initialData?.status || 'published',
    accepted_documents: initialData?.accepted_documents || [
      'Curriculum Vitae (CV)',
      'Cover Letter',
      'Academic & Professional Qualifications',
    ],
  })

  const [customDocInput, setCustomDocInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === '' || prev.slug === prev.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : prev.slug,
    }))
    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }))
  }

  const toggleDocument = (doc: string) => {
    const current = formData.accepted_documents || []
    if (current.includes(doc)) {
      setFormData({
        ...formData,
        accepted_documents: current.filter((d) => d !== doc),
      })
    } else {
      setFormData({
        ...formData,
        accepted_documents: [...current, doc],
      })
    }
    if (errors.accepted_documents) setErrors((prev) => ({ ...prev, accepted_documents: '' }))
  }

  const handleAddCustomDoc = () => {
    const trimmed = customDocInput.trim()
    if (!trimmed) return
    const current = formData.accepted_documents || []
    if (!current.includes(trimmed)) {
      setFormData({
        ...formData,
        accepted_documents: [...current, trimmed],
      })
      setCustomDocInput('')
      if (errors.accepted_documents) setErrors((prev) => ({ ...prev, accepted_documents: '' }))
    }
  }

  const removeDoc = (doc: string) => {
    setFormData({
      ...formData,
      accepted_documents: (formData.accepted_documents || []).filter((d) => d !== doc),
    })
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.title?.trim() || formData.title.trim().length < 5) {
      errs.title = 'Title is required and must be at least 5 characters.'
    }
    if (!formData.slug?.trim() || !/^[a-z0-9-]+$/.test(formData.slug.trim())) {
      errs.slug = 'URL slug is required and may only contain lowercase letters, numbers, and hyphens.'
    }
    if (!formData.closes_on) {
      errs.closes_on = 'Submission deadline date is required.'
    } else if (formData.opens_on && new Date(formData.closes_on) < new Date(formData.opens_on)) {
      errs.closes_on = 'Closing deadline cannot precede opening date.'
    }
    if (!formData.description?.trim() || formData.description.trim().length < 20) {
      errs.description = 'Opportunity description and scope is required (minimum 20 characters).'
    }
    if (!formData.contact_info?.trim()) {
      errs.contact_info = 'Contact email or phone is required.'
    }
    if (formData.apply_url?.trim() && !/^https?:\/\//i.test(formData.apply_url.trim())) {
      errs.apply_url = 'Application link must begin with http:// or https://'
    }
    if (!formData.accepted_documents || formData.accepted_documents.length === 0) {
      errs.accepted_documents = 'Please select or add at least one mandatory application document.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
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

    const slug = formData.slug?.trim() || formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'opportunity'

    const payload = {
      id: initialData?.id || crypto.randomUUID(),
      title: formData.title?.trim(),
      slug,
      type: formData.type || 'Job',
      opens_on: formData.opens_on || new Date().toISOString().split('T')[0],
      closes_on: formData.closes_on,
      description: formData.description?.trim(),
      application_instructions: formData.application_instructions?.trim() || null,
      apply_url: formData.apply_url?.trim() || null,
      contact_info: formData.contact_info?.trim() || null,
      attachment_url: formData.attachment_url?.trim() || null,
      status: formData.status || 'published',
      accepted_documents: formData.accepted_documents || [],
    }

    try {
      const res = await fetch('/api/admin/crud/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save opportunity.')
      }

      setNotification({
        type: 'success',
        message: isEdit ? 'Opportunity updated successfully.' : 'New opportunity published.',
      })
      setTimeout(() => {
        router.push('/admin/opportunities')
        router.refresh()
      }, 800)
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error saving opportunity.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/opportunities"
            className="p-2 text-[#5c6f62] hover:text-[#0f1d14] hover:bg-[#f6f9f6] rounded-xl transition-colors"
            title="Back to Opportunities"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5c6f62]">
              <Link href="/admin/opportunities" className="hover:underline">
                Opportunities & Tenders
              </Link>
              <span>/</span>
              <span className="text-[#175432]">{isEdit ? 'Edit Opportunity' : 'Create Opportunity'}</span>
            </div>
            <h1 className="text-xl font-black text-[#0f1d14] mt-0.5">
              {isEdit ? `Edit: ${initialData?.title}` : 'Post Vacancy, Tender or Grant'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/opportunities"
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
            <span>{isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Opportunity'}</span>
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

      {/* Main 2-Column Form Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-5">
            <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider flex items-center gap-2">
              <Briefcase size={16} className="text-[#175432]" />
              Opportunity Core Details
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f1d14]">Opportunity Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Senior Agricultural Policy Analyst / RFP: Climate Baseline Study"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                  errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                }`}
              />
              {errors.title && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.title}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData({ ...formData, slug: e.target.value })
                    if (errors.slug) setErrors((prev) => ({ ...prev, slug: '' }))
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono bg-[#f6f9f6] focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                    errors.slug ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                  }`}
                />
                {errors.slug && (
                  <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.slug}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">Category Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none bg-white font-semibold"
                >
                  <option value="Job">Job Opening (Secretariat Staff)</option>
                  <option value="Consultancy">Short-term Consultancy</option>
                  <option value="Tender">Procurement / Tender</option>
                  <option value="Grant">Grant / Sub-Award</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">Opening Date</label>
                <input
                  type="date"
                  value={formData.opens_on}
                  onChange={(e) => setFormData({ ...formData, opens_on: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">Submission Deadline *</label>
                <input
                  type="date"
                  required
                  value={formData.closes_on}
                  onChange={(e) => {
                    setFormData({ ...formData, closes_on: e.target.value })
                    if (errors.closes_on) setErrors((prev) => ({ ...prev, closes_on: '' }))
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                    errors.closes_on ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                  }`}
                />
                {errors.closes_on && (
                  <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.closes_on}
                  </p>
                )}
              </div>
            </div>

            {/* Rich Text Editor for Scope/Description */}
            <div className="space-y-1.5">
              <RichTextEditor
                label="Terms of Reference / Scope of Work & Description"
                value={formData.description || ''}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, description: val }))
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }))
                }}
                placeholder="Detailed objectives, duties, expected deliverables, and qualifications..."
                rows={10}
                error={errors.description}
                required
                description="Supports headings, lists of requirements, and deliverables."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">Contact Email / Inquiries *</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-3 text-[#5c6f62]" />
                  <input
                    type="text"
                    required
                    value={formData.contact_info || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, contact_info: e.target.value })
                      if (errors.contact_info) setErrors((prev) => ({ ...prev, contact_info: '' }))
                    }}
                    placeholder="opportunities@acfzambia.org"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                      errors.contact_info ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                    }`}
                  />
                </div>
                {errors.contact_info && (
                  <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.contact_info}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">External Portal Apply URL (Optional)</label>
                <div className="relative">
                  <Globe size={15} className="absolute left-3.5 top-3 text-[#5c6f62]" />
                  <input
                    type="url"
                    value={formData.apply_url || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, apply_url: e.target.value })
                      if (errors.apply_url) setErrors((prev) => ({ ...prev, apply_url: '' }))
                    }}
                    placeholder="https://..."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                      errors.apply_url ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                    }`}
                  />
                </div>
                {errors.apply_url && (
                  <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.apply_url}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Local Device Terms of Reference Document Upload */}
          <div className="bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-5">
            <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} className="text-[#175432]" />
              Terms of Reference (TOR) or Tender Specifications Document
            </h2>

            <FileUpload
              label="Downloadable Tender Package / TOR Document (PDF, Word)"
              value={formData.attachment_url || ''}
              onChange={(url) => {
                setFormData((prev) => ({ ...prev, attachment_url: url }))
              }}
              accept=".pdf,.doc,.docx"
              type="document"
              description="Upload official bidding document or terms of reference PDF for applicants."
              maxSizeMb={50}
            />
          </div>

          {/* Mandatory Submission Checklist */}
          <div className="bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-5">
            <div>
              <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider flex items-center gap-2">
                <FileCheck size={16} className="text-[#175432]" />
                Mandatory Applicant Submission Documents *
              </h2>
              <p className="text-xs text-[#5c6f62] mt-0.5">
                Applicants will be required to upload these specific files before completing their submission.
              </p>
              {errors.accepted_documents && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1.5">
                  <AlertCircle size={12} /> {errors.accepted_documents}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {COMMON_DOCUMENTS.map((doc) => {
                const isSelected = (formData.accepted_documents || []).includes(doc)
                return (
                  <button
                    key={doc}
                    type="button"
                    onClick={() => toggleDocument(doc)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#175432] bg-[#f0f6f1] text-[#175432]'
                        : 'border-[#e2ebe4] bg-white text-[#5c6f62] hover:bg-gray-50'
                    }`}
                  >
                    <span>{doc}</span>
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isSelected ? 'bg-[#175432] text-white' : 'border border-[#e2ebe4]'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Custom Document Requirement Adder */}
            <div className="pt-2 border-t border-[#e2ebe4]">
              <label className="text-xs font-bold text-[#0f1d14] block mb-1.5">
                Add Custom Document Requirement
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customDocInput}
                  onChange={(e) => setCustomDocInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddCustomDoc()
                    }
                  }}
                  placeholder="e.g. Audited Financial Statements (Last 2 Years)"
                  className="flex-1 px-4 py-2 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomDoc}
                  className="px-4 py-2 bg-[#175432] hover:bg-[#114227] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <PlusCircle size={14} />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Selected Custom Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {(formData.accepted_documents || []).map((doc) => (
                <span
                  key={doc}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-[#f0f6f1] text-[#175432] border border-[#d6e5d8]"
                >
                  <span>{doc}</span>
                  <button
                    type="button"
                    onClick={() => removeDoc(doc)}
                    className="hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Controls & Live Preview */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-5">
            <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider">Publishing Controls</h2>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f1d14]">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs font-semibold focus:ring-2 focus:ring-[#175432] focus:outline-none bg-white"
              >
                <option value="published">Published (Receiving Bids)</option>
                <option value="draft">Draft (Internal preparation)</option>
                <option value="archived">Closed / Archived</option>
              </select>
            </div>
          </div>

          {/* Live Card Preview */}
          <div className="bg-gradient-to-br from-[#f6f9f6] to-[#edf4ee] p-6 rounded-3xl border border-[#d6e5d8] space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#175432] uppercase tracking-wider">
              <span>Public Card Preview</span>
              <span className="capitalize px-2 py-0.5 bg-white rounded text-[10px] font-bold text-[#175432]">
                {formData.status}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e2ebe4] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f0f6f1] text-[#175432]">
                  {formData.type}
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock size={11} />
                  <span>Closes: {formData.closes_on}</span>
                </span>
              </div>

              <h4 className="text-xs font-bold text-[#0f1d14] line-clamp-2">
                {formData.title || 'Opportunity Title'}
              </h4>

              <div className="pt-2 border-t border-[#e2ebe4] flex items-center justify-between text-[10px] text-[#5c6f62]">
                <span>{(formData.accepted_documents || []).length} required docs</span>
                <span className="text-[#175432] font-bold">Apply Now →</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
