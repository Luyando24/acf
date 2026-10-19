'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Save,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Share2,
  Layers,
} from 'lucide-react'
import { ContactPageContent } from '@/lib/supabase/pageContent'

interface ContactSectionEditorProps {
  initialContent: ContactPageContent
}

export default function ContactSectionEditor({ initialContent }: ContactSectionEditorProps) {
  const [content, setContent] = useState<ContactPageContent>(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const updateContent = (updater: (prev: ContactPageContent) => ContactPageContent) => {
    setContent((prev) => {
      const next = updater(prev)
      setHasUnsavedChanges(true)
      return next
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/content/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'contact', content }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save contact page content.')
      }

      setMessage({ type: 'success', text: 'Contact page content successfully saved and published! Public cache revalidated.' })
      setHasUnsavedChanges(false)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error saving changes. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/pages"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5c6f62] hover:text-[#175432] mb-2 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Pages</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f1d14] tracking-tight">
            Contact &amp; Secretariat Content Editor
          </h1>
          <p className="text-xs text-[#5c6f62] mt-0.5">
            Modify office locations, official hotlines, support emails, business hours, and social media links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs font-bold text-[#0f1d14] hover:bg-[#f6f9f6] transition-colors flex items-center gap-2 shadow-2xs"
          >
            <span>Preview Live</span>
            <ExternalLink size={14} />
          </a>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#175432] hover:bg-[#114227] text-white text-xs font-bold transition-all shadow-md shadow-[#175432]/15 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Floating Sticky Alert if Unsaved */}
      {hasUnsavedChanges && (
        <div className="sticky top-4 z-30 bg-amber-50 border border-amber-300 text-amber-900 px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>You have unsaved changes on the Contact Page. Click &quot;Save &amp; Publish&quot; to apply them.</span>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shrink-0"
          >
            Save Now
          </button>
        </div>
      )}

      {/* Status Notifications */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
            message.type === 'success'
              ? 'bg-[#f0f6f1] text-[#175432] border border-[#2da44e]/30'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 size={18} className="text-[#2da44e] shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Section 1: Top Hero Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f0f6f1] text-[#175432] flex items-center justify-center">
            <Layers size={18} />
          </div>
          <h2 className="text-base font-bold text-[#0f1d14]">1. Page Header Banner</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              Badge
            </label>
            <input
              type="text"
              value={content.header.badge}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  header: { ...prev.header, badge: val },
                }))
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs bg-[#fdfdfd]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              Page Title (H1)
            </label>
            <input
              type="text"
              value={content.header.title}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  header: { ...prev.header, title: val },
                }))
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs font-bold bg-[#fdfdfd]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
            Subtitle Description
          </label>
          <textarea
            rows={2}
            value={content.header.description}
            onChange={(e) => {
              const val = e.target.value
              updateContent((prev) => ({
                ...prev,
                header: { ...prev.header, description: val },
              }))
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs leading-relaxed bg-[#fdfdfd]"
          />
        </div>
      </div>

      {/* Section 2: Secretariat Office Details */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f0f6f1] text-[#175432] flex items-center justify-center">
            <MapPin size={18} />
          </div>
          <h2 className="text-base font-bold text-[#0f1d14]">2. Secretariat Office Details</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              Section Title
            </label>
            <input
              type="text"
              value={content.details.title}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  details: { ...prev.details, title: val },
                }))
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs font-bold bg-[#fdfdfd]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              Section Subtitle
            </label>
            <input
              type="text"
              value={content.details.subtitle}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  details: { ...prev.details, subtitle: val },
                }))
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs bg-[#fdfdfd]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              Physical Address
            </label>
            <input
              type="text"
              value={content.details.address}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  details: { ...prev.details, address: val },
                }))
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs bg-[#fdfdfd]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              Primary Phone / Hotline
            </label>
            <input
              type="text"
              value={content.details.phone}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  details: { ...prev.details, phone: val },
                }))
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs bg-[#fdfdfd]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              Official Email
            </label>
            <input
              type="email"
              value={content.details.email}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  details: { ...prev.details, email: val },
                }))
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs bg-[#fdfdfd]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              Working Hours
            </label>
            <input
              type="text"
              value={content.details.working_hours}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  details: { ...prev.details, working_hours: val },
                }))
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs bg-[#fdfdfd]"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Social Media Channels */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f0f6f1] text-[#175432] flex items-center justify-center">
            <Share2 size={18} />
          </div>
          <h2 className="text-base font-bold text-[#0f1d14]">3. Social Media URLs</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              Facebook URL
            </label>
            <input
              type="text"
              value={content.social_links.facebook_url}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  social_links: { ...prev.social_links, facebook_url: val },
                }))
              }}
              placeholder="https://facebook.com/..."
              className="w-full px-4 py-2 rounded-xl border border-[#e2ebe4] text-xs bg-[#fdfdfd]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              Twitter / X URL
            </label>
            <input
              type="text"
              value={content.social_links.twitter_url}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  social_links: { ...prev.social_links, twitter_url: val },
                }))
              }}
              placeholder="https://twitter.com/..."
              className="w-full px-4 py-2 rounded-xl border border-[#e2ebe4] text-xs bg-[#fdfdfd]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              LinkedIn URL
            </label>
            <input
              type="text"
              value={content.social_links.linkedin_url}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  social_links: { ...prev.social_links, linkedin_url: val },
                }))
              }}
              placeholder="https://linkedin.com/..."
              className="w-full px-4 py-2 rounded-xl border border-[#e2ebe4] text-xs bg-[#fdfdfd]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
