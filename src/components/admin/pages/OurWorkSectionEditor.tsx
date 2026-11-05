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
  Layers,
  Scale,
  Sprout,
  ShieldCheck,
  Target,
  BookOpen,
} from 'lucide-react'
import FileUpload from '@/components/admin/FileUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'
import {
  OurWorkPageContent,
  DEFAULT_OUR_WORK_PAGE_CONTENT,
} from '@/types/pageContent'

interface OurWorkSectionEditorProps {
  initialContent: OurWorkPageContent
}

const ICON_OPTIONS = [
  { value: 'Scale', label: 'Scale (Policy & Law)' },
  { value: 'Users', label: 'Users (Multi-Stakeholder Dialogue)' },
  { value: 'BookOpen', label: 'BookOpen (Research & Evidence)' },
  { value: 'GraduationCap', label: 'GraduationCap (Capacity Building)' },
  { value: 'Sprout', label: 'Sprout (Climate & Agriculture)' },
  { value: 'ShieldCheck', label: 'ShieldCheck (Resilience & Tenure)' },
  { value: 'Layers', label: 'Layers (Systems & Frameworks)' },
]

export default function OurWorkSectionEditor({
  initialContent,
}: OurWorkSectionEditorProps) {
  const [content, setContent] = useState<OurWorkPageContent>({
    ...DEFAULT_OUR_WORK_PAGE_CONTENT,
    ...initialContent,
    header: {
      ...DEFAULT_OUR_WORK_PAGE_CONTENT.header,
      ...(initialContent?.header || {}),
    },
    pillars_section: {
      ...DEFAULT_OUR_WORK_PAGE_CONTENT.pillars_section,
      ...(initialContent?.pillars_section || {}),
      pillars:
        initialContent?.pillars_section?.pillars ||
        DEFAULT_OUR_WORK_PAGE_CONTENT.pillars_section.pillars,
    },
    thematic_section: {
      ...DEFAULT_OUR_WORK_PAGE_CONTENT.thematic_section,
      ...(initialContent?.thematic_section || {}),
      items:
        initialContent?.thematic_section?.items ||
        DEFAULT_OUR_WORK_PAGE_CONTENT.thematic_section.items,
    },
    projects_section: {
      ...DEFAULT_OUR_WORK_PAGE_CONTENT.projects_section,
      ...(initialContent?.projects_section || {}),
      projects:
        initialContent?.projects_section?.projects ||
        DEFAULT_OUR_WORK_PAGE_CONTENT.projects_section.projects,
    },
    dossiers_section: {
      ...DEFAULT_OUR_WORK_PAGE_CONTENT.dossiers_section,
      ...(initialContent?.dossiers_section || {}),
    },
    cta_section: {
      ...DEFAULT_OUR_WORK_PAGE_CONTENT.cta_section,
      ...(initialContent?.cta_section || {}),
    },
  })

  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<
    'header' | 'pillars' | 'thematic' | 'projects' | 'cta'
  >('header')
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const updateContent = (
    updater: (prev: OurWorkPageContent) => OurWorkPageContent
  ) => {
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
        body: JSON.stringify({ slug: 'our-work', content }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save Our Work page content.')
      }

      setMessage({
        type: 'success',
        text: 'Our Work page content saved and published! Public cache revalidated.',
      })
      setHasUnsavedChanges(false)
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Error saving changes. Please try again.',
      })
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
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5c6f62] hover:text-[#175432] mb-2 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Pages</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f1d14] tracking-tight">
            Our Work Page Content Editor
          </h1>
          <p className="text-sm text-[#5c6f62] mt-0.5">
            Manage the combined Our Work page: mandate header, core advocacy pillars, thematic programmes, completed projects, and engagement CTAs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/our-work"
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
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Floating Sticky Alert if Unsaved */}
      {hasUnsavedChanges && (
        <div className="sticky top-4 z-30 bg-amber-50 border border-amber-300 text-amber-900 px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-sm font-bold">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>
              You have unsaved changes on the Our Work Page. Click &quot;Save &amp; Publish&quot; to apply them.
            </span>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold transition-colors shrink-0 cursor-pointer"
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
          { id: 'header', label: '1. Header Banner', icon: Layers },
          { id: 'pillars', label: '2. Core Advocacy Pillars', icon: Scale },
          { id: 'thematic', label: '3. Thematic Programmes', icon: BookOpen },
          { id: 'projects', label: '4. Completed Projects', icon: ShieldCheck },
          { id: 'cta', label: '5. Dossiers & CTA', icon: Target },
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
            <h2 className="text-lg font-bold text-[#0f1d14]">
              Our Work Header Banner
            </h2>
            <p className="text-sm text-[#5c6f62] mt-0.5">
              The top hero banner introducing ACF&apos;s mandate and neutrality on `/our-work`.
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
              Mandate &amp; Practice Overview
            </label>
            <textarea
              rows={4}
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
          TAB 2: CORE ADVOCACY PILLARS
      ===================================================================== */}
      {activeTab === 'pillars' && (
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#0f1d14]">
                Core Advocacy Pillars
              </h2>
              <p className="text-sm text-[#5c6f62] mt-0.5">
                The strategic anchors steering ACF consultations, policy analysis, and capacity building.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const current = content.pillars_section.pillars || []
                const nextNum = String(current.length + 1).padStart(2, '0')
                updateContent((prev) => ({
                  ...prev,
                  pillars_section: {
                    ...prev.pillars_section,
                    pillars: [
                      ...prev.pillars_section.pillars,
                      {
                        num: nextNum,
                        title: 'New Advocacy Pillar',
                        description: 'Describe this core advocacy pillar...',
                        icon: 'Scale',
                      },
                    ],
                  },
                }))
              }}
              className="px-4 py-2 bg-[#1e7e48] hover:bg-[#166538] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Pillar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                Section Badge
              </label>
              <input
                type="text"
                value={content.pillars_section.badge}
                onChange={(e) => {
                  const val = e.target.value
                  updateContent((prev) => ({
                    ...prev,
                    pillars_section: { ...prev.pillars_section, badge: val },
                  }))
                }}
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                value={content.pillars_section.title}
                onChange={(e) => {
                  const val = e.target.value
                  updateContent((prev) => ({
                    ...prev,
                    pillars_section: { ...prev.pillars_section, title: val },
                  }))
                }}
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm font-bold bg-[#fdfdfd]"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                Section Description
              </label>
              <input
                type="text"
                value={content.pillars_section.description}
                onChange={(e) => {
                  const val = e.target.value
                  updateContent((prev) => ({
                    ...prev,
                    pillars_section: {
                      ...prev.pillars_section,
                      description: val,
                    },
                  }))
                }}
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {content.pillars_section.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#f6f9f6] border border-[#e2ebe4] space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                      Pillar #
                    </label>
                    <input
                      type="text"
                      value={pillar.num}
                      onChange={(e) => {
                        const val = e.target.value
                        updateContent((prev) => {
                          const updated = [...prev.pillars_section.pillars]
                          updated[idx] = { ...updated[idx], num: val }
                          return {
                            ...prev,
                            pillars_section: {
                              ...prev.pillars_section,
                              pillars: updated,
                            },
                          }
                        })
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm font-black bg-white text-[#1e7e48]"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                      Pillar Title
                    </label>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => {
                        const val = e.target.value
                        updateContent((prev) => {
                          const updated = [...prev.pillars_section.pillars]
                          updated[idx] = { ...updated[idx], title: val }
                          return {
                            ...prev,
                            pillars_section: {
                              ...prev.pillars_section,
                              pillars: updated,
                            },
                          }
                        })
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm font-bold bg-white"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                      Icon
                    </label>
                    <select
                      value={pillar.icon || 'Scale'}
                      onChange={(e) => {
                        const val = e.target.value
                        updateContent((prev) => {
                          const updated = [...prev.pillars_section.pillars]
                          updated[idx] = { ...updated[idx], icon: val }
                          return {
                            ...prev,
                            pillars_section: {
                              ...prev.pillars_section,
                              pillars: updated,
                            },
                          }
                        })
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-white"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-1 flex justify-end pt-4">
                    {content.pillars_section.pillars.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          updateContent((prev) => ({
                            ...prev,
                            pillars_section: {
                              ...prev.pillars_section,
                              pillars: prev.pillars_section.pillars.filter(
                                (_, i) => i !== idx
                              ),
                            },
                          }))
                        }}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove Pillar"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                    Pillar Description
                  </label>
                  <textarea
                    rows={2}
                    value={pillar.description}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => {
                        const updated = [...prev.pillars_section.pillars]
                        updated[idx] = { ...updated[idx], description: val }
                        return {
                          ...prev,
                          pillars_section: {
                            ...prev.pillars_section,
                            pillars: updated,
                          },
                        }
                      })
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm leading-relaxed bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: THEMATIC PROGRAMMES & FOCUS AREAS
      ===================================================================== */}
      {activeTab === 'thematic' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#0f1d14]">
                  Thematic Programmes &amp; Focus Areas
                </h2>
                <p className="text-sm text-[#5c6f62] mt-0.5">
                  Combined thematic areas (Policy Advocacy &amp; Reform, Research &amp; Evidence, Climate Resilience, Land Tenure) displayed in full on `/our-work`.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  updateContent((prev) => ({
                    ...prev,
                    thematic_section: {
                      ...prev.thematic_section,
                      items: [
                        ...prev.thematic_section.items,
                        {
                          slug: `thematic-area-${prev.thematic_section.items.length + 1}`,
                          title: 'New Thematic Programme',
                          subtitle: 'Strategic focus tagline',
                          summary:
                            'Concise summary of this thematic programme area...',
                          body: 'Detailed description of interventions, policy dialogues, and outcomes...',
                          icon: 'Sprout',
                          cover_image: '/photos/fosta-stakeholders-dialogue.jpg',
                        },
                      ],
                    },
                  }))
                }}
                className="px-4 py-2 bg-[#1e7e48] hover:bg-[#166538] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Thematic Area</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                  Section Badge
                </label>
                <input
                  type="text"
                  value={content.thematic_section.badge}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      thematic_section: {
                        ...prev.thematic_section,
                        badge: val,
                      },
                    }))
                  }}
                  className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                  Section Title
                </label>
                <input
                  type="text"
                  value={content.thematic_section.title}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      thematic_section: {
                        ...prev.thematic_section,
                        title: val,
                      },
                    }))
                  }}
                  className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm font-bold bg-[#fdfdfd]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                  Section Description
                </label>
                <input
                  type="text"
                  value={content.thematic_section.description}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      thematic_section: {
                        ...prev.thematic_section,
                        description: val,
                      },
                    }))
                  }}
                  className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
                />
              </div>
            </div>

            <div className="space-y-6 pt-2">
              {content.thematic_section.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-[#f6f9f6] border border-[#e2ebe4] space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#e2ebe4] pb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-[#175432]">
                      Thematic Programme #{idx + 1}: {item.title}
                    </span>
                    {content.thematic_section.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          updateContent((prev) => ({
                            ...prev,
                            thematic_section: {
                              ...prev.thematic_section,
                              items: prev.thematic_section.items.filter(
                                (_, i) => i !== idx
                              ),
                            },
                          }))
                        }}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove Thematic Programme"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="lg:col-span-2">
                      <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const val = e.target.value
                          updateContent((prev) => {
                            const updated = [...prev.thematic_section.items]
                            updated[idx] = { ...updated[idx], title: val }
                            return {
                              ...prev,
                              thematic_section: {
                                ...prev.thematic_section,
                                items: updated,
                              },
                            }
                          })
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm font-bold bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                        Subtitle / Tagline
                      </label>
                      <input
                        type="text"
                        value={item.subtitle}
                        onChange={(e) => {
                          const val = e.target.value
                          updateContent((prev) => {
                            const updated = [...prev.thematic_section.items]
                            updated[idx] = { ...updated[idx], subtitle: val }
                            return {
                              ...prev,
                              thematic_section: {
                                ...prev.thematic_section,
                                items: updated,
                              },
                            }
                          })
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                        Icon &amp; Anchor Slug
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={item.icon || 'Scale'}
                          onChange={(e) => {
                            const val = e.target.value
                            updateContent((prev) => {
                              const updated = [...prev.thematic_section.items]
                              updated[idx] = { ...updated[idx], icon: val }
                              return {
                                ...prev,
                                thematic_section: {
                                  ...prev.thematic_section,
                                  items: updated,
                                },
                              }
                            })
                          }}
                          className="w-full px-2 py-2 rounded-lg border border-[#e2ebe4] text-xs bg-white"
                        >
                          {ICON_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-8 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                          Executive Summary
                        </label>
                        <textarea
                          rows={2}
                          value={item.summary}
                          onChange={(e) => {
                            const val = e.target.value
                            updateContent((prev) => {
                              const updated = [...prev.thematic_section.items]
                              updated[idx] = { ...updated[idx], summary: val }
                              return {
                                ...prev,
                                thematic_section: {
                                  ...prev.thematic_section,
                                  items: updated,
                                },
                              }
                            })
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm leading-relaxed bg-white"
                        />
                      </div>

                      <div>
                        <RichTextEditor
                          label="Detailed Scope & Policy Interventions"
                          value={item.body}
                          onChange={(val) => {
                            updateContent((prev) => {
                              const updated = [...prev.thematic_section.items]
                              updated[idx] = { ...updated[idx], body: val }
                              return {
                                ...prev,
                                thematic_section: {
                                  ...prev.thematic_section,
                                  items: updated,
                                },
                              }
                            })
                          }}
                          rows={5}
                        />
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-3">
                      <FileUpload
                        label="Thematic Cover Image"
                        value={item.cover_image || ''}
                        onChange={(url) => {
                          updateContent((prev) => {
                            const updated = [...prev.thematic_section.items]
                            updated[idx] = { ...updated[idx], cover_image: url }
                            return {
                              ...prev,
                              thematic_section: {
                                ...prev.thematic_section,
                                items: updated,
                              },
                            }
                          })
                        }}
                        accept="image/*"
                        type="image"
                        description="Optional photo displayed alongside this thematic section."
                      />
                      <div>
                        <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                          Section Anchor ID
                        </label>
                        <input
                          type="text"
                          value={item.slug}
                          onChange={(e) => {
                            const val = e.target.value
                            updateContent((prev) => {
                              const updated = [...prev.thematic_section.items]
                              updated[idx] = { ...updated[idx], slug: val }
                              return {
                                ...prev,
                                thematic_section: {
                                  ...prev.thematic_section,
                                  items: updated,
                                },
                              }
                            })
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#e2ebe4] text-xs font-mono bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: FEATURED COMPLETED PROJECTS
      ===================================================================== */}
      {activeTab === 'projects' && (
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#0f1d14]">
                Featured Completed Projects
              </h2>
              <p className="text-sm text-[#5c6f62] mt-0.5">
                Collaborative research initiatives and multi-country frameworks (e.g. GCRF AFRICAP, CliMBER, FoSTA).
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                updateContent((prev) => ({
                  ...prev,
                  projects_section: {
                    ...prev.projects_section,
                    projects: [
                      ...prev.projects_section.projects,
                      {
                        slug: `project-${prev.projects_section.projects.length + 1}`,
                        acronym: 'NEW PROJECT',
                        title: 'New Completed Research Initiative',
                        description:
                          'Summary of project activities and policy impact...',
                        details:
                          'Detailed documentation of project outcomes and stakeholder collaborations...',
                        icon: 'ShieldCheck',
                      },
                    ],
                  },
                }))
              }}
              className="px-4 py-2 bg-[#1e7e48] hover:bg-[#166538] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                Section Badge
              </label>
              <input
                type="text"
                value={content.projects_section.badge}
                onChange={(e) => {
                  const val = e.target.value
                  updateContent((prev) => ({
                    ...prev,
                    projects_section: { ...prev.projects_section, badge: val },
                  }))
                }}
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                value={content.projects_section.title}
                onChange={(e) => {
                  const val = e.target.value
                  updateContent((prev) => ({
                    ...prev,
                    projects_section: { ...prev.projects_section, title: val },
                  }))
                }}
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm font-bold bg-[#fdfdfd]"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                Section Description
              </label>
              <input
                type="text"
                value={content.projects_section.description}
                onChange={(e) => {
                  const val = e.target.value
                  updateContent((prev) => ({
                    ...prev,
                    projects_section: {
                      ...prev.projects_section,
                      description: val,
                    },
                  }))
                }}
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {content.projects_section.projects.map((proj, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#f6f9f6] border border-[#e2ebe4] space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                      Acronym
                    </label>
                    <input
                      type="text"
                      value={proj.acronym}
                      onChange={(e) => {
                        const val = e.target.value
                        updateContent((prev) => {
                          const updated = [...prev.projects_section.projects]
                          updated[idx] = { ...updated[idx], acronym: val }
                          return {
                            ...prev,
                            projects_section: {
                              ...prev.projects_section,
                              projects: updated,
                            },
                          }
                        })
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm font-black bg-white text-[#1e7e48]"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                      Full Project Title
                    </label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const val = e.target.value
                        updateContent((prev) => {
                          const updated = [...prev.projects_section.projects]
                          updated[idx] = { ...updated[idx], title: val }
                          return {
                            ...prev,
                            projects_section: {
                              ...prev.projects_section,
                              projects: updated,
                            },
                          }
                        })
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm font-bold bg-white"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                      Icon
                    </label>
                    <select
                      value={proj.icon || 'ShieldCheck'}
                      onChange={(e) => {
                        const val = e.target.value
                        updateContent((prev) => {
                          const updated = [...prev.projects_section.projects]
                          updated[idx] = { ...updated[idx], icon: val }
                          return {
                            ...prev,
                            projects_section: {
                              ...prev.projects_section,
                              projects: updated,
                            },
                          }
                        })
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm bg-white"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-1 flex justify-end pt-4">
                    {content.projects_section.projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          updateContent((prev) => ({
                            ...prev,
                            projects_section: {
                              ...prev.projects_section,
                              projects: prev.projects_section.projects.filter(
                                (_, i) => i !== idx
                              ),
                            },
                          }))
                        }}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                    Project Overview
                  </label>
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => {
                        const updated = [...prev.projects_section.projects]
                        updated[idx] = { ...updated[idx], description: val }
                        return {
                          ...prev,
                          projects_section: {
                            ...prev.projects_section,
                            projects: updated,
                          },
                        }
                      })
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm leading-relaxed bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                    Key Outcomes &amp; Documentation Summary
                  </label>
                  <textarea
                    rows={2}
                    value={proj.details || ''}
                    onChange={(e) => {
                      const val = e.target.value
                      updateContent((prev) => {
                        const updated = [...prev.projects_section.projects]
                        updated[idx] = { ...updated[idx], details: val }
                        return {
                          ...prev,
                          projects_section: {
                            ...prev.projects_section,
                            projects: updated,
                          },
                        }
                      })
                    }}
                    placeholder="Additional context or key outcomes achieved..."
                    className="w-full px-3 py-2 rounded-lg border border-[#e2ebe4] text-sm leading-relaxed bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: DOSSIERS & ENGAGEMENT CTA
      ===================================================================== */}
      {activeTab === 'cta' && (
        <div className="space-y-6">
          {/* Active Dossiers Section Heading + Link to Programme Manager */}
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#0f1d14]">
                  Active Programme Dossiers Section
                </h2>
                <p className="text-sm text-[#5c6f62] mt-0.5">
                  Configure the heading for additional programme dossiers managed under Thematic Programmes.
                </p>
              </div>
              <Link
                href="/admin/programmes"
                className="px-4 py-2.5 rounded-lg bg-[#1e7e48] hover:bg-[#166538] text-white text-xs font-bold transition-colors inline-flex items-center gap-2 shrink-0"
              >
                <span>Manage Programme Records</span>
                <ExternalLink size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                  Section Title
                </label>
                <input
                  type="text"
                  value={content.dossiers_section.title}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      dossiers_section: {
                        ...prev.dossiers_section,
                        title: val,
                      },
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
                  value={content.dossiers_section.description}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      dossiers_section: {
                        ...prev.dossiers_section,
                        description: val,
                      },
                    }))
                  }}
                  className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
                />
              </div>
            </div>
          </div>

          {/* Bottom Engagement Call-to-Action */}
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0f1d14]">
                Stakeholder Engagement Call-to-Action Banner
              </h2>
              <p className="text-sm text-[#5c6f62] mt-0.5">
                The bottom banner inviting stakeholders to join a working group or explore publications.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                  Badge
                </label>
                <input
                  type="text"
                  value={content.cta_section.badge}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      cta_section: { ...prev.cta_section, badge: val },
                    }))
                  }}
                  className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                  CTA Title
                </label>
                <input
                  type="text"
                  value={content.cta_section.title}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      cta_section: { ...prev.cta_section, title: val },
                    }))
                  }}
                  className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm font-bold bg-[#fdfdfd]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0f1d14] uppercase tracking-wider mb-1.5">
                CTA Description
              </label>
              <textarea
                rows={2}
                value={content.cta_section.description}
                onChange={(e) => {
                  const val = e.target.value
                  updateContent((prev) => ({
                    ...prev,
                    cta_section: { ...prev.cta_section, description: val },
                  }))
                }}
                className="w-full px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm bg-[#fdfdfd]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={content.cta_section.primary_btn_text}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      cta_section: {
                        ...prev.cta_section,
                        primary_btn_text: val,
                      },
                    }))
                  }}
                  className="w-full px-3 py-2 rounded-md border border-[#e2ebe4] text-sm font-bold bg-[#fdfdfd]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                  Primary Button URL
                </label>
                <input
                  type="text"
                  value={content.cta_section.primary_btn_url}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      cta_section: {
                        ...prev.cta_section,
                        primary_btn_url: val,
                      },
                    }))
                  }}
                  className="w-full px-3 py-2 rounded-md border border-[#e2ebe4] text-sm font-mono bg-[#fdfdfd]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={content.cta_section.secondary_btn_text}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      cta_section: {
                        ...prev.cta_section,
                        secondary_btn_text: val,
                      },
                    }))
                  }}
                  className="w-full px-3 py-2 rounded-md border border-[#e2ebe4] text-sm font-bold bg-[#fdfdfd]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5c6f62] uppercase mb-1">
                  Secondary Button URL
                </label>
                <input
                  type="text"
                  value={content.cta_section.secondary_btn_url}
                  onChange={(e) => {
                    const val = e.target.value
                    updateContent((prev) => ({
                      ...prev,
                      cta_section: {
                        ...prev.cta_section,
                        secondary_btn_url: val,
                      },
                    }))
                  }}
                  className="w-full px-3 py-2 rounded-md border border-[#e2ebe4] text-sm font-mono bg-[#fdfdfd]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

