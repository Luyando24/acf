'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Handshake,
  Globe,
  Home,
  Eye,
  EyeOff,
  Building2,
} from 'lucide-react'
import { PartnerItem } from '@/components/admin/PartnerManager'
import FileUpload from '@/components/admin/FileUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'

const PARTNER_TYPES = [
  'Collaborating Institution',
  'Partner',
  'Development Partner',
  'Network & Affiliation',
] as const

interface PartnerFormProps {
  initialData?: PartnerItem | null
}

export default function PartnerForm({ initialData }: PartnerFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initialData)

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: (initialData?.type || 'Collaborating Institution') as PartnerItem['type'],
    logo_url: initialData?.logo_url || '/partners/sample-logo.svg',
    website_url: initialData?.website_url || '',
    description: initialData?.description || '',
    order_index: initialData?.order_index ?? 1,
    show_on_home: initialData?.show_on_home ?? true,
    is_visible: initialData?.is_visible ?? true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      errs.name = 'Partner organization name is required and must be at least 3 characters.'
    }
    if (formData.website_url.trim() && !/^https?:\/\//i.test(formData.website_url.trim())) {
      errs.website_url = 'Website URL must begin with http:// or https://'
    }
    if (!formData.order_index || formData.order_index < 1) {
      errs.order_index = 'Display order position must be a positive integer.'
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

    const payload = {
      id: initialData?.id || crypto.randomUUID(),
      name: formData.name.trim(),
      type: formData.type,
      logo_url: formData.logo_url.trim() || null,
      website_url: formData.website_url.trim() || null,
      description: formData.description.trim() || null,
      order_index: Number(formData.order_index) || 1,
      show_on_home: formData.show_on_home,
      is_visible: formData.is_visible,
    }

    try {
      const res = await fetch('/api/admin/crud/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save partner organization.')
      }

      setNotification({
        type: 'success',
        message: isEdit ? 'Partner profile updated successfully.' : 'New partner affiliation added.',
      })
      setTimeout(() => {
        router.push('/admin/partners')
        router.refresh()
      }, 800)
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error saving partner.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/partners"
            className="p-2 text-[#5c6f62] hover:text-[#0f1d14] hover:bg-[#f6f9f6] rounded-xl transition-colors"
            title="Back to Partners"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5c6f62]">
              <Link href="/admin/partners" className="hover:underline">
                Partners
              </Link>
              <span>/</span>
              <span className="text-[#175432]">{isEdit ? 'Edit Partner' : 'New Partner Affiliation'}</span>
            </div>
            <h1 className="text-xl font-black text-[#0f1d14] mt-0.5">
              {isEdit ? `Edit: ${initialData?.name}` : 'Add Partner Organization'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/partners"
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
            <span>{isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Partner'}</span>
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
              <Building2 size={16} className="text-[#175432]" />
              Institutional Profile
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f1d14]">Partner Organization Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
                }}
                placeholder="e.g. Indaba Agricultural Policy Research Institute (IAPRI)"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                  errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                }`}
              />
              {errors.name && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">Affiliation Classification *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none bg-white font-semibold"
                >
                  {PARTNER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f1d14]">Official Website URL</label>
                <div className="relative">
                  <Globe size={15} className="absolute left-3.5 top-3 text-[#5c6f62]" />
                  <input
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => {
                      setFormData({ ...formData, website_url: e.target.value })
                      if (errors.website_url) setErrors((prev) => ({ ...prev, website_url: '' }))
                    }}
                    placeholder="https://www.iapri.org.zm"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                      errors.website_url ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                    }`}
                  />
                </div>
                {errors.website_url && (
                  <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.website_url}
                  </p>
                )}
              </div>
            </div>

            {/* Rich Text Editor for Partnership Scope */}
            <div className="space-y-1.5">
              <RichTextEditor
                label="Scope of Partnership & Cooperation"
                value={formData.description}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, description: val }))
                }}
                placeholder="Outline joint research studies, memorandum of understanding, co-hosted policy dialogues, or bilateral funding scope..."
                rows={5}
                description="Supports formatted bullet lists and scope details."
              />
            </div>

            {/* Local Device Logo Upload */}
            <div className="space-y-1.5">
              <FileUpload
                label="Partner Logo Brand Asset"
                value={formData.logo_url}
                onChange={(url) => {
                  setFormData((prev) => ({ ...prev, logo_url: url }))
                }}
                accept="image/*,.svg"
                type="logo"
                description="Upload SVG or transparent PNG logo from your device."
                maxSizeMb={5}
              />
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Controls & Preview */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-5">
            <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider">Display & Placement</h2>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f1d14]">Show on Homepage</label>
              <select
                value={formData.show_on_home ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, show_on_home: e.target.value === 'true' })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs font-semibold focus:ring-2 focus:ring-[#175432] focus:outline-none bg-white"
              >
                <option value="true">Yes, show in home logo ticker</option>
                <option value="false">No, partners page only</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f1d14]">Display Order</label>
              <input
                type="number"
                min="1"
                value={formData.order_index}
                onChange={(e) => {
                  setFormData({ ...formData, order_index: Number(e.target.value) })
                  if (errors.order_index) setErrors((prev) => ({ ...prev, order_index: '' }))
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none bg-white font-mono ${
                  errors.order_index ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                }`}
              />
              {errors.order_index && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.order_index}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0f1d14]">Visibility</label>
              <select
                value={formData.is_visible ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, is_visible: e.target.value === 'true' })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs font-semibold focus:ring-2 focus:ring-[#175432] focus:outline-none bg-white"
              >
                <option value="true">Published</option>
                <option value="false">Hidden / Inactive</option>
              </select>
            </div>
          </div>

          {/* Live Partner Card Preview */}
          <div className="bg-gradient-to-br from-[#f6f9f6] to-[#edf4ee] p-6 rounded-3xl border border-[#d6e5d8] space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#175432] uppercase tracking-wider">
              <span>Card Preview</span>
              <span className="px-2 py-0.5 bg-white rounded text-[10px] font-bold text-[#175432]">
                {formData.show_on_home ? 'Home Featured' : 'Standard'}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e2ebe4] shadow-xs space-y-3">
              <div className="w-16 h-16 p-2 bg-[#f6f9f6] rounded-xl border border-[#e2ebe4] flex items-center justify-center">
                {formData.logo_url ? (
                  <img
                    src={formData.logo_url}
                    alt={formData.name || 'Partner logo'}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/photos/logo.png'
                    }}
                  />
                ) : (
                  <Handshake size={24} className="text-[#175432]" />
                )}
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#175432] block">
                  {formData.type}
                </span>
                <h4 className="text-xs font-bold text-[#0f1d14] mt-0.5">
                  {formData.name || 'Organization Name'}
                </h4>
              </div>

              {formData.description && (
                <p className="text-[11px] text-[#5c6f62] line-clamp-3 leading-relaxed">
                  {formData.description}
                </p>
              )}

              <div className="pt-2 border-t border-[#e2ebe4] flex items-center justify-between text-[10px] text-[#5c6f62]">
                {formData.website_url ? (
                  <span className="text-[#175432] font-semibold truncate max-w-[180px]">
                    {formData.website_url.replace(/^https?:\/\//, '')}
                  </span>
                ) : (
                  <span>No URL provided</span>
                )}
                <span>{formData.is_visible ? 'Published' : 'Hidden'}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
