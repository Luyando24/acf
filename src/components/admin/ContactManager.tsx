'use client'

import React, { useState } from 'react'
import {
  MessageSquare,
  Mail,
  Phone,
  Search,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Check,
  RotateCcw,
  Reply,
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils/formatters'

export interface ContactMessageItem {
  id: string
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export default function ContactManager({
  initialMessages,
}: {
  initialMessages: ContactMessageItem[]
}) {
  const [messages, setMessages] = useState<ContactMessageItem[]>(initialMessages)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  const toggleReadStatus = async (msg: ContactMessageItem) => {
    const updatedStatus = !msg.is_read
    setMessages((prev) =>
      prev.map((item) => (item.id === msg.id ? { ...item, is_read: updatedStatus } : item))
    )

    try {
      await fetch('/api/admin/crud/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id, is_read: updatedStatus }),
      })
      showNotification(updatedStatus ? 'Marked inquiry as read.' : 'Marked inquiry as unread.')
    } catch {
      // Local state kept
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this contact inquiry?')) return

    try {
      await fetch(`/api/admin/crud/contacts?id=${id}`, { method: 'DELETE' })
      setMessages((prev) => prev.filter((item) => item.id !== id))
      showNotification('Inquiry deleted successfully.')
    } catch {
      setMessages((prev) => prev.filter((item) => item.id !== id))
      showNotification('Message removed.')
    }
  }

  const filtered = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterType === 'ALL' ||
      (filterType === 'UNREAD' && !msg.is_read) ||
      (filterType === 'READ' && msg.is_read)

    return matchesSearch && matchesFilter
  })

  const unreadCount = messages.filter((m) => !m.is_read).length

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Notification */}
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

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-[#0f1d14] tracking-tight">
            Contact Inquiries & Inbox
          </h1>
          <p className="text-sm text-[#5c6f62] mt-0.5">
            Public enquiries submitted via the institutional website contact form.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#5c6f62]">Unread Inquiries:</span>
          <span className="px-3 py-1 bg-amber-50 text-amber-800 font-extrabold rounded-full text-sm border border-amber-200">
            {unreadCount} New
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-lg border border-[#e2ebe4] shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-[#5c6f62]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries by sender, email, or message text..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-[#e2ebe4] text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 border border-[#e2ebe4] p-1 rounded-md bg-[#f6f9f6]">
          <button
            type="button"
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              filterType === 'ALL' ? 'bg-white text-[#175432] shadow-xs' : 'text-[#5c6f62]'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('UNREAD')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              filterType === 'UNREAD' ? 'bg-white text-amber-700 shadow-xs' : 'text-[#5c6f62]'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('READ')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              filterType === 'READ' ? 'bg-white text-[#175432] shadow-xs' : 'text-[#5c6f62]'
            }`}
          >
            Read ({messages.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-lg border border-[#e2ebe4] text-center text-sm text-[#5c6f62]">
            No contact messages match your selected filter.
          </div>
        ) : (
          filtered.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-lg border transition-all ${
                !msg.is_read
                  ? 'bg-white border-[#175432] shadow-sm'
                  : 'bg-white/80 border-[#e2ebe4] shadow-xs opacity-90'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {!msg.is_read ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2da44e]" title="Unread Message" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-300" title="Read Message" />
                  )}
                  <h2 className="text-base font-bold text-[#0f1d14]">{msg.subject}</h2>
                </div>
                <span className="text-xs text-[#5c6f62]">
                  {formatDateTime(msg.created_at)}
                </span>
              </div>

              <p className="text-sm sm:text-sm text-[#3b4d41] leading-relaxed mb-4 bg-[#f6f9f6] p-4 rounded-md border border-[#e2ebe4]/70">
                {msg.message}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm pt-2 border-t border-[#e2ebe4]/60">
                <div className="flex flex-wrap items-center gap-3 text-[#5c6f62]">
                  <span className="font-bold text-[#0f1d14]">{msg.name}</span>
                  <span>•</span>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-[#175432] font-semibold hover:underline flex items-center gap-1"
                  >
                    <Mail size={13} />
                    <span>{msg.email}</span>
                  </a>
                  {msg.phone && (
                    <>
                      <span>•</span>
                      <a
                        href={`tel:${msg.phone}`}
                        className="hover:text-[#175432] flex items-center gap-1"
                      >
                        <Phone size={13} />
                        <span>{msg.phone}</span>
                      </a>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="px-3 py-1.5 bg-[#175432] hover:bg-[#114227] text-white text-sm font-bold rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <Reply size={13} />
                    <span>Reply</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => toggleReadStatus(msg)}
                    className="px-3 py-1.5 bg-[#f0f6f1] text-[#175432] hover:bg-[#e2ebe4] text-sm font-bold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {msg.is_read ? (
                      <>
                        <RotateCcw size={12} />
                        <span>Mark Unread</span>
                      </>
                    ) : (
                      <>
                        <Check size={12} />
                        <span>Mark Read</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 transition-colors rounded-lg cursor-pointer"
                    title="Delete Inquiry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
