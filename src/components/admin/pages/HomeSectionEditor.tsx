'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Save,
  ArrowLeft,
  ExternalLink,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Layers,
  Image as ImageIcon,
  BarChart3,
  FileText,
  Target,
  Megaphone,
} from 'lucide-react'
import FileUpload from '@/components/admin/FileUpload'
import type { HomePageContent, HeroSlideItem, StatItem, StrategicObjectiveItem } from '@/types/pageContent'

interface HomeSectionEditorProps {
  initialContent: HomePageContent
}

export default function HomeSectionEditor({ initialContent }: HomeSectionEditorProps) {
  const [content, setContent] = useState<HomePageContent>(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'about' | 'objectives' | 'sections' | 'cta'>('hero')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const updateContent = (updater: (prev: HomePageContent) => HomePageContent) => {
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
        body: JSON.stringify({ slug: 'home', content }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save home page content.')
      }

      setMessage({ type: 'success', text: 'Home page content successfully saved and published! Public cache revalidated.' })
      setHasUnsavedChanges(false)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error saving changes. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  // --- Hero Slides Helpers ---
  const handleAddSlide = () => {
    updateContent((prev) => ({
      ...prev,
      hero_slides: [
        ...prev.hero_slides,
        {
          image_url: '/photos/fosta-stakeholders-dialogue.jpg',
          caption: 'National Stakeholder Consultation',
          alt_text: 'Stakeholder Dialogue in Lusaka',
        },
      ],
    }))
  }

  const handleRemoveSlide = (idx: number) => {
    if (content.hero_slides.length <= 1) {
      alert('You must have at least one hero slide.')
      return
    }
    updateContent((prev) => ({
      ...prev,
      hero_slides: prev.hero_slides.filter((_, i) => i !== idx),
    }))
  }

  const handleMoveSlide = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= content.hero_slides.length) return

    updateContent((prev) => {
      const updated = [...prev.hero_slides]
      const temp = updated[idx]
      updated[idx] = updated[targetIdx]
      updated[targetIdx] = temp
      return { ...prev, hero_slides: updated }
    })
  }

  // --- Stats Helpers ---
  const handleAddStat = () => {
    updateContent((prev) => ({
      ...prev,
      stats: [...prev.stats, { label: 'New Metric', value: '100+', order: prev.stats.length + 1 }],
    }))
  }

  const handleRemoveStat = (idx: number) => {
    if (content.stats.length <= 1) {
      alert('You must have at least one impact stat.')
      return
    }
    updateContent((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== idx),
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
            Home Page Content Editor
          </h1>
          <p className="text-sm text-[#5c6f62] mt-0.5">
            Modify hero banners, impact statistics, about snippet, strategic objectives, and section titles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
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
            <span>You have unsaved changes on the Home Page. Click &quot;Save &amp; Publish&quot; to apply them.</span>
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
          { id: 'hero', label: 'Hero Carousel', icon: ImageIcon },
          { id: 'stats', label: 'Impact Statistics', icon: BarChart3 },
          { id: 'about', label: 'About ACF Snippet', icon: FileText },
          { id: 'objectives', label: 'Strategic Objectives', icon: Target },
          { id: 'sections', label: 'Section Headings', icon: Layers },
          { id: 'cta', label: 'Membership CTA', icon: Megaphone },
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
          TAB 1: HERO SLIDES
      ===================================================================== */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0f1d14]">Hero Photo Carousel Slides</h2>
              <p className="text-sm text-[#5c6f62] mt-0.5">
                Upload photos directly from your device or specify URLs. These appear as the high-impact banner at the top of the home page.
              </p>
            </div>
            <button
              onClick={handleAddSlide}
              className="px-4 py-2 rounded-md bg-[#f0f6f1] hover:bg-[#e2ebe4] text-[#175432] text-sm font-bold transition-colors flex items-center gap-1.5 border border-[#e2ebe4]"
            >
              <Plus size={14} />
              <span>Add Slide</span>
            </button>
          </div>

          <div className="space-y-6">
            {content.hero_slides.map((slide, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs space-y-6 relative group"
              >
                <div className="flex items-center justify-between border-b border-[#e2ebe4] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#175432] text-white text-sm font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-[#0f1d14]">
                      Slide #{idx + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleMoveSlide(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg border border-[#e2ebe4] text-[#5c6f62] hover:text-[#0f1d14] disabled:opacity-30"
                      title="Move Up"
                    >
                      <MoveUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMoveSlide(idx, 'down')}
                      disabled={idx === content.hero_slides.length - 1}
                      className="p-1.5 rounded-lg border border-[#e2ebe4] text-[#5c6f62] hover:text-[#0f1d14] disabled:opacity-30"
                      title="Move Down"
                    >
                      <MoveDown size={14} />
                    </button>
                    <button
                      onClick={() => handleRemoveSlide(idx)}
                      className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                      title="Delete Slide"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Photo Upload (5 cols) */}
                  <div className="lg:col-span-5">
                    <FileUpload
                      label="Slide Photo"
                      value={slide.image_url}
                      onChange={(url) => {
                        updateContent((prev) => {
                          const updated = [...prev.hero_slides]
                          updated[idx] = { ...updated[idx], image_url: url }
                          return { ...prev, hero_slides: updated }
                        })
                      }}
                      description="Supported formats: JPEG, PNG, WebP. Recommended: 1920x800."
                      type="image"
                      required
                    />
                  </div>

                  {/* Metadata fields (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                        Slide Caption / Title
                      </label>
                      <input
                        type="text"
                        value={slide.caption || ''}
                        onChange={(e) => {
                          const val = e.target.value
                          updateContent((prev) => {
                            const updated = [...prev.hero_slides]
                            updated[idx] = { ...updated[idx], caption: val }
                            return { ...prev, hero_slides: updated }
                          })
                        }}
                        placeholder="e.g. FoSTA Health Stakeholders Policy Dialogue"
                        className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm focus:outline-none focus:border-[#175432] bg-[#fdfdfd]"
                      />
                      <span className="text-xs text-[#5c6f62] mt-1 block">
                        Displayed in the bottom overlay badge on the slide.
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                        Accessibility Alt Text
                      </label>
                      <input
                        type="text"
                        value={slide.alt_text}
                        onChange={(e) => {
                          const val = e.target.value
                          updateContent((prev) => {
                            const updated = [...prev.hero_slides]
                            updated[idx] = { ...updated[idx], alt_text: val }
                            return { ...prev, hero_slides: updated }
                          })
                        }}
                        placeholder="e.g. ACF convening stakeholders in Lusaka"
                        className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm focus:outline-none focus:border-[#175432] bg-[#fdfdfd]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: IMPACT STATS
      ===================================================================== */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0f1d14]">Key Impact Statistics Strip</h2>
              <p className="text-sm text-[#5c6f62] mt-0.5">
                These numbers display in the floating stats card directly underneath the hero carousel.
              </p>
            </div>
            <button
              onClick={handleAddStat}
              className="px-4 py-2 rounded-md bg-[#f0f6f1] hover:bg-[#e2ebe4] text-[#175432] text-sm font-bold transition-colors flex items-center gap-1.5 border border-[#e2ebe4]"
            >
              <Plus size={14} />
              <span>Add Stat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-lg border border-[#e2ebe4] shadow-xs space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5c6f62]">
                    Statistic #{idx + 1}
                  </span>
                  <button
                    onClick={() => handleRemoveStat(idx)}
                    className="p-1 rounded-lg text-red-500 hover:bg-red-50"
                    title="Delete Stat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0f1d14] mb-1">
                      Display Metric (Value)
                    </label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const val = e.target.value
                        updateContent((prev) => {
                          const updated = [...prev.stats]
                          updated[idx] = { ...updated[idx], value: val }
                          return { ...prev, stats: updated }
                        })
                      }}
                      placeholder="e.g. 120+, 50,000+, 95%"
                      className="w-full px-3 py-2 rounded-md border border-[#e2ebe4] text-base font-extrabold text-[#175432] focus:outline-none focus:border-[#175432] bg-[#fdfdfd]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f1d14] mb-1">
                      Description Label
                    </label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const val = e.target.value
                        updateContent((prev) => {
                          const updated = [...prev.stats]
                          updated[idx] = { ...updated[idx], label: val }
                          return { ...prev, stats: updated }
                        })
                      }}
                      placeholder="e.g. Policy Dialogues Held"
                      className="w-full px-3 py-2 rounded-md border border-[#e2ebe4] text-sm font-semibold text-[#3b4d41] focus:outline-none focus:border-[#175432] bg-[#fdfdfd]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: ABOUT ACF SNIPPET
      ===================================================================== */}
      {activeTab === 'about' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0f1d14]">&quot;About The Forum&quot; Showcase Section</h2>
              <p className="text-sm text-[#5c6f62] mt-0.5">
                Main introduction snippet on the home page highlighting ACF&apos;s credibility and mandate.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                  Section Pill Badge
                </label>
                <input
                  type="text"
                  value={content.about_snippet.badge}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      about_snippet: { ...prev.about_snippet, badge: val },
                    }))
                  }}
                  className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm focus:outline-none focus:border-[#175432] bg-[#fdfdfd]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={content.about_snippet.title}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      about_snippet: { ...prev.about_snippet, title: val },
                    }))
                  }}
                  className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm font-bold focus:outline-none focus:border-[#175432] bg-[#fdfdfd]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                Introductory Narrative Paragraph
              </label>
              <textarea
                rows={4}
                value={content.about_snippet.description}
                onChange={(e) => {
                  const val = e.target.value
                  updateContent((prev) => ({
                    ...prev,
                    about_snippet: { ...prev.about_snippet, description: val },
                  }))
                }}
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm leading-relaxed focus:outline-none focus:border-[#175432] bg-[#fdfdfd]"
              />
            </div>

            {/* 2 Feature Cards */}
            <div className="border-t border-[#e2ebe4] pt-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0f1d14]">
                Feature Highlight Cards (Side-by-side)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#f6f9f6] border border-[#e2ebe4] space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#175432]">Feature 1</span>
                  <input
                    type="text"
                    value={content.about_snippet.feature_1.title}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => ({
                        ...prev,
                        about_snippet: {
                          ...prev.about_snippet,
                          feature_1: { ...prev.about_snippet.feature_1, title: val },
                        },
                      }))
                    }}
                    placeholder="Title"
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm font-bold bg-white"
                  />
                  <textarea
                    rows={2}
                    value={content.about_snippet.feature_1.description}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => ({
                        ...prev,
                        about_snippet: {
                          ...prev.about_snippet,
                          feature_1: { ...prev.about_snippet.feature_1, description: val },
                        },
                      }))
                    }}
                    placeholder="Description"
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-white"
                  />
                </div>

                <div className="p-4 rounded-lg bg-[#f6f9f6] border border-[#e2ebe4] space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#175432]">Feature 2</span>
                  <input
                    type="text"
                    value={content.about_snippet.feature_2.title}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => ({
                        ...prev,
                        about_snippet: {
                          ...prev.about_snippet,
                          feature_2: { ...prev.about_snippet.feature_2, title: val },
                        },
                      }))
                    }}
                    placeholder="Title"
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm font-bold bg-white"
                  />
                  <textarea
                    rows={2}
                    value={content.about_snippet.feature_2.description}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => ({
                        ...prev,
                        about_snippet: {
                          ...prev.about_snippet,
                          feature_2: { ...prev.about_snippet.feature_2, description: val },
                        },
                      }))
                    }}
                    placeholder="Description"
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-[#e2ebe4] pt-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0f1d14]">
                Call to Action Buttons
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#0f1d14]">
                    Primary Button Label &amp; URL
                  </label>
                  <input
                    type="text"
                    value={content.about_snippet.primary_btn_text}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => ({
                        ...prev,
                        about_snippet: { ...prev.about_snippet, primary_btn_text: val },
                      }))
                    }}
                    placeholder="Button Text"
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
                  />
                  <input
                    type="text"
                    value={content.about_snippet.primary_btn_url}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => ({
                        ...prev,
                        about_snippet: { ...prev.about_snippet, primary_btn_url: val },
                      }))
                    }}
                    placeholder="Destination URL (e.g. /about)"
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#0f1d14]">
                    Secondary Button Label &amp; URL
                  </label>
                  <input
                    type="text"
                    value={content.about_snippet.secondary_btn_text}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => ({
                        ...prev,
                        about_snippet: { ...prev.about_snippet, secondary_btn_text: val },
                      }))
                    }}
                    placeholder="Button Text"
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
                  />
                  <input
                    type="text"
                    value={content.about_snippet.secondary_btn_url}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => ({
                        ...prev,
                        about_snippet: { ...prev.about_snippet, secondary_btn_url: val },
                      }))
                    }}
                    placeholder="Destination URL (e.g. /about/management)"
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: STRATEGIC OBJECTIVES (HOME GREEN CARD)
      ===================================================================== */}
      {activeTab === 'objectives' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0f1d14]">Strategic Objectives (Dark Green Showcase Card)</h2>
              <p className="text-sm text-[#5c6f62] mt-0.5">
                This appears as the prominent green card alongside the About Forum snippet on the home page.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                Card Title
              </label>
              <input
                type="text"
                value={content.strategic_objectives.title}
                onChange={(e) => {
                  const val = e.target.value
                  updateContent((prev) => ({
                    ...prev,
                    strategic_objectives: { ...prev.strategic_objectives, title: val },
                  }))
                }}
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm font-bold focus:outline-none focus:border-[#175432] bg-[#fdfdfd]"
              />
            </div>

            <div className="space-y-4 pt-2">
              <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider">
                Objectives (1 to 4)
              </label>

              {content.strategic_objectives.objectives.map((obj, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-[#f6f9f6] border border-[#e2ebe4] space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#175432] text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={obj.title}
                      onChange={(e) => {
                        const val = e.target.value
                        updateContent((prev) => {
                          const updated = [...prev.strategic_objectives.objectives]
                          updated[idx] = { ...updated[idx], title: val }
                          return {
                            ...prev,
                            strategic_objectives: { ...prev.strategic_objectives, objectives: updated },
                          }
                        })
                      }}
                      placeholder="Objective Title"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#e2ebe4] text-sm font-bold bg-white"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={obj.description}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => {
                        const updated = [...prev.strategic_objectives.objectives]
                        updated[idx] = { ...updated[idx], description: val }
                        return {
                          ...prev,
                          strategic_objectives: { ...prev.strategic_objectives, objectives: updated },
                        }
                      })
                    }}
                    placeholder="Detailed explanation"
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: SECTION HEADINGS
      ===================================================================== */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0f1d14]">Website Section Headings &amp; Subtitles</h2>
              <p className="text-sm text-[#5c6f62] mt-0.5">
                Customize titles and subtitles for dynamic data sections like Programmes, News, Events, and Publications.
              </p>
            </div>

            {/* Thematic Programmes */}
            <div className="p-5 rounded-lg bg-[#f6f9f6] border border-[#e2ebe4] space-y-4">
              <span className="text-sm font-bold uppercase tracking-wider text-[#175432]">
                1. Thematic Programmes Section
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0f1d14] mb-1">Badge</label>
                  <input
                    type="text"
                    value={content.programmes_section.badge}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => ({
                        ...prev,
                        programmes_section: { ...prev.programmes_section, badge: val },
                      }))
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0f1d14] mb-1">Headline</label>
                  <input
                    type="text"
                    value={content.programmes_section.title}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => ({
                        ...prev,
                        programmes_section: { ...prev.programmes_section, title: val },
                      }))
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm font-bold bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0f1d14] mb-1">Subtitle / Description</label>
                <input
                  type="text"
                  value={content.programmes_section.description}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      programmes_section: { ...prev.programmes_section, description: val },
                    }))
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-white"
                />
              </div>
            </div>

            {/* News & Events */}
            <div className="p-5 rounded-lg bg-[#f6f9f6] border border-[#e2ebe4] space-y-4">
              <span className="text-sm font-bold uppercase tracking-wider text-[#175432]">
                2. News &amp; Events Section Headers
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0f1d14] mb-1">News Headline</label>
                  <input
                    type="text"
                    value={content.news_events_section.news_title}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => ({
                        ...prev,
                        news_events_section: { ...prev.news_events_section, news_title: val },
                      }))
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0f1d14] mb-1">Events Headline</label>
                  <input
                    type="text"
                    value={content.news_events_section.events_title}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => ({
                        ...prev,
                        news_events_section: { ...prev.news_events_section, events_title: val },
                      }))
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm font-bold bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Publications Knowledge Hub */}
            <div className="p-5 rounded-lg bg-[#f6f9f6] border border-[#e2ebe4] space-y-4">
              <span className="text-sm font-bold uppercase tracking-wider text-[#175432]">
                3. Publications Knowledge Hub
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0f1d14] mb-1">Badge</label>
                  <input
                    type="text"
                    value={content.publications_section.badge}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => ({
                        ...prev,
                        publications_section: { ...prev.publications_section, badge: val },
                      }))
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0f1d14] mb-1">Headline</label>
                  <input
                    type="text"
                    value={content.publications_section.title}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => ({
                        ...prev,
                        publications_section: { ...prev.publications_section, title: val },
                      }))
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm font-bold bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0f1d14] mb-1">Subtitle</label>
                <input
                  type="text"
                  value={content.publications_section.description}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      publications_section: { ...prev.publications_section, description: val },
                    }))
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-white"
                />
              </div>
            </div>

            {/* Partners */}
            <div className="p-5 rounded-lg bg-[#f6f9f6] border border-[#e2ebe4] space-y-3">
              <span className="text-sm font-bold uppercase tracking-wider text-[#175432]">
                4. Collaborating Partners Marquee Title
              </span>
              <input
                type="text"
                value={content.partners_section.title}
                onChange={(e) => {
                  const val = e.target.value
                  updateContent((prev) => ({
                    ...prev,
                    partners_section: { ...prev.partners_section, title: val },
                  }))
                }}
                className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 6: MEMBERSHIP CTA BANNER
      ===================================================================== */}
      {activeTab === 'cta' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0f1d14]">Membership &amp; Stakeholder Call-to-Action Banner</h2>
              <p className="text-sm text-[#5c6f62] mt-0.5">
                The full-width dark green call-to-action banner near the bottom of the home page.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                  Badge
                </label>
                <input
                  type="text"
                  value={content.membership_cta.badge}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      membership_cta: { ...prev.membership_cta, badge: val },
                    }))
                  }}
                  className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={content.membership_cta.title}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      membership_cta: { ...prev.membership_cta, title: val },
                    }))
                  }}
                  className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm font-bold bg-[#fdfdfd]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                Paragraph Description
              </label>
              <textarea
                rows={3}
                value={content.membership_cta.description}
                onChange={(e) => {
                  const val = e.target.value
                  updateContent((prev) => ({
                    ...prev,
                    membership_cta: { ...prev.membership_cta, description: val },
                  }))
                }}
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm leading-relaxed bg-[#fdfdfd]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0f1d14]">
                  Primary Button (Apply for Membership)
                </label>
                <input
                  type="text"
                  value={content.membership_cta.primary_btn_text}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      membership_cta: { ...prev.membership_cta, primary_btn_text: val },
                    }))
                  }}
                  placeholder="Button Label"
                  className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
                />
                <input
                  type="text"
                  value={content.membership_cta.primary_btn_url}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      membership_cta: { ...prev.membership_cta, primary_btn_url: val },
                    }))
                  }}
                  placeholder="Button Link (/membership/apply)"
                  className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0f1d14]">
                  Secondary Button (Categories &amp; Benefits)
                </label>
                <input
                  type="text"
                  value={content.membership_cta.secondary_btn_text}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      membership_cta: { ...prev.membership_cta, secondary_btn_text: val },
                    }))
                  }}
                  placeholder="Button Label"
                  className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
                />
                <input
                  type="text"
                  value={content.membership_cta.secondary_btn_url}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      membership_cta: { ...prev.membership_cta, secondary_btn_url: val },
                    }))
                  }}
                  placeholder="Button Link (/membership)"
                  className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
