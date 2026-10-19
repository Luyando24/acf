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
  ShieldCheck,
  Plus,
  Trash2,
  Layers,
} from 'lucide-react'
import type { MembershipPageContent } from '@/types/pageContent'

interface MembershipSectionEditorProps {
  initialContent: MembershipPageContent
}

export default function MembershipSectionEditor({ initialContent }: MembershipSectionEditorProps) {
  const [content, setContent] = useState<MembershipPageContent>(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const updateContent = (updater: (prev: MembershipPageContent) => MembershipPageContent) => {
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
        body: JSON.stringify({ slug: 'membership', content }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save membership page content.')
      }

      setMessage({ type: 'success', text: 'Membership page content successfully saved and published! Public cache revalidated.' })
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
            Membership &amp; Partnerships Content Editor
          </h1>
          <p className="text-xs text-[#5c6f62] mt-0.5">
            Modify membership benefits, stakeholder value proposition, and onboarding directives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/membership"
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
            <span>You have unsaved changes on the Membership Page. Click &quot;Save &amp; Publish&quot; to apply them.</span>
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

      {/* Header Banner */}
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

      {/* Why Join & Benefits */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f0f6f1] text-[#175432] flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <h2 className="text-base font-bold text-[#0f1d14]">2. Why Join the Forum (Value Proposition)</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              Section Title
            </label>
            <input
              type="text"
              value={content.why_join.title}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  why_join: { ...prev.why_join, title: val },
                }))
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs font-bold bg-[#fdfdfd]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              Narrative Description
            </label>
            <textarea
              rows={3}
              value={content.why_join.description}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  why_join: { ...prev.why_join, description: val },
                }))
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs leading-relaxed bg-[#fdfdfd]"
            />
          </div>

          <div className="space-y-4 pt-2">
            <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider">
              Membership Benefits
            </label>

            {content.why_join.benefits.map((benefit, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#f6f9f6] border border-[#e2ebe4] space-y-2">
                <input
                  type="text"
                  value={benefit.title}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => {
                      const updated = [...prev.why_join.benefits]
                      updated[idx] = { ...updated[idx], title: val }
                      return {
                        ...prev,
                        why_join: { ...prev.why_join, benefits: updated },
                      }
                    })
                  }}
                  placeholder="Benefit Title"
                  className="w-full px-3 py-1.5 rounded-lg border border-[#e2ebe4] text-xs font-bold bg-white"
                />
                <textarea
                  rows={2}
                  value={benefit.description}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => {
                      const updated = [...prev.why_join.benefits]
                      updated[idx] = { ...updated[idx], description: val }
                      return {
                        ...prev,
                        why_join: { ...prev.why_join, benefits: updated },
                      }
                    })
                  }}
                  placeholder="Benefit Description"
                  className="w-full px-3 py-1.5 rounded-lg border border-[#e2ebe4] text-xs bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-[#0f1d14]">3. Call to Action &amp; Enquiries</h2>
          <p className="text-xs text-[#5c6f62] mt-0.5">
            Instructions encouraging visitors to apply or contact the membership desk.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              CTA Title
            </label>
            <input
              type="text"
              value={content.cta.title}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  cta: { ...prev.cta, title: val },
                }))
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs font-bold bg-[#fdfdfd]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              Contact Desk Email
            </label>
            <input
              type="email"
              value={content.cta.contact_email}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  cta: { ...prev.cta, contact_email: val },
                }))
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs bg-[#fdfdfd]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
            CTA Description
          </label>
          <textarea
            rows={2}
            value={content.cta.description}
            onChange={(e) => {
              const val = e.target.value
              updateContent((prev) => ({
                ...prev,
                cta: { ...prev.cta, description: val },
              }))
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-[#e2ebe4] text-xs bg-[#fdfdfd]"
          />
        </div>
      </div>
    </div>
  )
}
