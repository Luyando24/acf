'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Video,
  FileText,
  Download,
  UserPlus,
  MessageSquarePlus,
  CheckCircle2,
  Lock,
  Sparkles,
  Users,
  X,
  ExternalLink,
} from 'lucide-react'
import {
  DialogueAttachment,
  getDialogueDocuments,
} from '@/lib/supabase/dialogues'
import DialogueJoinForm from '@/components/events/DialogueJoinForm'
import DialogueProposalForm from '@/components/events/DialogueProposalForm'

export interface PublicDialogueEvent {
  id: string
  slug: string
  title: string
  description: string
  starts_at: string
  ends_at: string | null
  venue: string | null
  virtual_url?: string | null
  registration_url?: string | null
  featured_image?: string | null
  document_url?: string | null
  slides_url?: string | null
  recording_url?: string | null
  attachments?: DialogueAttachment[] | null
  is_closed?: boolean | null
  dialogue_state?: 'auto' | 'active' | 'closed'
  status?: string
  approvedParticipantsCount?: number
}

interface OngoingForumItem {
  title: string
  category: string
  schedule: string
  venue: string
  description: string
}

interface PolicyDialoguesClientProps {
  activeDialogues: PublicDialogueEvent[]
  closedDialogues: PublicDialogueEvent[]
  ongoingForums: OngoingForumItem[]
  initialTab?: 'active' | 'closed'
}

export default function PolicyDialoguesClient({
  activeDialogues,
  closedDialogues,
  ongoingForums,
  initialTab = 'active',
}: PolicyDialoguesClientProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'closed'>(initialTab)
  const [joinTarget, setJoinTarget] = useState<PublicDialogueEvent | null>(null)
  const [showProposeModal, setShowProposeModal] = useState(false)

  const stripHtml = (html: string) =>
    html ? html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : ''

  return (
    <div className="space-y-12">
      {/* Top Action & 2-Tab Navigation Bar */}
      <div className="bg-white rounded-3xl border border-[#dbe6de] p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* 2 Tabs: Active Dialogues vs Closed Dialogues */}
        <div
          role="tablist"
          aria-label="Policy Dialogues Tabs"
          className="grid grid-cols-2 sm:inline-flex items-center gap-2 bg-[#f3f7f4] p-1.5 rounded-2xl border border-[#dbe6de]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'active'}
            onClick={() => setActiveTab('active')}
            className={`inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-[#1e7e48] text-white shadow-sm'
                : 'text-[#2d3f33] hover:text-[#1e7e48] hover:bg-white/70'
            }`}
          >
            <Sparkles size={15} />
            <span>Active Dialogues</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                activeTab === 'active'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#e1ede4] text-[#1e7e48]'
              }`}
            >
              {activeDialogues.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'closed'}
            onClick={() => setActiveTab('closed')}
            className={`inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'closed'
                ? 'bg-[#122419] text-white shadow-sm'
                : 'text-[#2d3f33] hover:text-[#122419] hover:bg-white/70'
            }`}
          >
            <Lock size={15} />
            <span>Closed Dialogues</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                activeTab === 'closed'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {closedDialogues.length}
            </span>
          </button>
        </div>

        {/* Public Action: Propose a Policy Dialogue */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
          <span className="text-xs text-[#526658] hidden xl:inline">
            Have a pressing agricultural policy topic or concept note?
          </span>
          <button
            type="button"
            onClick={() => setShowProposeModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#eab308] hover:bg-[#ca8a04] text-[#122419] font-extrabold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <MessageSquarePlus size={16} />
            <span>Propose a Policy Dialogue</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ACTIVE DIALOGUES */}
      {activeTab === 'active' && (
        <div className="space-y-14">
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#1e7e48]">
                  Open for Participation (Admin Approval)
                </span>
                <h2 className="text-2xl font-black text-[#122419] mt-1">
                  Active & Upcoming Policy Dialogues
                </h2>
              </div>
              <p className="text-xs text-[#526658]">
                Select any active dialogue to download briefing PDFs or request Secretariat approval to join.
              </p>
            </div>

            {activeDialogues.length > 0 ? (
              <div className="space-y-6">
                {activeDialogues.map((ev) => {
                  const startDate = new Date(ev.starts_at)
                  const docs = getDialogueDocuments(ev)

                  return (
                    <article
                      key={ev.id}
                      className="bg-white rounded-3xl border border-[#dbe6de] hover:border-[#1e7e48] p-6 sm:p-8 transition-all shadow-xs hover:shadow-md flex flex-col lg:flex-row lg:items-start justify-between gap-6"
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-6 flex-1">
                        {/* Date Badge */}
                        <div className="w-20 h-20 rounded-2xl bg-[#122419] text-white flex flex-col items-center justify-center shrink-0 border-b-4 border-[#eab308]">
                          <span className="text-xs font-bold uppercase tracking-widest text-[#eab308]">
                            {startDate.toLocaleDateString('en-ZM', { month: 'short' })}
                          </span>
                          <span className="text-2xl font-black leading-none mt-0.5">
                            {startDate.getDate()}
                          </span>
                          <span className="text-[10px] text-white/60 mt-0.5">
                            {startDate.getFullYear()}
                          </span>
                        </div>

                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#526658]">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e8f5ee] text-[#1e7e48] font-bold">
                              <Sparkles size={11} />
                              Active Dialogue
                            </span>
                            <span className="inline-flex items-center gap-1.5 font-semibold text-[#1e7e48]">
                              <Clock size={14} />
                              {startDate.toLocaleTimeString('en-ZM', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              CAT
                            </span>
                            {ev.venue && (
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin size={14} className="text-[#1e7e48]" />
                                {ev.venue}
                              </span>
                            )}
                            {ev.virtual_url && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
                                <Video size={12} /> Hybrid / Online
                              </span>
                            )}
                            {ev.approvedParticipantsCount && ev.approvedParticipantsCount > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                                <Users size={12} />
                                {ev.approvedParticipantsCount} Approved Participant
                                {ev.approvedParticipantsCount > 1 ? 's' : ''}
                              </span>
                            ) : null}
                          </div>

                          <h3 className="text-xl font-bold text-[#122419] hover:text-[#1e7e48] transition-colors">
                            <Link href={`/events/${ev.slug}`}>{ev.title}</Link>
                          </h3>

                          <p className="text-sm text-[#526658] leading-relaxed max-w-3xl line-clamp-3">
                            {stripHtml(ev.description)}
                          </p>

                          {/* Attached PDF Documents */}
                          {docs.length > 0 && (
                            <div className="pt-2 flex flex-wrap items-center gap-2">
                              {docs.map((doc, idx) => (
                                <a
                                  key={idx}
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50/80 hover:bg-red-100 text-red-800 border border-red-200 text-xs font-bold transition-colors"
                                >
                                  <FileText size={14} className="text-red-600 shrink-0" />
                                  <span>{doc.title}</span>
                                  <Download size={13} className="opacity-75" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions Column */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-[#dbe6de]">
                        <button
                          type="button"
                          onClick={() => setJoinTarget(ev)}
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1e7e48] hover:bg-[#166538] text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer"
                        >
                          <UserPlus size={15} />
                          <span>Join Dialogue</span>
                        </button>

                        <Link
                          href={`/events/${ev.slug}`}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#f3f7f4] hover:bg-[#e4efe7] text-[#122419] font-bold text-xs transition-colors"
                        >
                          <span>View Full Details</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#dbe6de] p-12 text-center">
                <Calendar size={40} className="mx-auto text-[#1e7e48] mb-3 opacity-60" />
                <h3 className="text-lg font-bold text-[#122419] mb-1">
                  No Active Scheduled Dialogues at the Moment
                </h3>
                <p className="text-sm text-[#526658] max-w-md mx-auto mb-5">
                  New policy dialogues are announced regularly. You can also propose a policy dialogue topic for the Secretariat to convene.
                </p>
                <button
                  type="button"
                  onClick={() => setShowProposeModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e7e48] text-white text-xs font-bold hover:bg-[#166538] transition-colors cursor-pointer"
                >
                  <MessageSquarePlus size={14} />
                  <span>Propose a Policy Dialogue</span>
                </button>
              </div>
            )}
          </section>

          {/* Ongoing Consultative Working Groups */}
          {ongoingForums.length > 0 && (
            <section className="space-y-6 pt-4 border-t border-[#dbe6de]">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#1e7e48]">
                  Standing Technical Platforms
                </span>
                <h2 className="text-2xl font-black text-[#122419] mt-1">
                  Ongoing Consultative Forums & Working Groups
                </h2>
                <p className="text-sm text-[#526658] mt-1">
                  Regular multi-stakeholder forums and technical policy working groups facilitated by the ACF Secretariat.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ongoingForums.map((forum) => {
                  const forumSlug = forum.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')

                  return (
                    <div
                      key={forum.title}
                      className="bg-white rounded-3xl border border-[#dbe6de] p-7 shadow-xs flex flex-col justify-between hover:border-[#1e7e48] transition-all"
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#e8f5ee] text-[#1e7e48]">
                            {forum.category}
                          </span>
                          <span className="text-xs font-semibold text-[#526658] flex items-center gap-1">
                            <Clock size={13} className="text-[#1e7e48]" />
                            {forum.schedule}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#122419] mb-2">{forum.title}</h3>
                        <p className="text-sm text-[#526658] leading-relaxed mb-5">
                          {forum.description}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-[#dbe6de] flex flex-wrap items-center justify-between gap-3 text-xs text-[#526658]">
                        <span className="flex items-center gap-1.5 font-medium">
                          <MapPin size={13} className="text-[#1e7e48]" />
                          {forum.venue}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setJoinTarget({
                              id: forumSlug,
                              slug: forumSlug,
                              title: forum.title,
                              description: forum.description,
                              starts_at: new Date().toISOString(),
                              ends_at: null,
                              venue: forum.venue,
                            })
                          }
                          className="font-bold text-[#1e7e48] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <UserPlus size={13} />
                          <span>Request to Join Working Group</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      )}

      {/* TAB 2: CLOSED DIALOGUES */}
      {activeTab === 'closed' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#526658]">
                Archive & Past Proceedings
              </span>
              <h2 className="text-2xl font-black text-[#122419] mt-1">
                Closed Policy Dialogues & Proceedings
              </h2>
            </div>
            <p className="text-xs text-[#526658]">
              Browse concluded national dialogues, technical workshops, and downloadable PDF synthesis reports.
            </p>
          </div>

          {closedDialogues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {closedDialogues.map((ev) => {
                const startDate = new Date(ev.starts_at)
                const docs = getDialogueDocuments(ev)

                return (
                  <article
                    key={ev.id}
                    className="bg-white rounded-3xl border border-[#dbe6de] p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-2xs hover:border-[#122419]/40 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#526658]">
                        <span className="inline-flex items-center gap-1.5 font-bold text-[#122419]">
                          <Calendar size={13} className="text-[#1e7e48]" />
                          {startDate.toLocaleDateString('en-ZM', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-bold text-[11px]">
                          <Lock size={11} />
                          Closed Dialogue
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#122419] hover:text-[#1e7e48] transition-colors">
                        <Link href={`/events/${ev.slug}`}>{ev.title}</Link>
                      </h3>

                      {ev.venue && (
                        <div className="text-xs text-[#526658] flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#1e7e48] shrink-0" />
                          <span>{ev.venue}</span>
                        </div>
                      )}

                      <p className="text-xs sm:text-sm text-[#526658] leading-relaxed line-clamp-3">
                        {stripHtml(ev.description)}
                      </p>

                      {docs.length > 0 && (
                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          {docs.map((doc, idx) => (
                            <a
                              key={idx}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-xs font-bold transition-colors"
                            >
                              <FileText size={13} className="text-red-600 shrink-0" />
                              <span>{doc.title}</span>
                              <Download size={12} />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#dbe6de] flex items-center justify-between gap-3">
                      <span className="text-[11px] font-semibold text-[#526658]">
                        Participation Closed
                      </span>
                      <Link
                        href={`/events/${ev.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e7e48] hover:underline"
                      >
                        <span>View Dialogue Summary</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#dbe6de] p-12 text-center">
              <Lock size={36} className="mx-auto text-[#526658] mb-3 opacity-50" />
              <h3 className="text-lg font-bold text-[#122419] mb-1">
                No Closed Dialogues Recorded Yet
              </h3>
              <p className="text-sm text-[#526658]">
                Concluded dialogues and archived proceedings will appear in this tab.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Embedded Public Dialogue Proposal Section */}
      <section className="pt-6 border-t border-[#dbe6de]">
        <DialogueProposalForm />
      </section>

      {/* MODAL: Join Specific Policy Dialogue (Admin Approval) */}
      {joinTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl my-8">
            <button
              type="button"
              onClick={() => setJoinTarget(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-[#122419] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            <DialogueJoinForm
              eventId={joinTarget.id}
              eventSlug={joinTarget.slug}
              eventTitle={joinTarget.title}
              compact
              onClose={() => setJoinTarget(null)}
            />
          </div>
        </div>
      )}

      {/* MODAL: Propose a Policy Dialogue */}
      {showProposeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-3xl my-8 max-h-[90vh] overflow-y-auto rounded-3xl">
            <button
              type="button"
              onClick={() => setShowProposeModal(false)}
              className="sticky top-4 float-right mr-4 mt-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-[#122419] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            <DialogueProposalForm onClose={() => setShowProposeModal(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

