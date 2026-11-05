'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Calendar,
  MapPin,
  Video,
  Link2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
  Trash2,
  Clock,
} from 'lucide-react'
import { EventItem } from '@/components/admin/EventManager'
import FileUpload from '@/components/admin/FileUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { DialogueAttachment } from '@/types/dialogues'

interface EventFormProps {
  initialData?: EventItem
}

export default function EventForm({ initialData }: EventFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const formatForInput = (isoString?: string | null) => {
    if (!isoString) return ''
    try {
      const date = new Date(isoString)
      const tzOffset = date.getTimezoneOffset() * 60000
      return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16)
    } catch {
      return ''
    }
  }

  const parseInitialAttachments = (raw?: any): DialogueAttachment[] => {
    if (!raw) return []
    if (Array.isArray(raw)) return raw
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return []
  }

  const initialDialogueState: 'auto' | 'active' | 'closed' =
    initialData?.dialogue_state ||
    (initialData?.is_closed === true
      ? 'closed'
      : initialData?.is_closed === false
      ? 'active'
      : 'auto')

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    starts_at: formatForInput(initialData?.starts_at) || '2026-11-20T09:00',
    ends_at: formatForInput(initialData?.ends_at) || '2026-11-20T16:30',
    venue: initialData?.venue || '',
    virtual_url: initialData?.virtual_url || '',
    registration_url: initialData?.registration_url || '',
    featured_image: initialData?.featured_image || '',
    document_url: initialData?.document_url || initialData?.slides_url || '',
    dialogue_state: initialDialogueState,
    status: initialData?.status || 'published',
  })

  const [attachments, setAttachments] = useState<DialogueAttachment[]>(
    parseInitialAttachments(initialData?.attachments)
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const handleTitleChange = (val: string) => {
    const autoSlug = !isEditing
      ? val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : formData.slug

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: autoSlug,
    }))
  }

  const addAttachmentSlot = () => {
    setAttachments((prev) => [
      ...prev,
      { title: `Dialogue Document ${prev.length + 1} (PDF)`, url: '' },
    ])
  }

  const updateAttachment = (index: number, patch: Partial<DialogueAttachment>) => {
    setAttachments((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item))
    )
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== index))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = 'Dialogue title is required'
    if (!formData.slug.trim()) newErrors.slug = 'URL slug is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.starts_at) newErrors.starts_at = 'Start date and time is required'
    if (!formData.venue.trim() && !formData.virtual_url.trim()) {
      newErrors.venue = 'Provide either a physical venue or a virtual streaming link'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSaving(true)

    const validAttachments = attachments.filter((a) => a.url && a.url.trim().length > 0)
    const isClosedBool =
      formData.dialogue_state === 'closed'
        ? true
        : formData.dialogue_state === 'active'
        ? false
        : new Date(formData.ends_at || formData.starts_at) < new Date()

    const payload = {
      id: initialData?.id || crypto.randomUUID(),
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      starts_at: new Date(formData.starts_at).toISOString(),
      ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : null,
      venue: formData.venue || null,
      virtual_url: formData.virtual_url || null,
      registration_url: formData.registration_url || null,
      featured_image: formData.featured_image || null,
      document_url: formData.document_url || null,
      slides_url: formData.document_url || null,
      attachments: validAttachments,
      is_closed: isClosedBool,
      dialogue_state: formData.dialogue_state,
      status: formData.status,
    }

    try {
      const response = await fetch('/api/admin/crud/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to save dialogue event to database')
      }

      try {
        const stored = localStorage.getItem('acf_admin_events')
        const list: EventItem[] = stored ? JSON.parse(stored) : []
        const filtered = list.filter((item) => item.id !== payload.id)
        localStorage.setItem('acf_admin_events', JSON.stringify([payload, ...filtered]))
      } catch {
        // Ignore localStorage quota error
      }

      setIsSaving(false)
      setToast(
        isEditing
          ? 'Policy dialogue updated in database!'
          : 'New policy dialogue created in database!'
      )

      setTimeout(() => {
        router.push('/admin/events')
        router.refresh()
      }, 900)
    } catch (err: any) {
      setIsSaving(false)
      setErrors({ title: err.message || 'Database save failed' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6 pb-16">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f1d14] text-white px-5 py-3.5 rounded-xl shadow-xl border border-[#25633e] flex items-center gap-2.5 text-sm font-semibold">
          <CheckCircle2 size={18} className="text-[#eab308]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#e2ebe4] shadow-2xs">
        <div className="flex items-center gap-3.5">
          <Link
            href="/admin/events"
            className="p-2.5 rounded-lg border border-[#e2ebe4] text-[#5c6f62] hover:text-[#0f1d14] hover:bg-[#f6f9f6] transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#0f1d14] tracking-tight">
              {isEditing ? 'Edit Policy Dialogue / Event' : 'Schedule New Policy Dialogue'}
            </h1>
            <p className="text-xs text-[#5c6f62] mt-0.5">
              {isEditing
                ? `Editing "${initialData.title}"`
                : 'Configure dialogue schedule, venue, PDF attachments, and participation status'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/events"
            className="px-4 py-2.5 rounded-lg border border-[#e2ebe4] text-sm font-semibold text-[#4a5c50] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#175432] hover:bg-[#113f25] text-white font-semibold text-sm rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-60"
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : isEditing ? 'Update Dialogue' : 'Save Dialogue'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Core Event Details */}
          <div className="bg-white p-6 rounded-xl border border-[#e2ebe4] shadow-2xs space-y-5">
            <h2 className="text-base font-bold text-[#0f1d14] border-b border-[#e2ebe4] pb-3 flex items-center gap-2">
              <Calendar size={18} className="text-[#175432]" />
              <span>Policy Dialogue Details</span>
            </h2>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14]">
                Dialogue / Event Title <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Annual Zambia Agricultural Policy Symposium 2026"
                className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#175432] ${
                  errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-[#e2ebe4]'
                }`}
              />
              {errors.title && (
                <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.title}
                </p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14]">
                URL Slug <span className="text-rose-600">*</span>
              </label>
              <div className="flex items-center">
                <span className="px-3.5 py-2.5 bg-[#f6f9f6] border border-r-0 border-[#e2ebe4] rounded-l-lg text-xs text-[#5c6f62] font-mono">
                  /events/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-r-lg border border-[#e2ebe4] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#175432]"
                />
              </div>
            </div>

            {/* Rich Text Description */}
            <RichTextEditor
              label="Dialogue Description & Agenda"
              required
              rows={8}
              value={formData.description}
              onChange={(val) => setFormData({ ...formData, description: val })}
              error={errors.description}
              placeholder="Provide full event background, policy objectives, keynote speakers, and session breakdown..."
            />
          </div>

          {/* PDF Documents & Attachments Section */}
          <div className="bg-white p-6 rounded-xl border border-[#e2ebe4] shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#e2ebe4] pb-3">
              <h2 className="text-base font-bold text-[#0f1d14] flex items-center gap-2">
                <FileText size={18} className="text-[#175432]" />
                <span>Attached PDF Documents (Concept Note, Agenda, Proceedings)</span>
              </h2>
              <button
                type="button"
                onClick={addAttachmentSlot}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f0f6f1] hover:bg-[#e1ede4] text-[#175432] text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Extra PDF</span>
              </button>
            </div>

            <p className="text-xs text-[#5c6f62] leading-relaxed">
              Attach PDF documents (such as Concept Notes, Programme Agendas, Technical Briefs, or Post-Dialogue Proceedings) to display and allow downloads on the public Policy Dialogues page.
            </p>

            {/* Primary PDF Attachment */}
            <div className="p-4 rounded-xl bg-[#fafcfa] border border-[#e2ebe4]">
              <FileUpload
                label="Primary Dialogue PDF Document (Concept Note / Agenda / Proceedings)"
                type="document"
                accept=".pdf"
                value={formData.document_url}
                onChange={(url) => setFormData({ ...formData, document_url: url })}
                description="Upload a PDF document up to 25MB or paste a direct PDF URL"
              />
            </div>

            {/* Additional PDF Attachments */}
            {attachments.length > 0 && (
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5c6f62]">
                  Additional PDF Attachments ({attachments.length})
                </h3>
                {attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#f6f9f6] border border-[#e2ebe4] space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-[#0f1d14] mb-1">
                          Document Label / Title
                        </label>
                        <input
                          type="text"
                          value={att.title}
                          onChange={(e) => updateAttachment(idx, { title: e.target.value })}
                          placeholder="e.g. Draft Policy Brief (PDF) or Day 1 Agenda (PDF)"
                          className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#175432]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        className="mt-5 p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove attachment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <FileUpload
                      label="PDF File"
                      type="document"
                      accept=".pdf"
                      value={att.url}
                      onChange={(url, meta) =>
                        updateAttachment(idx, {
                          url,
                          size: meta?.size ?? att.size,
                          title:
                            att.title ||
                            (meta?.name ? `${meta.name} (PDF)` : `Dialogue Document ${idx + 1}`),
                        })
                      }
                      description="PDF up to 25MB"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location & Virtual Links */}
          <div className="bg-white p-6 rounded-xl border border-[#e2ebe4] shadow-2xs space-y-5">
            <h2 className="text-base font-bold text-[#0f1d14] border-b border-[#e2ebe4] pb-3 flex items-center gap-2">
              <MapPin size={18} className="text-[#175432]" />
              <span>Venue & Online Participation Links</span>
            </h2>

            {/* Physical Venue */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14] flex items-center gap-1.5">
                <MapPin size={14} className="text-[#175432]" />
                <span>Physical Venue / Location</span>
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g. Mulungushi International Conference Centre, Lusaka"
                className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#175432] ${
                  errors.venue ? 'border-rose-400 bg-rose-50/30' : 'border-[#e2ebe4]'
                }`}
              />
              {errors.venue && (
                <p className="text-xs text-rose-600 font-semibold">{errors.venue}</p>
              )}
            </div>

            {/* Virtual URL */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14] flex items-center gap-1.5">
                <Video size={14} className="text-blue-600" />
                <span>Virtual Streaming Link (Zoom / Teams / YouTube)</span>
              </label>
              <input
                type="text"
                value={formData.virtual_url}
                onChange={(e) => setFormData({ ...formData, virtual_url: e.target.value })}
                placeholder="https://zoom.us/j/..."
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2ebe4] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#175432]"
              />
            </div>

            {/* External Registration URL */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14] flex items-center gap-1.5">
                <Link2 size={14} className="text-[#175432]" />
                <span>External Registration Link (Optional)</span>
              </label>
              <input
                type="text"
                value={formData.registration_url}
                onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
                placeholder="Leave blank to use built-in Join Dialogue (Admin Approval) form"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2ebe4] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#175432]"
              />
              <p className="text-[11px] text-[#5c6f62]">
                Note: All active dialogues automatically allow users to request participation via the built-in admin-approved registration workflow.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Date & Time Settings */}
          <div className="bg-white p-6 rounded-xl border border-[#e2ebe4] shadow-2xs space-y-5">
            <h2 className="text-base font-bold text-[#0f1d14] border-b border-[#e2ebe4] pb-3">
              Date & Time (CAT)
            </h2>

            {/* Starts At */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14]">
                Starts At <span className="text-rose-600">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.starts_at}
                onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2ebe4] text-sm focus:outline-none focus:ring-2 focus:ring-[#175432]"
              />
              {errors.starts_at && (
                <p className="text-xs text-rose-600 font-semibold">{errors.starts_at}</p>
              )}
            </div>

            {/* Ends At */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14]">Ends At</label>
              <input
                type="datetime-local"
                value={formData.ends_at}
                onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2ebe4] text-sm focus:outline-none focus:ring-2 focus:ring-[#175432]"
              />
            </div>

            {/* Dialogue Tab Placement (Active vs Closed) */}
            <div className="space-y-1.5 pt-2 border-t border-[#e2ebe4]">
              <label className="text-sm font-bold text-[#0f1d14] flex items-center gap-1.5">
                <Clock size={14} className="text-[#175432]" />
                <span>Dialogue Tab Placement</span>
              </label>
              <select
                value={formData.dialogue_state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dialogue_state: e.target.value as 'auto' | 'active' | 'closed',
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2ebe4] text-sm bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#175432]"
              >
                <option value="active">Active Dialogue (Open to Join)</option>
                <option value="closed">Closed Dialogue (Concluded)</option>
                <option value="auto">Automatic (Based on Event Date)</option>
              </select>
              <p className="text-[11px] text-[#5c6f62]">
                Controls whether this dialogue appears under the <strong>Active Dialogues</strong> tab or the <strong>Closed Dialogues</strong> tab on <code>/events</code>.
              </p>
            </div>

            {/* Publishing Status */}
            <div className="space-y-1.5 pt-2 border-t border-[#e2ebe4]">
              <label className="text-sm font-bold text-[#0f1d14]">Visibility Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'published' | 'draft' | 'scheduled' | 'archived',
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2ebe4] text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#175432]"
              >
                <option value="published">Published (Visible on Site)</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived (Closed)</option>
              </select>
            </div>
          </div>

          {/* Event Banner Image Upload */}
          <div className="bg-white p-6 rounded-xl border border-[#e2ebe4] shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-[#0f1d14] border-b border-[#e2ebe4] pb-3">
              Dialogue Banner Image
            </h2>

            <FileUpload
              label="Featured Banner"
              type="image"
              accept="image/*"
              value={formData.featured_image}
              onChange={(url) => setFormData({ ...formData, featured_image: url })}
              description="Upload banner image from device (PNG, JPG, WebP)"
            />
          </div>
        </div>
      </div>
    </form>
  )
}
