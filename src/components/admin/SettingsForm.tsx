'use client'

import { useState } from 'react'
import { Save, CheckCircle2, AlertCircle } from 'lucide-react'
import type { SiteSettings } from '@/lib/supabase/settings'

interface SettingsFormProps {
  initialSettings: SiteSettings
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [formData, setFormData] = useState<SiteSettings>(initialSettings)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('saving')
    setMessage('')

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (res.ok) {
        setStatus('saved')
        setMessage('Site settings and logo URL saved successfully!')
        setTimeout(() => setStatus('idle'), 4000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to save settings.')
      }
    } catch {
      setStatus('error')
      setMessage('A network error occurred while updating settings.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {status === 'saved' && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#175432] text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* Brand Identity & Logo */}
      <div className="bg-white rounded-3xl border border-[#e2ebe4] p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-[#0f1d14] border-b border-[#e2ebe4] pb-3">
          Brand Identity & Logo Configuration
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-bold text-[#0f1d14]">Website Logo Path or URL</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-2.5 bg-[#f6f9f6] rounded-2xl border border-[#e2ebe4] shrink-0">
                <img
                  src={formData.logo_url || '/photos/logo.png'}
                  alt="Logo preview"
                  className="h-12 w-auto max-w-[200px] object-contain"
                  onError={(e) => {
                    // Fallback to placeholder if broken link entered
                    ;(e.target as HTMLImageElement).src = '/photos/logo.png'
                  }}
                />
              </div>
              <div className="flex-grow w-full space-y-1">
                <input
                  type="text"
                  value={formData.logo_url || ''}
                  onChange={(e) => handleChange('logo_url', e.target.value)}
                  placeholder="/photos/logo.png or Supabase storage URL"
                  className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
                />
                <p className="text-[11px] text-[#5c6f62]">
                  Currently using <code>{formData.logo_url || '/photos/logo.png'}</code>. You can enter any relative path in <code>/photos/</code> or a custom URL from Supabase Storage.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-bold text-[#0f1d14]">Organization Name</label>
            <input
              type="text"
              value={formData.site_name}
              onChange={(e) => handleChange('site_name', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-bold text-[#0f1d14]">Institutional Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Secretariat Contact Details */}
      <div className="bg-white rounded-3xl border border-[#e2ebe4] p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-[#0f1d14] border-b border-[#e2ebe4] pb-3">
          Secretariat General Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-[#0f1d14]">Official Contact Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#0f1d14]">Telephone Hotline</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-bold text-[#0f1d14]">Physical Office Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-bold text-[#0f1d14]">Working Hours</label>
            <input
              type="text"
              value={formData.office_hours}
              onChange={(e) => handleChange('office_hours', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>
        </div>

        <h2 className="text-lg font-bold text-[#0f1d14] border-b border-[#e2ebe4] pb-3 pt-4">
          Social Media Links
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-[#0f1d14]">Facebook URL</label>
            <input
              type="url"
              value={formData.facebook_url || ''}
              onChange={(e) => handleChange('facebook_url', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#0f1d14]">Twitter (X) URL</label>
            <input
              type="url"
              value={formData.twitter_url || ''}
              onChange={(e) => handleChange('twitter_url', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-bold text-[#0f1d14]">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedin_url || ''}
              onChange={(e) => handleChange('linkedin_url', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-[#e2ebe4] flex justify-end">
          <button
            type="submit"
            disabled={status === 'saving'}
            className="px-6 py-3 bg-[#175432] hover:bg-[#114227] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save size={15} />
            <span>{status === 'saving' ? 'Saving Changes...' : 'Save Settings Changes'}</span>
          </button>
        </div>
      </div>
    </form>
  )
}
