'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  MapPin,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Video,
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils/formatters'

export interface EventItem {
  id: string
  slug: string
  title: string
  description?: string
  starts_at: string
  ends_at?: string | null
  venue?: string | null
  virtual_url?: string | null
  registration_url?: string | null
  featured_image?: string | null
  status: 'published' | 'draft' | 'archived'
}

export default function EventManager({
  initialEvents,
}: {
  initialEvents: EventItem[]
}) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents)
  const [searchQuery, setSearchQuery] = useState('')
  const [timingFilter, setTimingFilter] = useState<'ALL' | 'UPCOMING' | 'PAST'>('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this event?')) return

    try {
      await fetch(`/api/admin/crud/events?id=${id}`, { method: 'DELETE' })
      setEvents((prev) => prev.filter((item) => item.id !== id))
      showNotification('Event removed successfully.')
    } catch {
      setEvents((prev) => prev.filter((item) => item.id !== id))
      showNotification('Event deleted.')
    }
  }

  const now = new Date()

  const filtered = events.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.venue && item.venue.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const eventDate = new Date(item.starts_at)
    const isUpcoming = eventDate >= now
    const matchesTiming =
      timingFilter === 'ALL' ||
      (timingFilter === 'UPCOMING' && isUpcoming) ||
      (timingFilter === 'PAST' && !isUpcoming)

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter

    return matchesSearch && matchesTiming && matchesStatus
  })

  const upcomingCount = events.filter((e) => new Date(e.starts_at) >= now).length
  const pastCount = events.filter((e) => new Date(e.starts_at) < now).length

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Notification */}
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

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-[#0f1d14] tracking-tight">
            Dialogue Events & Forums
          </h1>
          <p className="text-xs text-[#5c6f62] mt-0.5">
            Schedule policy roundtables, technical workshops, and national symposiums.
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="px-4 py-2.5 bg-[#175432] hover:bg-[#114227] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Schedule New Event</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e2ebe4] shadow-xs">
          <div className="text-[11px] font-bold text-[#5c6f62] uppercase tracking-wider">Total Convenings</div>
          <div className="text-2xl font-black text-[#0f1d14] mt-1">{events.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2ebe4] shadow-xs">
          <div className="text-[11px] font-bold text-[#5c6f62] uppercase tracking-wider">Upcoming Forums</div>
          <div className="text-2xl font-black text-[#175432] mt-1">{upcomingCount}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2ebe4] shadow-xs">
          <div className="text-[11px] font-bold text-[#5c6f62] uppercase tracking-wider">Past Dialogues</div>
          <div className="text-2xl font-black text-[#5c6f62] mt-1">{pastCount}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2ebe4] shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-[#5c6f62]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by event title, venue, or topics..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={timingFilter}
            onChange={(e) => setTimingFilter(e.target.value as any)}
            className="px-3 py-2 bg-[#f6f9f6] border border-[#e2ebe4] rounded-xl text-xs font-semibold text-[#0f1d14] focus:outline-none focus:ring-2 focus:ring-[#175432]"
          >
            <option value="ALL">All Dates (Upcoming & Past)</option>
            <option value="UPCOMING">Upcoming Only</option>
            <option value="PAST">Past Dialogues</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#f6f9f6] border border-[#e2ebe4] rounded-xl text-xs font-semibold text-[#0f1d14] focus:outline-none focus:ring-2 focus:ring-[#175432]"
          >
            <option value="ALL">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-3xl border border-[#e2ebe4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f9f6] text-[#5c6f62] uppercase tracking-wider font-bold border-b border-[#e2ebe4]">
              <tr>
                <th className="py-4 px-6">Event Title</th>
                <th className="py-4 px-6">Date & Time</th>
                <th className="py-4 px-6">Venue / Format</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2ebe4]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#5c6f62]">
                    No events found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((evt) => {
                  const isUpcoming = new Date(evt.starts_at) >= now
                  return (
                    <tr key={evt.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-6 max-w-sm">
                        <div className="font-bold text-[#0f1d14]">
                          {evt.title}
                        </div>
                        {evt.description && (
                          <div className="text-[11px] text-[#5c6f62] line-clamp-1 mt-0.5">
                            {evt.description}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-semibold text-[#175432]">
                          {formatDateTime(evt.starts_at)}
                        </div>
                        <div className="text-[10px] text-[#5c6f62] mt-0.5">
                          {isUpcoming ? (
                            <span className="text-emerald-700 font-bold">Upcoming</span>
                          ) : (
                            <span>Past Event</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[#5c6f62] max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-[#175432] shrink-0" />
                          <span className="truncate">{evt.venue || 'Lusaka Secretariat'}</span>
                        </div>
                        {evt.virtual_url && (
                          <div className="flex items-center gap-1 text-[10px] text-blue-700 mt-0.5">
                            <Video size={10} />
                            <span>Virtual link available</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            evt.status === 'published'
                              ? 'bg-[#f0f6f1] text-[#175432]'
                              : evt.status === 'draft'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {evt.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap space-x-1">
                        <Link
                          href={`/events/${evt.slug}`}
                          target="_blank"
                          className="p-1.5 inline-flex items-center text-[#5c6f62] hover:text-[#175432] transition-colors rounded-lg hover:bg-gray-100"
                          title="View Live Page"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <Link
                          href={`/admin/events/${evt.id}/edit`}
                          className="p-1.5 inline-flex items-center text-[#175432] hover:bg-[#f0f6f1] transition-colors rounded-lg cursor-pointer"
                          title="Edit Event"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(evt.id)}
                          className="p-1.5 inline-flex items-center text-rose-600 hover:bg-rose-50 transition-colors rounded-lg cursor-pointer"
                          title="Delete Event"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
