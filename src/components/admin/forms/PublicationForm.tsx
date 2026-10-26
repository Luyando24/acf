'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Star,
  Globe,
} from 'lucide-react'
import { PublicationItem } from '@/components/admin/PublicationManager'
import FileUpload from '@/components/admin/FileUpload'
import { isServableDocumentPath } from '@/lib/uploads/policy'

const CATEGORIES = [
  'Policy Briefs',
  'Research Reports',
  'Policy Advisory Notes',
  'Annual Reports',
  'Parliamentary Submissions',
  'Workshop Reports',
]

interface PublicationFormProps {
  initialData?: PublicationItem | null
}

export default function PublicationForm({ initialData }: PublicationFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initialData)

  const sizeMb = initialData?.file_size
    ? (initialData.file_size / (1024 * 1024)).toFixed(1)
    : ''

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    summary: initialData?.summary || '',
    category: initialData?.category_name || initialData?.publication_categories?.name || 'Policy Briefs',
    published_on: initialData?.published_on ? initialData.published_on.split('T')[0] : new Date().toISOString().split('T')[0],
    file_path: initialData?.file_path || '',
    file_size_mb: sizeMb,
    is_featured: Boolean(initialData?.is_featured),
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
      errs.title = 'Title is required and must be at least 5 characters.'
    }
    if (!formData.slug.trim() || !/^[a-z0-9-]+$/.test(formData.slug.trim())) {
      errs.slug = 'URL slug is required and may only contain lowercase letters, numbers, and hyphens.'
    }
    if (!formData.summary.trim() || formData.summary.trim().length < 15) {
      errs.summary = 'Executive summary is required and must be at least 15 characters.'
    }
    if (!formData.file_path.trim()) {
      errs.file_path = 'A PDF or document file is required. Please upload one from your device.'
    } else if (!isServableDocumentPath(formData.file_path.trim())) {
      errs.file_path =
        'This path does not point to an uploaded file. Upload the document from your device, or paste a public https:// link.'
    }
    if (!formData.published_on) {
      errs.published_on = 'Publication release date is required.'
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
    const parsedSize = parseFloat(formData.file_size_mb)
    const file_size = Number.isFinite(parsedSize) ? Math.round(parsedSize * 1024 * 1024) : 0

    const payload = {
      id: initialData?.id || crypto.randomUUID(),
      title: formData.title.trim(),
      slug,
      summary: formData.summary.trim(),
      published_on: formData.published_on,
      file_path: formData.file_path.trim(),
      file_size,
      is_featured: formData.is_featured,
      status: formData.status,
    }

    try {
      const res = await fetch('/api/admin/crud/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to persist publication to database.')
      }

      setNotification({
        type: 'success',
        message: isEdit ? 'Publication updated successfully.' : 'New publication uploaded and catalogued.',
      })
      setTimeout(() => {
        router.push('/admin/publications')
        router.refresh()
      }, 800)
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error saving publication. Please verify database connection.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/publications"
            className="p-2 text-[#5c6f62] hover:text-[#0f1d14] hover:bg-[#f6f9f6] rounded-md transition-colors"
            title="Back to Publications"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#5c6f62]">
              <Link href="/admin/publications" className="hover:underline">
                Publications
              </Link>
              <span>/</span>
              <span className="text-[#175432]">{isEdit ? 'Edit Publication' : 'Upload Publication'}</span>
            </div>
            <h1 className="text-xl font-black text-[#0f1d14] mt-0.5">
              {isEdit ? `Edit: ${initialData?.title}` : 'Upload & Catalogue Publication'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/publications"
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
            <span>{isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Report'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
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

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs space-y-5">
            <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} className="text-[#175432]" />
              Publication Metadata
            </h2>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14]">Document Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Zambia Agricultural Sector Policy Review 2025/2026"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="text-sm font-bold text-[#0f1d14]">Category Caucus *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none bg-white font-semibold"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14]">Executive Summary *</label>
              <textarea
                rows={4}
                required
                value={formData.summary}
                onChange={(e) => {
                  setFormData({ ...formData, summary: e.target.value })
                  if (errors.summary) setErrors((prev) => ({ ...prev, summary: '' }))
                }}
                placeholder="Brief summary of policy findings, methodology, and recommendations..."
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
          </div>

          {/* Local Device File Upload */}
          <div className="bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs space-y-5">
            <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} className="text-[#175432]" />
              PDF / Document Attachment
            </h2>

            <FileUpload
              label="Publication File (Upload from device or enter path)"
              value={formData.file_path}
              onChange={(url, meta) => {
                const newSizeMb = meta?.size ? (meta.size / (1024 * 1024)).toFixed(1) : formData.file_size_mb
                setFormData((prev) => ({
                  ...prev,
                  file_path: url,
                  file_size_mb: newSizeMb,
                }))
                if (errors.file_path) setErrors((prev) => ({ ...prev, file_path: '' }))
              }}
              accept=".pdf,.doc,.docx"
              type="document"
              error={errors.file_path}
              required
              description="Upload PDF, DOC, or DOCX documents from your local device up to 50MB."
              maxSizeMb={50}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#0f1d14]">Calculated File Size (MB)</label>
                <input
                  type="text"
                  value={formData.file_size_mb}
                  onChange={(e) => setFormData({ ...formData, file_size_mb: e.target.value })}
                  placeholder="2.5"
                  className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#0f1d14]">Release / Published Date *</label>
                <input
                  type="date"
                  required
                  value={formData.published_on}
                  onChange={(e) => {
                    setFormData({ ...formData, published_on: e.target.value })
                    if (errors.published_on) setErrors((prev) => ({ ...prev, published_on: '' }))
                  }}
                  className={`w-full px-4 py-2.5 rounded-md border text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                    errors.published_on ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                  }`}
                />
                {errors.published_on && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.published_on}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Publishing Controls & Preview */}
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
                <option value="published">Published (Public)</option>
                <option value="draft">Draft (Internal review)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 p-3 bg-[#f6f9f6] rounded-lg border border-[#e2ebe4] cursor-pointer hover:bg-[#edf4ee] transition-colors">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded text-[#175432] focus:ring-[#175432] h-4 w-4"
                />
                <div>
                  <span className="text-sm font-bold text-[#0f1d14] flex items-center gap-1.5">
                    <Star size={13} className="text-amber-500 fill-amber-500" />
                    Feature on Homepage
                  </span>
                  <span className="text-xs text-[#5c6f62] block mt-0.5">
                    Showcase prominently in the Featured Publications carousel.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="bg-gradient-to-br from-[#f6f9f6] to-[#edf4ee] p-6 rounded-lg border border-[#d6e5d8] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#175432] uppercase tracking-wider">
              <span>Public Card Preview</span>
              <span className="capitalize px-2 py-0.5 bg-white rounded text-[11px] font-bold">
                {formData.status}
              </span>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#e2ebe4] shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f0f6f1] text-[#175432]">
                  {formData.category}
                </span>
                {formData.is_featured && (
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Star size={10} className="fill-amber-500" /> Featured
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-[#0f1d14] line-clamp-2">
                {formData.title || 'Untitled Document'}
              </h4>

              <p className="text-xs text-[#5c6f62] line-clamp-3 leading-relaxed">
                {formData.summary || 'Summary description will appear here on public publication cards.'}
              </p>

              <div className="pt-2 border-t border-[#e2ebe4] flex items-center justify-between text-[11px] text-[#5c6f62]">
                <span>{formData.published_on || 'Release date'}</span>
                <span className="font-mono font-bold text-[#175432]">{formData.file_size_mb} MB PDF</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
