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
  Sparkles,
} from 'lucide-react'
import { NewsItem } from '@/components/admin/NewsManager'
import FileUpload from '@/components/admin/FileUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'

const NEWS_CATEGORIES = [
  'Sector News',
  'Policy Dialogue',
  'Secretariat Updates',
  'Press Release',
  'Field Insights',
]

interface NewsFormProps {
  initialData?: NewsItem | null
}

export default function NewsForm({ initialData }: NewsFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initialData)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    category: initialData?.category || 'Sector News',
    excerpt: initialData?.excerpt || '',
    body: initialData?.body || '',
    featured_image: initialData?.featured_image || '/photos/dialogue.jpg',
    published_at: initialData?.published_at
      ? initialData.published_at.split('T')[0]
      : new Date().toISOString().split('T')[0],
    status: initialData?.status || 'published',
    is_featured: Boolean(initialData?.is_featured),
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
      errs.title = 'Headline is required and must be at least 5 characters.'
    }
    if (!formData.slug.trim() || !/^[a-z0-9-]+$/.test(formData.slug.trim())) {
      errs.slug = 'URL slug is required and may only contain lowercase letters, numbers, and hyphens.'
    }
    if (!formData.excerpt.trim() || formData.excerpt.trim().length < 15) {
      errs.excerpt = 'Article excerpt is required and must be at least 15 characters.'
    }
    if (!formData.body.trim() || formData.body.trim().length < 25) {
      errs.body = 'Article body is required (must contain at least 25 characters of detailed content).'
    }
    if (!formData.featured_image.trim()) {
      errs.featured_image = 'Please upload a featured photo or choose an asset image.'
    }
    if (!formData.published_at) {
      errs.published_at = 'Publication date is required.'
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
      category: formData.category,
      excerpt: formData.excerpt.trim(),
      body: formData.body.trim(),
      featured_image: formData.featured_image.trim() || null,
      published_at: formData.published_at,
      status: formData.status,
      is_featured: formData.is_featured,
    }

    try {
      const res = await fetch('/api/admin/crud/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to persist news article.')
      }

      setNotification({
        type: 'success',
        message: isEdit ? 'Article updated successfully.' : 'New article published successfully.',
      })
      setTimeout(() => {
        router.push('/admin/news')
        router.refresh()
      }, 800)
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error saving article. Please check your network connection.',
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
            href="/admin/news"
            className="p-2 text-[#5c6f62] hover:text-[#0f1d14] hover:bg-[#f6f9f6] rounded-xl transition-colors"
            title="Back to News"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5c6f62]">
              <Link href="/admin/news" className="hover:underline">
                News & Press
              </Link>
              <span>/</span>
              <span className="text-[#175432]">{isEdit ? 'Edit Article' : 'Write New Article'}</span>
            </div>
            <h1 className="text-xl font-black text-[#0f1d14] mt-0.5">
              {isEdit ? `Edit: ${initialData?.title}` : 'Publish News or Press Release'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/news"
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
            <span>{isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Story'}</span>
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
              <FileText size={16} className="text-[#175432]" />
              Article Story Details
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f1d14]">Article Headline *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. ACF Convenes National Stakeholder Dialogue on Agriculture Budget 2026"
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
                <label className="text-xs font-bold text-[#0f1d14]">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none bg-white font-semibold"
                >
                  {NEWS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f1d14]">Lead / Excerpt Summary *</label>
              <textarea
                rows={3}
                required
                value={formData.excerpt}
                onChange={(e) => {
                  setFormData({ ...formData, excerpt: e.target.value })
                  if (errors.excerpt) setErrors((prev) => ({ ...prev, excerpt: '' }))
                }}
                placeholder="Concise lead paragraph highlighting key quotes and policy implications..."
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none leading-relaxed transition-all ${
                  errors.excerpt ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                }`}
              />
              {errors.excerpt && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.excerpt}
                </p>
              )}
            </div>

            {/* Rich Text Editor for Body */}
            <div className="space-y-1.5">
              <RichTextEditor
                label="Full Article Body & Narrative"
                value={formData.body}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, body: val }))
                  if (errors.body) setErrors((prev) => ({ ...prev, body: '' }))
                }}
                placeholder="Write full article body. Use the toolbar for bold text, headers, quotes, lists, and links..."
                rows={12}
                error={errors.body}
                required
                description="Supports headings (##), bullet points, blockquotes, and link references."
              />
            </div>
          </div>

          {/* Local Device Photo Upload */}
          <div className="bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-5">
            <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-[#175432]" />
              Featured Cover Photo
            </h2>

            <FileUpload
              label="Article Banner Image"
              value={formData.featured_image}
              onChange={(url) => {
                setFormData((prev) => ({ ...prev, featured_image: url }))
                if (errors.featured_image) setErrors((prev) => ({ ...prev, featured_image: '' }))
              }}
              accept="image/*"
              type="image"
              error={errors.featured_image}
              required
              description="Upload high-resolution photography from your device (PNG, JPG, WebP)."
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
                <option value="published">Published (Live)</option>
                <option value="draft">Draft (Private editorial review)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f1d14]">Publication Date *</label>
              <input
                type="date"
                required
                value={formData.published_at}
                onChange={(e) => {
                  setFormData({ ...formData, published_at: e.target.value })
                  if (errors.published_at) setErrors((prev) => ({ ...prev, published_at: '' }))
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                  errors.published_at ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                }`}
              />
              {errors.published_at && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.published_at}
                </p>
              )}
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 p-3 bg-[#f6f9f6] rounded-2xl border border-[#e2ebe4] cursor-pointer hover:bg-[#edf4ee] transition-colors">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded text-[#175432] focus:ring-[#175432] h-4 w-4"
                />
                <div>
                  <span className="text-xs font-bold text-[#0f1d14] flex items-center gap-1.5">
                    <Star size={13} className="text-amber-500 fill-amber-500" />
                    Feature on Homepage
                  </span>
                  <span className="text-[11px] text-[#5c6f62] block mt-0.5">
                    Pinned to the homepage Latest News headline grid.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Live News Card Preview */}
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
                  src={formData.featured_image || '/photos/dialogue.jpg'}
                  alt={formData.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/photos/logo.png'
                  }}
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#175432] text-white text-[9px] font-bold rounded-md">
                  {formData.category}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="text-xs font-bold text-[#0f1d14] line-clamp-2">
                  {formData.title || 'Headline will appear here'}
                </h4>
                <p className="text-[11px] text-[#5c6f62] line-clamp-2 leading-relaxed">
                  {formData.excerpt || 'Excerpt lead summary will show here.'}
                </p>
                <div className="pt-2 border-t border-[#e2ebe4] flex items-center justify-between text-[10px] text-[#5c6f62]">
                  <span>{formData.published_at}</span>
                  <span className="text-[#175432] font-bold">Read Story →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
