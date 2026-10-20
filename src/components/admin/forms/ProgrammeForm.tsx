'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Sprout,
  Scale,
  BookOpen,
  Users,
  Shield,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react'
import { ProgrammeItem } from '@/components/admin/ProgrammeManager'
import FileUpload from '@/components/admin/FileUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'

const ICON_OPTIONS = [
  { name: 'Sprout', icon: Sprout, label: 'Sprout / Agriculture' },
  { name: 'Scale', icon: Scale, label: 'Scale / Policy & Law' },
  { name: 'BookOpen', icon: BookOpen, label: 'Book / Evidence & Research' },
  { name: 'Users', icon: Users, label: 'Users / Multi-Stakeholder' },
  { name: 'Shield', icon: Shield, label: 'Shield / Tenure & Protection' },
  { name: 'Award', icon: Award, label: 'Award / Excellence' },
]

interface ProgrammeFormProps {
  initialData?: ProgrammeItem | null
}

export default function ProgrammeForm({ initialData }: ProgrammeFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initialData)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    summary: initialData?.summary || '',
    body: initialData?.body || '',
    cover_image: initialData?.cover_image || '/photos/fieldwork.jpg',
    icon: initialData?.icon || 'Sprout',
    order_index: initialData?.order_index ?? 1,
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
      errs.title = 'Programme title is required and must be at least 5 characters.'
    }
    if (!formData.slug.trim() || !/^[a-z0-9-]+$/.test(formData.slug.trim())) {
      errs.slug = 'URL slug is required and may only contain lowercase letters, numbers, and hyphens.'
    }
    if (!formData.summary.trim() || formData.summary.trim().length < 15) {
      errs.summary = 'Strategic focus summary is required (minimum 15 characters).'
    }
    if (!formData.body.trim() || formData.body.trim().length < 20) {
      errs.body = 'Detailed objectives and scope is required (minimum 20 characters).'
    }
    if (!formData.order_index || formData.order_index < 1) {
      errs.order_index = 'Display order must be a positive integer.'
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
      summary: formData.summary.trim(),
      body: formData.body.trim(),
      cover_image: formData.cover_image.trim() || null,
      icon: formData.icon,
      order_index: Number(formData.order_index) || 1,
      status: formData.status,
    }

    try {
      const res = await fetch('/api/admin/crud/programmes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save programme area.')
      }

      setNotification({
        type: 'success',
        message: isEdit ? 'Thematic programme updated successfully.' : 'New thematic programme area created.',
      })
      setTimeout(() => {
        router.push('/admin/programmes')
        router.refresh()
      }, 800)
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error saving programme pillar.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const SelectedIcon = ICON_OPTIONS.find((i) => i.name === formData.icon)?.icon || Sprout

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/programmes"
            className="p-2 text-[#5c6f62] hover:text-[#0f1d14] hover:bg-[#f6f9f6] rounded-md transition-colors"
            title="Back to Programmes"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#5c6f62]">
              <Link href="/admin/programmes" className="hover:underline">
                Programmes
              </Link>
              <span>/</span>
              <span className="text-[#175432]">{isEdit ? 'Edit Programme Area' : 'New Programme Area'}</span>
            </div>
            <h1 className="text-xl font-black text-[#0f1d14] mt-0.5">
              {isEdit ? `Edit: ${initialData?.title}` : 'Create Thematic Programme'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/programmes"
            className="px-4 py-2 border border-[#e2ebe4] text-sm font-bold text-[#5c6f62] hover:bg-[#f6f9f6] rounded-md transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2 bg-[#175432] hover:bg-[#114227] text-white text-sm font-bold rounded-md shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save size={15} />
            <span>{isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Pillar'}</span>
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

      {/* Main 2-Column Form Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs space-y-5">
            <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider flex items-center gap-2">
              <Layers size={16} className="text-[#175432]" />
              Strategic Pillar Core Details
            </h2>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14]">Programme Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Climate Resilience & Sustainable Farming Systems"
                className={`w-full px-4 py-2.5 rounded-md border text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                  errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                }`}
              />
              {errors.title && (
                <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14]">URL Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => {
                  setFormData({ ...formData, slug: e.target.value })
                  if (errors.slug) setErrors((prev) => ({ ...prev, slug: '' }))
                }}
                placeholder="e.g. climate-resilience"
                className={`w-full px-4 py-2.5 rounded-md border text-sm font-mono bg-[#f6f9f6] focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                  errors.slug ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                }`}
              />
              {errors.slug && (
                <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.slug}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14]">Strategic Focus Summary *</label>
              <textarea
                rows={3}
                required
                value={formData.summary}
                onChange={(e) => {
                  setFormData({ ...formData, summary: e.target.value })
                  if (errors.summary) setErrors((prev) => ({ ...prev, summary: '' }))
                }}
                placeholder="Concise overview of strategic focus and policy interventions..."
                className={`w-full px-4 py-2.5 rounded-md border text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none leading-relaxed transition-all ${
                  errors.summary ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                }`}
              />
              {errors.summary && (
                <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.summary}
                </p>
              )}
            </div>

            {/* Rich Text Editor for Detailed Objectives */}
            <div className="space-y-1.5">
              <RichTextEditor
                label="Detailed Objectives & Intervention Scope"
                value={formData.body}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, body: val }))
                  if (errors.body) setErrors((prev) => ({ ...prev, body: '' }))
                }}
                placeholder="In-depth explanation of research deliverables, advocacy targets, multi-stakeholder engagements, and impact indicators..."
                rows={10}
                error={errors.body}
                required
                description="Supports formatted section headings, policy action lists, and partner callouts."
              />
            </div>
          </div>

          {/* Media & Icon Selection with Device Upload */}
          <div className="bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs space-y-5">
            <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-[#175432]" />
              Visuals & Branding
            </h2>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14]">Icon Representation</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none bg-white font-medium"
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.name} value={opt.name}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <FileUpload
              label="Pillar Cover Photography"
              value={formData.cover_image}
              onChange={(url) => {
                setFormData((prev) => ({ ...prev, cover_image: url }))
              }}
              accept="image/*"
              type="image"
              description="Upload fieldwork or policy imagery from your device (PNG, JPG, WebP)."
              maxSizeMb={15}
            />
          </div>
        </div>

        {/* Right Column (1 col): Metadata & Preview */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs space-y-5">
            <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider">Publishing Controls</h2>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14]">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm font-semibold focus:ring-2 focus:ring-[#175432] focus:outline-none bg-white"
              >
                <option value="published">Published (Visible in Our Work)</option>
                <option value="draft">Draft (Internal review)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14]">Display Order Position</label>
              <input
                type="number"
                min="1"
                value={formData.order_index}
                onChange={(e) => {
                  setFormData({ ...formData, order_index: Number(e.target.value) })
                  if (errors.order_index) setErrors((prev) => ({ ...prev, order_index: '' }))
                }}
                className={`w-full px-4 py-2.5 rounded-md border text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none bg-white font-mono ${
                  errors.order_index ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                }`}
              />
              {errors.order_index && (
                <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.order_index}
                </p>
              )}
              <p className="text-xs text-[#5c6f62]">Pillars are ordered numerically on public portal pages.</p>
            </div>
          </div>

          {/* Live Card Preview */}
          <div className="bg-gradient-to-br from-[#f6f9f6] to-[#edf4ee] p-6 rounded-lg border border-[#d6e5d8] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#175432] uppercase tracking-wider">
              <span>Card Preview</span>
              <span className="px-2 py-0.5 bg-white rounded-md text-[11px] font-bold">#{formData.order_index}</span>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#e2ebe4] shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-[#eaf4ec] text-[#175432] flex items-center justify-center">
                  <SelectedIcon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-[#175432]">ACF Thematic Area</span>
                  <h4 className="text-sm font-bold text-[#0f1d14] truncate">
                    {formData.title || 'Untitled Programme Area'}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-[#5c6f62] line-clamp-3 leading-relaxed">
                {formData.summary || 'Strategic summary of interventions will display here on public overview cards.'}
              </p>

              <div className="pt-2 border-t border-[#e2ebe4] flex items-center justify-between text-[11px] text-[#5c6f62]">
                <span className="font-mono">/our-work/{formData.slug || 'slug'}</span>
                <span className="capitalize font-semibold text-[#175432]">{formData.status}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
