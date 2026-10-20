'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Save,
  ArrowLeft,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Target,
  History,
  Shield,
  Layers,
} from 'lucide-react'
import FileUpload from '@/components/admin/FileUpload'
import type { AboutPageContent } from '@/types/pageContent'

interface AboutSectionEditorProps {
  initialContent: AboutPageContent
}

export default function AboutSectionEditor({ initialContent }: AboutSectionEditorProps) {
  const [content, setContent] = useState<AboutPageContent>(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'header' | 'vision_mission' | 'history' | 'objectives' | 'governance'>('header')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const updateContent = (updater: (prev: AboutPageContent) => AboutPageContent) => {
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
        body: JSON.stringify({ slug: 'about', content }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save about page content.')
      }

      setMessage({ type: 'success', text: 'About page content successfully saved and published! Public cache revalidated.' })
      setHasUnsavedChanges(false)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error saving changes. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  // --- Paragraph Helpers ---
  const handleAddParagraph = () => {
    updateContent((prev) => ({
      ...prev,
      history: {
        ...prev.history,
        paragraphs: [...prev.history.paragraphs, 'Enter historical details here...'],
      },
    }))
  }

  const handleRemoveParagraph = (idx: number) => {
    if (content.history.paragraphs.length <= 1) {
      alert('You must have at least one narrative paragraph.')
      return
    }
    updateContent((prev) => ({
      ...prev,
      history: {
        ...prev.history,
        paragraphs: prev.history.paragraphs.filter((_, i) => i !== idx),
      },
    }))
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/pages"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5c6f62] hover:text-[#175432] mb-2 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Pages</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f1d14] tracking-tight">
            About ACF Content Editor
          </h1>
          <p className="text-sm text-[#5c6f62] mt-0.5">
            Modify institutional mandate, vision, mission, background narrative, and strategic pillars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm font-bold text-[#0f1d14] hover:bg-[#f6f9f6] transition-colors flex items-center gap-2 shadow-2xs"
          >
            <span>Preview Live</span>
            <ExternalLink size={14} />
          </a>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-md bg-[#175432] hover:bg-[#114227] text-white text-sm font-bold transition-all shadow-md shadow-[#175432]/15 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Floating Sticky Alert if Unsaved */}
      {hasUnsavedChanges && (
        <div className="sticky top-4 z-30 bg-amber-50 border border-amber-300 text-amber-900 px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-sm font-bold">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>You have unsaved changes on the About Page. Click &quot;Save &amp; Publish&quot; to apply them.</span>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold transition-colors shrink-0"
          >
            Save Now
          </button>
        </div>
      )}

      {/* Status Notifications */}
      {message && (
        <div
          className={`p-4 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
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

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#e2ebe4]">
        {[
          { id: 'header', label: 'Header Banner', icon: Layers },
          { id: 'vision_mission', label: 'Vision & Mission', icon: Eye },
          { id: 'history', label: 'Background & Photo', icon: History },
          { id: 'objectives', label: 'Strategic Objectives', icon: Target },
          { id: 'governance', label: 'Governance CTA', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#175432] text-white shadow-sm'
                  : 'bg-white text-[#5c6f62] hover:text-[#0f1d14] border border-[#e2ebe4] hover:border-[#175432]/30'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* =====================================================================
          TAB 1: HEADER BANNER
      ===================================================================== */}
      {activeTab === 'header' && (
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#0f1d14]">About Page Header Banner</h2>
            <p className="text-sm text-[#5c6f62] mt-0.5">
              The dark green top hero banner on `/about`.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                Badge Pill
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
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
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
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm font-bold bg-[#fdfdfd]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              Subtitle Description
            </label>
            <textarea
              rows={3}
              value={content.header.description}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  header: { ...prev.header, description: val },
                }))
              }}
              className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm leading-relaxed bg-[#fdfdfd]"
            />
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: VISION & MISSION
      ===================================================================== */}
      {activeTab === 'vision_mission' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vision */}
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#f0f6f1] text-[#175432] flex items-center justify-center">
                <Eye size={18} />
              </div>
              <h2 className="text-base font-bold text-[#0f1d14]">Vision Statement</h2>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={content.vision.title}
                onChange={(e) => {
                  const val = e.target.value
                  updateContent((prev) => ({
                    ...prev,
                    vision: { ...prev.vision, title: val },
                  }))
                }}
                className="w-full px-4 py-2 rounded-md border border-[#e2ebe4] text-sm font-bold bg-[#fdfdfd]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                Vision Narrative
              </label>
              <textarea
                rows={5}
                value={content.vision.description}
                onChange={(e) => {
                  const val = e.target.value
                  updateContent((prev) => ({
                    ...prev,
                    vision: { ...prev.vision, description: val },
                  }))
                }}
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm leading-relaxed bg-[#fdfdfd]"
              />
            </div>
          </div>

          {/* Mission */}
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#f0f6f1] text-[#175432] flex items-center justify-center">
                <Target size={18} />
              </div>
              <h2 className="text-base font-bold text-[#0f1d14]">Mission Statement</h2>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={content.mission.title}
                onChange={(e) => {
                  const val = e.target.value
                  updateContent((prev) => ({
                    ...prev,
                    mission: { ...prev.mission, title: val },
                  }))
                }}
                className="w-full px-4 py-2 rounded-md border border-[#e2ebe4] text-sm font-bold bg-[#fdfdfd]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                Mission Narrative
              </label>
              <textarea
                rows={5}
                value={content.mission.description}
                onChange={(e) => {
                  const val = e.target.value
                  updateContent((prev) => ({
                    ...prev,
                    mission: { ...prev.mission, description: val },
                  }))
                }}
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm leading-relaxed bg-[#fdfdfd]"
              />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: BACKGROUND & HISTORY (WITH PHOTO)
      ===================================================================== */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0f1d14]">Background, History &amp; Featured Photo</h2>
              <p className="text-sm text-[#5c6f62] mt-0.5">
                The institutional genesis story of ACF and the featured photographic showcase.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Photo Upload (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <FileUpload
                  label="Featured Historical / Dialogue Photo"
                  value={content.history.image_url}
                  onChange={(url) => {
                    updateContent((prev) => ({
                      ...prev,
                      history: { ...prev.history, image_url: url },
                    }))
                  }}
                  description="Supported formats: JPEG, PNG, WebP. Recommended: 16:9 ratio."
                  type="image"
                  required
                />

                <div>
                  <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1">
                    Photo Overlay Badge
                  </label>
                  <input
                    type="text"
                    value={content.history.banner_badge}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => ({
                        ...prev,
                        history: { ...prev.history, banner_badge: val },
                      }))
                    }}
                    placeholder="e.g. National Policy Dialogue • Lusaka"
                    className="w-full px-3 py-2 rounded-md border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f1d14] uppercase tracking-wider mb-1">
                    Photo Overlay Caption
                  </label>
                  <textarea
                    rows={2}
                    value={content.history.banner_text}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => ({
                        ...prev,
                        history: { ...prev.history, banner_text: val },
                      }))
                    }}
                    placeholder="Caption describing the photo..."
                    className="w-full px-3 py-2 rounded-md border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
                  />
                </div>
              </div>

              {/* Narrative Paragraphs (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider">
                      Narrative Paragraphs
                    </label>
                    <span className="text-xs text-[#5c6f62]">
                      Each paragraph is rendered in clean typography that protects CSS margins and line heights.
                    </span>
                  </div>
                  <button
                    onClick={handleAddParagraph}
                    className="px-3 py-1.5 rounded-lg bg-[#f0f6f1] text-[#175432] text-sm font-bold flex items-center gap-1 border border-[#e2ebe4]"
                  >
                    <Plus size={12} />
                    <span>Add Paragraph</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {content.history.paragraphs.map((para, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-[#f6f9f6] border border-[#e2ebe4] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#5c6f62]">
                          Paragraph #{idx + 1}
                        </span>
                        <button
                          onClick={() => handleRemoveParagraph(idx)}
                          className="p-1 rounded text-red-500 hover:bg-red-50"
                          title="Delete Paragraph"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        value={para}
                        onChange={(e) => {
                          const val = e.target.value
                          updateContent((prev) => {
                            const updated = [...prev.history.paragraphs]
                            updated[idx] = val
                            return {
                              ...prev,
                              history: { ...prev.history, paragraphs: updated },
                            }
                          })
                        }}
                        className="w-full px-3 py-2 rounded-md border border-[#e2ebe4] text-sm leading-relaxed bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: KEY STRATEGIC OBJECTIVES
      ===================================================================== */}
      {activeTab === 'objectives' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0f1d14]">Strategic Objectives (4 Key Pillars)</h2>
              <p className="text-sm text-[#5c6f62] mt-0.5">
                The 4 operational pillars displayed in the 2x2 grid on `/about`.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                  Section Title
                </label>
                <input
                  type="text"
                  value={content.objectives.title}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      objectives: { ...prev.objectives, title: val },
                    }))
                  }}
                  className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm font-bold bg-[#fdfdfd]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={content.objectives.description}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      objectives: { ...prev.objectives, description: val },
                    }))
                  }}
                  className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {content.objectives.items.map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-[#f6f9f6] border border-[#e2ebe4] space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-md bg-[#0f1d14] text-[#a3e635] text-sm font-black flex items-center justify-center shrink-0">
                      {item.num}
                    </span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const val = e.target.value
                        updateContent((prev) => {
                          const updated = [...prev.objectives.items]
                          updated[idx] = { ...updated[idx], title: val }
                          return {
                            ...prev,
                            objectives: { ...prev.objectives, items: updated },
                          }
                        })
                      }}
                      placeholder="Pillar Title"
                      className="flex-1 px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm font-bold bg-white"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => {
                        const updated = [...prev.objectives.items]
                        updated[idx] = { ...updated[idx], description: val }
                        return {
                          ...prev,
                          objectives: { ...prev.objectives, items: updated },
                        }
                      })
                    }}
                    placeholder="Pillar Description"
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm leading-relaxed bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: GOVERNANCE CTA STRIP
      ===================================================================== */}
      {activeTab === 'governance' && (
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#0f1d14]">Governance Navigation Strip</h2>
            <p className="text-sm text-[#5c6f62] mt-0.5">
              The bottom navigation bar guiding visitors to the Board of Directors, Management, and Staff.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              Headline
            </label>
            <input
              type="text"
              value={content.governance_cta.title}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  governance_cta: { ...prev.governance_cta, title: val },
                }))
              }}
              className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm font-bold bg-[#fdfdfd]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
              Subtitle Description
            </label>
            <input
              type="text"
              value={content.governance_cta.description}
              onChange={(e) => {
                const val = e.target.value
                updateContent((prev) => ({
                  ...prev,
                  governance_cta: { ...prev.governance_cta, description: val },
                }))
              }}
              className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
            />
          </div>
        </div>
      )}
    </div>
  )
}
