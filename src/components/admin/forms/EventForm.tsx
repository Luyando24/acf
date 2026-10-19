'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MapPin,
  Video,
  Globe,
  Sparkles,
} from 'lucide-react'
import { EventItem } from '@/components/admin/EventManager'
import FileUpload from '@/components/admin/FileUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'

interface EventFormProps {
  initialData?: EventItem | null
}

export default function EventForm({ initialData }: EventFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initialData)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    starts_at: initialData?.starts_at
      ? new Date(initialData.starts_at).toISOString().slice(0, 16)
      : new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16),
    ends_at: initialData?.ends_at
      ? new Date(initialData.ends_at).toISOString().slice(0, 16)
      : new Date(Date.now() + 86400000 * 7 + 3600000 * 4).toISOString().slice(0, 16),
    venue: initialData?.venue || 'Mulungushi International Conference Centre, Lusaka',
    virtual_url: initialData?.virtual_url || '',
    registration_url: initialData?.registration_url || '',
    featured_image: initialData?.featured_image || '/photos/event1.jpg',
    status: initialData?.status || 'published',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === '' || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : prev.slug,
    }))
    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.title.trim() || formData.title.trim().length < 5) {
      errs.title = 'Event title is required and must be at least 5 characters.'
    }
    if (!formData.slug.trim() || !/^[a-z0-9-]+$/.test(formData.slug.trim())) {
      errs.slug = 'URL slug is required and may only contain lowercase letters, numbers, and hyphens.'
    }
    if (!formData.starts_at) {
      errs.starts_at = 'Start date and time is required.'
    }
    if (formData.ends_at && formData.starts_at && new Date(formData.ends_at) < new Date(formData.starts_at)) {
      errs.ends_at = 'Conclusion date and time cannot precede commencement date.'
    }
    if (!formData.venue.trim() && !formData.virtual_url.trim()) {
      errs.venue = 'Please specify either a physical venue location or a virtual stream link.'
    }
    if (formData.registration_url.trim() && !/^https?:\/\//i.test(formData.registration_url.trim())) {
      errs.registration_url = 'Registration URL must begin with http:// or https://'
    }
    if (formData.virtual_url.trim() && !/^https?:\/\//i.test(formData.virtual_url.trim())) {
      errs.virtual_url = 'Virtual meeting URL must begin with http:// or https://'
    }
    if (!formData.description.trim() || formData.description.trim().length < 20) {
      errs.description = 'Event description and agenda is required (minimum 20 characters).'
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

    const slug = formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const payload = {
      id: initialData?.id || crypto.randomUUID(),
      title: formData.title.trim(),
      slug,
      description: formData.description.trim(),
      starts_at: new Date(formData.starts_at).toISOString(),
      ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : null,
      venue: formData.venue.trim() || null,
      virtual_url: formData.virtual_url.trim() || null,
      registration_url: formData.registration_url.trim() || null,
      featured_image: formData.featured_image.trim() || null,
      status: formData.status,
    }

    try {
      const res = await fetch('/api/admin/crud/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save event schedule.')
      }

      setNotification({
        type: 'success',
        message: isEdit ? 'Event schedule updated.' : 'New dialogue event scheduled.',
      })
      setTimeout(() => {
        router.push('/admin/events')
        router.refresh()
      }, 800)
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error saving event schedule.',
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
            href="/admin/events"
            className="p-2 text-[#5c6f62] hover:text-[#0f1d14] hover:bg-[#f6f9f6] rounded-xl transition-colors"
            title="Back to Events"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5c6f62]">
              <Link href="/admin/events" className="hover:underline">
                Events
              </Link>
              <span>/</span>
              <span className="text-[#175432]">{isEdit ? 'Edit Event' : 'Schedule New Event'}</span>
            </div>
            <h1 className="text-xl font-black text-[#0f1d14] mt-0.5">
              {isEdit ? `Edit: ${initialData?.title}` : 'Schedule Forum or Dialogue'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/events"
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
            <span>{isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Event'}</span>
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

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-5">
            <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider flex items-center gap-2">
              <Calendar size={16} className="text-[#175432]" />
              Event Logistics & Dates
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f1d14]">Event Name / Forum Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. National Agricultural Policy Stakeholder Conference 2026"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">Commencement Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.starts_at}
                  onChange={(e) => {
                    setFormData({ ...formData, starts_at: e.target.value })
                    if (errors.starts_at) setErrors((prev) => ({ ...prev, starts_at: '' }))
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                    errors.starts_at ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                  }`}
                />
                {errors.starts_at && (
                  <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.starts_at}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">Conclusion Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.ends_at}
                  onChange={(e) => {
                    setFormData({ ...formData, ends_at: e.target.value })
                    if (errors.ends_at) setErrors((prev) => ({ ...prev, ends_at: '' }))
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                    errors.ends_at ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                  }`}
                />
                {errors.ends_at && (
                  <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.ends_at}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f1d14]">Physical Venue Location</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-3 text-[#5c6f62]" />
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => {
                    setFormData({ ...formData, venue: e.target.value })
                    if (errors.venue) setErrors((prev) => ({ ...prev, venue: '' }))
                  }}
                  placeholder="e.g. Mulungushi International Conference Centre, Lusaka"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                    errors.venue ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                  }`}
                />
              </div>
              {errors.venue && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.venue}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">Virtual Stream Link (Zoom/Teams)</label>
                <div className="relative">
                  <Video size={15} className="absolute left-3.5 top-3 text-[#5c6f62]" />
                  <input
                    type="url"
                    value={formData.virtual_url}
                    onChange={(e) => {
                      setFormData({ ...formData, virtual_url: e.target.value })
                      if (errors.virtual_url) setErrors((prev) => ({ ...prev, virtual_url: '' }))
                    }}
                    placeholder="https://zoom.us/j/..."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                      errors.virtual_url ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                    }`}
                  />
                </div>
                {errors.virtual_url && (
                  <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.virtual_url}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">Registration Form URL</label>
                <div className="relative">
                  <Globe size={15} className="absolute left-3.5 top-3 text-[#5c6f62]" />
                  <input
                    type="url"
                    value={formData.registration_url}
                    onChange={(e) => {
                      setFormData({ ...formData, registration_url: e.target.value })
                      if (errors.registration_url) setErrors((prev) => ({ ...prev, registration_url: '' }))
                    }}
                    placeholder="https://forms.gle/..."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                      errors.registration_url ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                    }`}
                  />
                </div>
                {errors.registration_url && (
                  <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.registration_url}
                  </p>
                )}
              </div>
            </div>

            {/* Rich Text Editor for Agenda */}
            <div className="space-y-1.5">
              <RichTextEditor
                label="Detailed Description & Session Agenda"
                value={formData.description}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, description: val }))
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }))
                }}
                placeholder="Overview of keynote speakers, panel topics, breakout sessions, and stakeholder invitees..."
                rows={10}
                error={errors.description}
                required
                description="Supports headings, lists of panel sessions, and speaker biographies."
              />
            </div>
          </div>

          {/* Local Device Photo Upload */}
          <div className="bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-5">
            <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-[#175432]" />
              Event Poster / Banner Artwork
            </h2>

            <FileUpload
              label="Event Banner Photo"
              value={formData.featured_image}
              onChange={(url) => {
                setFormData((prev) => ({ ...prev, featured_image: url }))
              }}
              accept="image/*"
              type="image"
              description="Upload conference banner or venue artwork from device (PNG, JPG, WebP)."
              maxSizeMb={15}
            />
          </div>
        </div>

        {/* Right Column (1 col): Controls & Preview */}
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
                <option value="published">Published (Accepting RSVPs)</option>
                <option value="draft">Draft (Planning stage)</option>
                <option value="archived">Archived / Past Event</option>
              </select>
            </div>
          </div>

          {/* Live Event Card Preview */}
          <div className="bg-gradient-to-br from-[#f6f9f6] to-[#edf4ee] p-6 rounded-3xl border border-[#d6e5d8] space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#175432] uppercase tracking-wider">
              <span>Card Preview</span>
              <span className="capitalize px-2 py-0.5 bg-white rounded text-[10px] font-bold">
                {formData.status}
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-[#e2ebe4] shadow-xs overflow-hidden">
              <div className="h-32 bg-gray-100 overflow-hidden relative">
                <img
                  src={formData.featured_image || '/photos/event1.jpg'}
                  alt={formData.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/photos/logo.png'
                  }}
                />
              </div>

              <div className="p-4 space-y-2">
                <div className="text-[10px] font-bold text-[#175432] flex items-center gap-1.5">
                  <Calendar size={11} />
                  <span>{formData.starts_at ? new Date(formData.starts_at).toDateString() : 'Date'}</span>
                </div>

                <h4 className="text-xs font-bold text-[#0f1d14] line-clamp-2">
                  {formData.title || 'Event Forum Title'}
                </h4>

                <div className="text-[11px] text-[#5c6f62] flex items-center gap-1">
                  <MapPin size={11} className="shrink-0 text-[#175432]" />
                  <span className="truncate">{formData.venue || 'Venue Location'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
