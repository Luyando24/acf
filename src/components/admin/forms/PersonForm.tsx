'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Users,
  Mail,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react'
import { LinkedinIcon } from '@/components/ui/SocialIcons'
import { PersonItem } from '@/components/admin/PeopleManager'
import FileUpload from '@/components/admin/FileUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'

interface PersonFormProps {
  initialData?: PersonItem | null
}

export default function PersonForm({ initialData }: PersonFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initialData)

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    position: initialData?.position || '',
    group_type: (initialData?.group_type || 'staff') as 'board' | 'management' | 'staff',
    bio: initialData?.bio || '',
    photo_url: initialData?.photo_url || '/people/placeholder.jpg',
    order_index: initialData?.order_index ?? 1,
    email: initialData?.email || '',
    linkedin_url: initialData?.linkedin_url || '',
    is_visible: initialData?.is_visible ?? true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      errs.name = 'Full name is required and must be at least 3 characters.'
    }
    if (!formData.position.trim() || formData.position.trim().length < 3) {
      errs.position = 'Position / role title is required.'
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid official email address.'
    }
    if (formData.linkedin_url.trim() && !/^https?:\/\//i.test(formData.linkedin_url.trim())) {
      errs.linkedin_url = 'LinkedIn URL must begin with http:// or https://'
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

    const payload = {
      id: initialData?.id || crypto.randomUUID(),
      name: formData.name.trim(),
      position: formData.position.trim(),
      group_type: formData.group_type,
      bio: formData.bio.trim() || null,
      photo_url: formData.photo_url.trim() || null,
      order_index: Number(formData.order_index) || 1,
      email: formData.email.trim() || null,
      linkedin_url: formData.linkedin_url.trim() || null,
      is_visible: formData.is_visible,
    }

    try {
      const res = await fetch('/api/admin/crud/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save personnel profile.')
      }

      setNotification({
        type: 'success',
        message: isEdit ? 'Profile updated successfully.' : 'New personnel profile published.',
      })
      setTimeout(() => {
        router.push('/admin/people')
        router.refresh()
      }, 800)
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error saving profile.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/people"
            className="p-2 text-[#5c6f62] hover:text-[#0f1d14] hover:bg-[#f6f9f6] rounded-md transition-colors"
            title="Back to Personnel"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#5c6f62]">
              <Link href="/admin/people" className="hover:underline">
                Board & Staff
              </Link>
              <span>/</span>
              <span className="text-[#175432]">{isEdit ? 'Edit Profile' : 'New Personnel Profile'}</span>
            </div>
            <h1 className="text-xl font-black text-[#0f1d14] mt-0.5">
              {isEdit ? `Edit: ${initialData?.name}` : 'Add Personnel Profile'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/people"
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
            <span>{isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Profile'}</span>
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
              <UserCheck size={16} className="text-[#175432]" />
              Personnel Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#0f1d14]">Full Name & Honorific *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
                  }}
                  placeholder="e.g. Dr. Mweemba Chibanda"
                  className={`w-full px-4 py-2.5 rounded-md border text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                    errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#0f1d14]">Position / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => {
                    setFormData({ ...formData, position: e.target.value })
                    if (errors.position) setErrors((prev) => ({ ...prev, position: '' }))
                  }}
                  placeholder="e.g. Senior Agricultural Policy Analyst"
                  className={`w-full px-4 py-2.5 rounded-md border text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                    errors.position ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                  }`}
                />
                {errors.position && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.position}
                  </p>
                )}
              </div>
            </div>

            {/* Rich Text Editor for Bio */}
            <div className="space-y-1.5">
              <RichTextEditor
                label="Professional Biography & Academic Qualifications"
                value={formData.bio}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, bio: val }))
                }}
                placeholder="Summary of experience, technical expertise in agricultural policy, academic credentials, and institutional advisory boards..."
                rows={6}
                description="Supports formatted bullet lists, emphasis, and credentials."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#0f1d14]">Official Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-3 text-[#5c6f62]" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
                    }}
                    placeholder="name@acf.org.zm"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-md border text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                      errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#0f1d14]">LinkedIn Profile URL</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-[#5c6f62]">
                    <LinkedinIcon size={15} />
                  </span>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => {
                      setFormData({ ...formData, linkedin_url: e.target.value })
                      if (errors.linkedin_url) setErrors((prev) => ({ ...prev, linkedin_url: '' }))
                    }}
                    placeholder="https://linkedin.com/in/username"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-md border text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none transition-all ${
                      errors.linkedin_url ? 'border-rose-400 bg-rose-50/20' : 'border-[#e2ebe4]'
                    }`}
                  />
                </div>
                {errors.linkedin_url && (
                  <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.linkedin_url}
                  </p>
                )}
              </div>
            </div>

            {/* Local Device Photo Upload */}
            <div className="space-y-1.5">
              <FileUpload
                label="Portrait Photography / Avatar"
                value={formData.photo_url}
                onChange={(url) => {
                  setFormData((prev) => ({ ...prev, photo_url: url }))
                }}
                accept="image/*"
                type="avatar"
                description="Upload square or portrait photo from device (PNG, JPG, WebP)."
                maxSizeMb={10}
              />
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Controls & Live Profile Preview */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs space-y-5">
            <h2 className="text-sm font-black text-[#0f1d14] uppercase tracking-wider">Classification & Order</h2>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14]">Governance Category *</label>
              <select
                value={formData.group_type}
                onChange={(e) => setFormData({ ...formData, group_type: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm font-semibold focus:ring-2 focus:ring-[#175432] focus:outline-none bg-white"
              >
                <option value="board">Board of Directors / Trustees</option>
                <option value="management">Management Team</option>
                <option value="staff">Secretariat Technical Staff</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14]">Display Order</label>
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
              <p className="text-xs text-[#5c6f62]">Determines visual order within its category.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0f1d14]">Public Visibility</label>
              <select
                value={formData.is_visible ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, is_visible: e.target.value === 'true' })}
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm font-semibold focus:ring-2 focus:ring-[#175432] focus:outline-none bg-white"
              >
                <option value="true">Visible on Website</option>
                <option value="false">Hidden / Draft</option>
              </select>
            </div>
          </div>

          {/* Profile Card Preview */}
          <div className="bg-gradient-to-br from-[#f6f9f6] to-[#edf4ee] p-6 rounded-lg border border-[#d6e5d8] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#175432] uppercase tracking-wider">
              <span>Public Card Preview</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                formData.group_type === 'board'
                  ? 'bg-purple-100 text-purple-800'
                  : formData.group_type === 'management'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {formData.group_type}
              </span>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#e2ebe4] shadow-xs text-center space-y-3">
              <img
                src={formData.photo_url || '/people/placeholder.jpg'}
                alt={formData.name || 'Avatar'}
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#175432]/20 shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/photos/logo.png'
                }}
              />
              <div>
                <h4 className="text-sm font-black text-[#0f1d14]">
                  {formData.name || 'Full Name'}
                </h4>
                <p className="text-sm text-[#175432] font-semibold mt-0.5">
                  {formData.position || 'Position / Designation'}
                </p>
              </div>

              {formData.bio && (
                <p className="text-xs text-[#5c6f62] line-clamp-3 leading-relaxed text-left border-t border-[#e2ebe4] pt-2">
                  {formData.bio}
                </p>
              )}

              <div className="flex items-center justify-center gap-3 pt-2 text-[#5c6f62]">
                {formData.email && (
                  <span className="p-1.5 bg-[#f6f9f6] rounded-lg text-[#175432]" title={formData.email}>
                    <Mail size={14} />
                  </span>
                )}
                {formData.linkedin_url && (
                  <span className="p-1.5 bg-[#f6f9f6] rounded-lg text-[#175432]" title="LinkedIn">
                    <LinkedinIcon size={14} />
                  </span>
                )}
                <span className="text-[11px] text-[#5c6f62] flex items-center gap-1">
                  {formData.is_visible ? <Eye size={12} className="text-emerald-600" /> : <EyeOff size={12} className="text-gray-400" />}
                  {formData.is_visible ? 'Public' : 'Hidden'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
