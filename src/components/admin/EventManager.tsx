'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  MapPin,
  Video,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  FileText,
  Users,
  MessageSquarePlus,
  Check,
  XCircle,
  Lock,
  Unlock,
  Mail,
  Phone,
  Building2,
  Sparkles,
} from 'lucide-react'
import {
  DialogueAttachment,
  DialogueProposal,
  DialogueRegistration,
  getDialogueDocuments,
  isDialogueClosed,
} from '@/types/dialogues'

export interface EventItem {
  id: string
  slug: string
  title: string
  description: string
  starts_at: string
  ends_at: string | null
  venue: string | null
  virtual_url: string | null
  registration_url: string | null
  featured_image: string | null
  document_url?: string | null
  slides_url?: string | null
  recording_url?: string | null
  attachments?: DialogueAttachment[] | null
  is_closed?: boolean | null
  dialogue_state?: 'auto' | 'active' | 'closed'
  status: 'draft' | 'scheduled' | 'published' | 'archived'
}

interface EventManagerProps {
  initialEvents: EventItem[]
  initialProposals?: DialogueProposal[]
  initialRegistrations?: DialogueRegistration[]
}

export default function EventManager({
  initialEvents,
  initialProposals = [],
  initialRegistrations = [],
}: EventManagerProps) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents)
  const [proposals, setProposals] = useState<DialogueProposal[]>(initialProposals)
  const [registrations, setRegistrations] = useState<DialogueRegistration[]>(initialRegistrations)

  const [activeTab, setActiveTab] = useState<'dialogues' | 'registrations' | 'proposals'>('dialogues')
  const [dialogueStateFilter, setDialogueStateFilter] = useState<'all' | 'active' | 'closed'>('all')
  const [registrationStatusFilter, setRegistrationStatusFilter] = useState<
    'all' | 'pending' | 'approved' | 'declined'
  >('all')
  const [registrationEventFilter, setRegistrationEventFilter] = useState<string>('all')
  const [proposalStatusFilter, setProposalStatusFilter] = useState<
    'all' | 'pending' | 'approved' | 'declined'
  >('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const pendingRegistrationsCount = registrations.filter((r) => r.status === 'pending').length
  const pendingProposalsCount = proposals.filter((p) => p.status === 'pending').length

  const filteredEvents = events.filter((ev) => {
    const closed = isDialogueClosed(ev)
    const matchesState =
      dialogueStateFilter === 'all' ||
      (dialogueStateFilter === 'active' && !closed) ||
      (dialogueStateFilter === 'closed' && closed)

    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.venue && ev.venue.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesState && matchesSearch
  })

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesStatus =
      registrationStatusFilter === 'all' || reg.status === registrationStatusFilter
    const matchesEvent =
      registrationEventFilter === 'all' ||
      reg.event_id === registrationEventFilter ||
      reg.event_slug === registrationEventFilter
    const matchesSearch =
      !searchQuery.trim() ||
      reg.participant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.event_title.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesEvent && matchesSearch
  })

  const filteredProposals = proposals.filter((prop) => {
    const matchesStatus =
      proposalStatusFilter === 'all' || prop.status === proposalStatusFilter
    const matchesSearch =
      !searchQuery.trim() ||
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.proposer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.topic_area.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  const handleDeleteEvent = async (id: string, title: string) => {
    if (!window.confirm(`Delete event "${title}"?`)) return
    try {
      const res = await fetch(`/api/admin/crud/events?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setEvents((prev) => prev.filter((item) => item.id !== id))
      showToast(`Deleted "${title}" from database`)
    } catch {
      showToast('Error deleting event from database')
    }
  }

  const handleToggleClosed = async (ev: EventItem) => {
    const currentlyClosed = isDialogueClosed(ev)
    const nextClosed = !currentlyClosed
    const nextState: 'active' | 'closed' = nextClosed ? 'closed' : 'active'
    setBusyId(ev.id)
    try {
      const res = await fetch('/api/admin/crud/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ev.id,
          slug: ev.slug,
          is_closed: nextClosed,
          dialogue_state: nextState,
        }),
      })
      if (!res.ok) throw new Error('Failed to update dialogue state')
      setEvents((prev) =>
        prev.map((item) =>
          item.id === ev.id
            ? { ...item, is_closed: nextClosed, dialogue_state: nextState }
            : item
        )
      )
      showToast(
        nextClosed
          ? `Moved "${ev.title}" to Closed Dialogues tab`
          : `Moved "${ev.title}" to Active Dialogues tab`
      )
    } catch {
      showToast('Failed to update dialogue tab placement')
    } finally {
      setBusyId(null)
    }
  }

  const handleRegistrationStatus = async (
    reg: DialogueRegistration,
    status: 'approved' | 'declined'
  ) => {
    setBusyId(reg.id)
    try {
      const res = await fetch('/api/admin/dialogues', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'registration', id: reg.id, status }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update registration status')
      }
      setRegistrations((prev) =>
        prev.map((item) => (item.id === reg.id ? { ...item, status } : item))
      )
      showToast(
        status === 'approved'
          ? `Approved ${reg.participant_name} to join "${reg.event_title}"`
          : `Declined join request from ${reg.participant_name}`
      )
    } catch (err: any) {
      showToast(err.message || 'Error updating participant request')
    } finally {
      setBusyId(null)
    }
  }

  const handleDeleteRegistration = async (reg: DialogueRegistration) => {
    if (!window.confirm(`Delete join request from "${reg.participant_name}"?`)) return
    setBusyId(reg.id)
    try {
      const res = await fetch(`/api/admin/dialogues?kind=registration&id=${reg.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete registration')
      setRegistrations((prev) => prev.filter((item) => item.id !== reg.id))
      showToast('Deleted participant join request')
    } catch {
      showToast('Error deleting join request')
    } finally {
      setBusyId(null)
    }
  }

  const handleProposalStatus = async (
    prop: DialogueProposal,
    status: 'approved' | 'declined'
  ) => {
    setBusyId(prop.id)
    try {
      const res = await fetch('/api/admin/dialogues', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'proposal', id: prop.id, status }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update proposal')
      }
      setProposals((prev) =>
        prev.map((item) => (item.id === prop.id ? { ...item, status } : item))
      )
      showToast(
        status === 'approved'
          ? `Marked proposal "${prop.title}" as approved`
          : `Declined proposal "${prop.title}"`
      )
    } catch (err: any) {
      showToast(err.message || 'Error updating proposal')
    } finally {
      setBusyId(null)
    }
  }

  const handlePublishProposalAsEvent = async (prop: DialogueProposal) => {
    setBusyId(prop.id)
    try {
      const res = await fetch('/api/admin/dialogues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish_proposal', proposalId: prop.id }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to publish dialogue event')
      }
      if (data.event) {
        setEvents((prev) => [data.event as EventItem, ...prev])
      }
      setProposals((prev) =>
        prev.map((item) =>
          item.id === prop.id
            ? {
                ...item,
                status: 'approved',
                published_event_id: data.event?.id || item.published_event_id,
              }
            : item
        )
      )
      showToast(`Approved & published "${prop.title}" as an Active Policy Dialogue!`)
    } catch (err: any) {
      showToast(err.message || 'Failed to publish proposed dialogue')
    } finally {
      setBusyId(null)
    }
  }

  const handleDeleteProposal = async (prop: DialogueProposal) => {
    if (!window.confirm(`Delete proposed dialogue "${prop.title}"?`)) return
    setBusyId(prop.id)
    try {
      const res = await fetch(`/api/admin/dialogues?kind=proposal&id=${prop.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete proposal')
      setProposals((prev) => prev.filter((item) => item.id !== prop.id))
      showToast('Deleted proposed dialogue')
    } catch {
      showToast('Error deleting proposed dialogue')
    } finally {
      setBusyId(null)
    }
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-ZM', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return iso
    }
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f1d14] text-white px-4 py-3 rounded-xl shadow-lg border border-[#25633e] flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 size={16} className="text-[#eab308]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#e2ebe4] shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-[#0f1d14] tracking-tight">
            Policy Dialogues & Events Management
          </h1>
          <p className="text-xs text-[#5c6f62] mt-1">
            Manage active & closed dialogues, attach PDF documents, approve participant join requests, and review public dialogue proposals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/events"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 border border-[#e2ebe4] hover:bg-[#f6f9f6] text-[#175432] font-semibold text-xs rounded-lg transition-colors"
          >
            <ExternalLink size={14} />
            <span>View Public Page</span>
          </Link>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#175432] hover:bg-[#113f25] text-white font-semibold text-xs rounded-lg shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Plus size={15} />
            <span>Schedule New Dialogue</span>
          </Link>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="bg-white p-2 rounded-xl border border-[#e2ebe4] shadow-2xs flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('dialogues')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'dialogues'
              ? 'bg-[#175432] text-white shadow-xs'
              : 'text-[#4a5c50] hover:bg-[#f6f9f6]'
          }`}
        >
          <Calendar size={15} />
          <span>Scheduled Dialogues ({events.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('registrations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'registrations'
              ? 'bg-[#175432] text-white shadow-xs'
              : 'text-[#4a5c50] hover:bg-[#f6f9f6]'
          }`}
        >
          <Users size={15} />
          <span>Participant Join Requests ({registrations.length})</span>
          {pendingRegistrationsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#eab308] text-[#0f1d14]">
              {pendingRegistrationsCount} Pending
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('proposals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'proposals'
              ? 'bg-[#175432] text-white shadow-xs'
              : 'text-[#4a5c50] hover:bg-[#f6f9f6]'
          }`}
        >
          <MessageSquarePlus size={15} />
          <span>Proposed Dialogues ({proposals.length})</span>
          {pendingProposalsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#eab308] text-[#0f1d14]">
              {pendingProposalsCount} New
            </span>
          )}
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e2ebe4] shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5c6f62]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'dialogues'
                ? 'Search dialogues by title or venue...'
                : activeTab === 'registrations'
                ? 'Search participants by name, organization, or dialogue...'
                : 'Search proposed dialogues by title, topic, or proposer...'
            }
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#e2ebe4] focus:outline-none focus:ring-2 focus:ring-[#175432]"
          />
        </div>

        {activeTab === 'dialogues' && (
          <div className="flex items-center gap-1.5 bg-[#f6f9f6] p-1 rounded-lg border border-[#e2ebe4]">
            {(
              [
                { id: 'all', label: 'All Dialogues' },
                { id: 'active', label: 'Active Tab' },
                { id: 'closed', label: 'Closed Tab' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setDialogueStateFilter(f.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                  dialogueStateFilter === f.id
                    ? 'bg-white text-[#175432] shadow-2xs'
                    : 'text-[#5c6f62] hover:text-[#0f1d14]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'registrations' && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={registrationEventFilter}
              onChange={(e) => setRegistrationEventFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#e2ebe4] bg-white text-xs font-semibold text-[#0f1d14]"
            >
              <option value="all">All Dialogues</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.slug}>
                  {ev.title}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 bg-[#f6f9f6] p-1 rounded-lg border border-[#e2ebe4]">
              {(['all', 'pending', 'approved', 'declined'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setRegistrationStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold capitalize transition-colors cursor-pointer ${
                    registrationStatusFilter === st
                      ? 'bg-white text-[#175432] shadow-2xs'
                      : 'text-[#5c6f62] hover:text-[#0f1d14]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'proposals' && (
          <div className="flex items-center gap-1 bg-[#f6f9f6] p-1 rounded-lg border border-[#e2ebe4]">
            {(['all', 'pending', 'approved', 'declined'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setProposalStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold capitalize transition-colors cursor-pointer ${
                  proposalStatusFilter === st
                    ? 'bg-white text-[#175432] shadow-2xs'
                    : 'text-[#5c6f62] hover:text-[#0f1d14]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: DIALOGUES LIST */}
      {activeTab === 'dialogues' && (
        <div className="grid grid-cols-1 gap-4">
          {filteredEvents.map((ev) => {
            const closed = isDialogueClosed(ev)
            const docs = getDialogueDocuments(ev)
            const eventRegs = registrations.filter(
              (r) => r.event_id === ev.id || r.event_slug === ev.slug
            )
            const approvedRegs = eventRegs.filter((r) => r.status === 'approved').length
            const pendingRegs = eventRegs.filter((r) => r.status === 'pending').length

            return (
              <div
                key={ev.id}
                className="bg-white rounded-xl border border-[#e2ebe4] p-5 shadow-2xs hover:border-[#175432]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        ev.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {ev.status}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        closed
                          ? 'bg-gray-100 text-gray-700 border border-gray-200'
                          : 'bg-[#e8f5ee] text-[#175432] border border-[#bbf7d0]'
                      }`}
                    >
                      {closed ? <Lock size={11} /> : <Unlock size={11} />}
                      <span>{closed ? 'Closed Dialogue Tab' : 'Active Dialogue Tab'}</span>
                    </span>

                    <span className="text-xs font-semibold text-[#175432] flex items-center gap-1">
                      <Clock size={13} />
                      {formatDate(ev.starts_at)}
                    </span>

                    {docs.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                        <FileText size={11} />
                        <span>
                          {docs.length} PDF{docs.length > 1 ? 's' : ''} Attached
                        </span>
                      </span>
                    )}

                    {eventRegs.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setRegistrationEventFilter(ev.slug)
                          setActiveTab('registrations')
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 cursor-pointer"
                      >
                        <Users size={11} />
                        <span>
                          {approvedRegs} Approved
                          {pendingRegs > 0 ? ` · ${pendingRegs} Pending` : ''}
                        </span>
                      </button>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#0f1d14]">{ev.title}</h3>
                  <p className="text-xs text-[#5c6f62] line-clamp-2 leading-relaxed">
                    {ev.description.replace(/<[^>]*>?/gm, '')}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#4a5c50]">
                    {ev.venue && (
                      <span className="flex items-center gap-1.5 font-medium">
                        <MapPin size={13} className="text-[#175432]" />
                        {ev.venue}
                      </span>
                    )}
                    {ev.virtual_url && (
                      <span className="flex items-center gap-1.5 font-medium text-blue-700">
                        <Video size={13} />
                        Online Stream Configured
                      </span>
                    )}
                    {docs.map((d, i) => (
                      <a
                        key={i}
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#175432] hover:underline"
                      >
                        <FileText size={12} />
                        <span>{d.title}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#e2ebe4]">
                  <button
                    type="button"
                    disabled={busyId === ev.id}
                    onClick={() => handleToggleClosed(ev)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e2ebe4] text-xs font-semibold text-[#4a5c50] hover:text-[#0f1d14] hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                    title={
                      closed
                        ? 'Reopen and move to Active Dialogues tab'
                        : 'Mark concluded and move to Closed Dialogues tab'
                    }
                  >
                    {closed ? <Unlock size={13} /> : <Lock size={13} />}
                    <span>{closed ? 'Reopen Dialogue' : 'Mark Closed'}</span>
                  </button>

                  <Link
                    href={`/events/${ev.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e2ebe4] text-xs font-semibold text-[#4a5c50] hover:text-[#0f1d14] hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink size={13} />
                    <span>Preview</span>
                  </Link>
                  <Link
                    href={`/admin/events/${ev.id}/edit`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f0f6f1] text-xs font-semibold text-[#175432] hover:bg-[#e1ede4] transition-colors"
                  >
                    <Edit3 size={13} />
                    <span>Edit / Attach PDF</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(ev.id, ev.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )
          })}

          {filteredEvents.length === 0 && (
            <div className="bg-white rounded-xl border border-[#e2ebe4] p-12 text-center text-[#5c6f62]">
              <Calendar size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-[#0f1d14]">No dialogues found</p>
              <p className="text-xs mt-0.5">
                Adjust your filter or schedule a new policy dialogue.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PARTICIPANT JOIN REQUESTS (ADMIN APPROVAL) */}
      {activeTab === 'registrations' && (
        <div className="space-y-4">
          {filteredRegistrations.map((reg) => (
            <div
              key={reg.id}
              className="bg-white rounded-xl border border-[#e2ebe4] p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      reg.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : reg.status === 'declined'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {reg.status === 'pending' ? 'Pending Admin Approval' : reg.status}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f0f6f1] text-[#175432]">
                    {reg.attendance_mode}
                  </span>

                  <span className="text-xs text-[#5c6f62]">
                    Requested {formatDate(reg.created_at)}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#175432]">
                    Dialogue: {reg.event_title}
                  </div>
                  <h3 className="text-base font-bold text-[#0f1d14] mt-0.5">
                    {reg.participant_name}
                    {reg.role_title ? (
                      <span className="text-xs font-normal text-[#5c6f62]">
                        {' '}
                        — {reg.role_title}
                      </span>
                    ) : null}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#4a5c50]">
                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    <Building2 size={13} className="text-[#175432]" />
                    {reg.organization}
                  </span>
                  <a
                    href={`mailto:${reg.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-[#175432] underline"
                  >
                    <Mail size={13} />
                    {reg.email}
                  </a>
                  <span className="inline-flex items-center gap-1.5">
                    <Phone size={13} />
                    {reg.phone}
                  </span>
                </div>

                {reg.contribution_note && (
                  <div className="p-3 rounded-lg bg-[#f6f9f6] border border-[#e2ebe4] text-xs text-[#2d3f33] leading-relaxed">
                    <strong className="font-bold text-[#0f1d14]">Expected Contribution: </strong>
                    {reg.contribution_note}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#e2ebe4]">
                {reg.status !== 'approved' && (
                  <button
                    type="button"
                    disabled={busyId === reg.id}
                    onClick={() => handleRegistrationStatus(reg, 'approved')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#175432] hover:bg-[#113f25] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Check size={14} />
                    <span>Approve to Join</span>
                  </button>
                )}

                {reg.status !== 'declined' && (
                  <button
                    type="button"
                    disabled={busyId === reg.id}
                    onClick={() => handleRegistrationStatus(reg, 'declined')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <XCircle size={14} />
                    <span>Decline</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={busyId === reg.id}
                  onClick={() => handleDeleteRegistration(reg)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}

          {filteredRegistrations.length === 0 && (
            <div className="bg-white rounded-xl border border-[#e2ebe4] p-12 text-center text-[#5c6f62]">
              <Users size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-[#0f1d14]">
                No participant join requests found
              </p>
              <p className="text-xs mt-0.5">
                When stakeholders request to join a specific policy dialogue on the public site, their requests appear here for admin approval.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROPOSED DIALOGUES FROM PUBLIC */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          {filteredProposals.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-xl border border-[#e2ebe4] p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-2.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      prop.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : prop.status === 'declined'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {prop.status === 'pending' ? 'Pending Secretariat Review' : prop.status}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f0f6f1] text-[#175432]">
                    {prop.topic_area}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                    {prop.proposed_format}
                  </span>

                  <span className="text-xs text-[#5c6f62]">
                    Submitted {formatDate(prop.created_at)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0f1d14]">{prop.title}</h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#4a5c50]">
                  <span className="font-bold text-[#0f1d14]">
                    Proposed by: {prop.proposer_name}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Building2 size={13} className="text-[#175432]" />
                    {prop.organization}
                  </span>
                  <a
                    href={`mailto:${prop.email}`}
                    className="inline-flex items-center gap-1 hover:text-[#175432] underline"
                  >
                    <Mail size={13} />
                    {prop.email}
                  </a>
                  <span className="inline-flex items-center gap-1">
                    <Phone size={13} />
                    {prop.phone}
                  </span>
                  {prop.preferred_timeframe && (
                    <span className="inline-flex items-center gap-1 text-[#175432] font-semibold">
                      <Clock size={13} />
                      Target: {prop.preferred_timeframe}
                    </span>
                  )}
                </div>

                <div className="p-3.5 rounded-lg bg-[#f6f9f6] border border-[#e2ebe4] text-xs text-[#2d3f33] leading-relaxed whitespace-pre-line">
                  {prop.description}
                </div>

                {prop.document_url && (
                  <div className="pt-1">
                    <a
                      href={prop.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors"
                    >
                      <FileText size={14} />
                      <span>
                        View Attached Concept Note PDF ({prop.document_name || 'Document.pdf'})
                      </span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#e2ebe4]">
                {!prop.published_event_id && (
                  <button
                    type="button"
                    disabled={busyId === prop.id}
                    onClick={() => handlePublishProposalAsEvent(prop)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#175432] hover:bg-[#113f25] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles size={14} />
                    <span>Approve & Publish Dialogue</span>
                  </button>
                )}

                {prop.status === 'pending' && (
                  <button
                    type="button"
                    disabled={busyId === prop.id}
                    onClick={() => handleProposalStatus(prop, 'approved')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Check size={14} />
                    <span>Approve Only</span>
                  </button>
                )}

                {prop.status !== 'declined' && (
                  <button
                    type="button"
                    disabled={busyId === prop.id}
                    onClick={() => handleProposalStatus(prop, 'declined')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <XCircle size={14} />
                    <span>Decline</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={busyId === prop.id}
                  onClick={() => handleDeleteProposal(prop)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}

          {filteredProposals.length === 0 && (
            <div className="bg-white rounded-xl border border-[#e2ebe4] p-12 text-center text-[#5c6f62]">
              <MessageSquarePlus size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-[#0f1d14]">
                No public dialogue proposals found
              </p>
              <p className="text-xs mt-0.5">
                Proposals submitted by stakeholders via the &ldquo;Propose a Policy Dialogue&rdquo; form on <code>/events</code> will appear here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
