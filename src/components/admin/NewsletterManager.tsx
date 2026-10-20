'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Download,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  UserX,
} from 'lucide-react'
import { formatDate } from '@/lib/utils/formatters'

export interface SubscriberItem {
  id: string
  email: string
  status: 'subscribed' | 'unsubscribed' | 'pending'
  source: string
  consent_at?: string | null
  confirmed_at?: string | null
  created_at: string
}

export default function NewsletterManager({
  initialSubscribers,
}: {
  initialSubscribers: SubscriberItem[]
}) {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>(initialSubscribers)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'subscribed' | 'unsubscribed' | 'pending'>('ALL')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  const toggleStatus = async (sub: SubscriberItem) => {
    const updatedStatus = sub.status === 'subscribed' ? 'unsubscribed' : 'subscribed'
    setSubscribers((prev) =>
      prev.map((item) => (item.id === sub.id ? { ...item, status: updatedStatus } : item))
    )

    try {
      await fetch('/api/admin/crud/newsletter', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sub.id, status: updatedStatus }),
      })
      showNotification(`Subscription status updated: ${updatedStatus}`)
    } catch {
      // Local state kept
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently remove this newsletter subscriber?')) return

    try {
      await fetch(`/api/admin/crud/newsletter?id=${id}`, { method: 'DELETE' })
      setSubscribers((prev) => prev.filter((item) => item.id !== id))
      showNotification('Subscriber removed successfully.')
    } catch {
      setSubscribers((prev) => prev.filter((item) => item.id !== id))
      showNotification('Subscriber deleted.')
    }
  }

  const filtered = subscribers.filter((sub) => {
    const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const subscribedCount = subscribers.filter((s) => s.status === 'subscribed').length

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
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-[#5c6f62] mt-0.5">
            Stakeholder audience receiving agricultural policy alerts and sector bulletins.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/api/admin/export/newsletter"
            download
            className="px-4 py-2.5 bg-[#f0f6f1] text-[#175432] hover:bg-[#e2ebe4] text-sm font-bold rounded-md transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </a>

          <Link
            href="/admin/newsletter/new"
            className="px-4 py-2.5 bg-[#175432] hover:bg-[#114227] text-white text-sm font-bold rounded-md shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Add Subscriber</span>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#e2ebe4] shadow-xs">
          <div className="text-xs font-bold text-[#5c6f62] uppercase tracking-wider">Total Enrolled</div>
          <div className="text-2xl font-black text-[#0f1d14] mt-1">{subscribers.length}</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e2ebe4] shadow-xs">
          <div className="text-xs font-bold text-[#5c6f62] uppercase tracking-wider">Active Subscribed</div>
          <div className="text-2xl font-black text-[#175432] mt-1">{subscribedCount}</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e2ebe4] shadow-xs">
          <div className="text-xs font-bold text-[#5c6f62] uppercase tracking-wider">Unsubscribed</div>
          <div className="text-2xl font-black text-[#5c6f62] mt-1">
            {subscribers.filter((s) => s.status === 'unsubscribed').length}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-lg border border-[#e2ebe4] shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-[#5c6f62]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subscriber by email address..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-[#e2ebe4] text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 bg-[#f6f9f6] border border-[#e2ebe4] rounded-md text-sm font-semibold text-[#0f1d14] focus:outline-none focus:ring-2 focus:ring-[#175432]"
        >
          <option value="ALL">All Statuses</option>
          <option value="subscribed">Subscribed Only</option>
          <option value="unsubscribed">Unsubscribed</option>
          <option value="pending">Pending Opt-In</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#e2ebe4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f6f9f6] text-[#5c6f62] uppercase tracking-wider font-bold border-b border-[#e2ebe4]">
              <tr>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Source Channel</th>
                <th className="py-4 px-6">Enrolled Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2ebe4]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#5c6f62]">
                    No subscribers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#0f1d14]">
                      {sub.email}
                    </td>
                    <td className="py-4 px-6 text-[#175432] font-semibold capitalize">
                      {sub.source.replace(/_/g, ' ')}
                    </td>
                    <td className="py-4 px-6 text-[#5c6f62]">
                      {formatDate(sub.created_at)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          sub.status === 'subscribed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-1">
                      <button
                        type="button"
                        onClick={() => toggleStatus(sub)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                          sub.status === 'subscribed'
                            ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                        title="Toggle subscription status"
                      >
                        {sub.status === 'subscribed' ? (
                          <>
                            <UserX size={12} />
                            <span>Unsubscribe</span>
                          </>
                        ) : (
                          <>
                            <UserCheck size={12} />
                            <span>Subscribe</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(sub.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 transition-colors rounded-lg cursor-pointer inline-flex items-center"
                        title="Delete Subscriber"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
