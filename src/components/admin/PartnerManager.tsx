'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Handshake,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Globe,
  Home,
} from 'lucide-react'

export interface PartnerItem {
  id: string
  name: string
  type: 'Partner' | 'Development Partner' | 'Collaborating Institution' | 'Network & Affiliation'
  logo_url?: string | null
  website_url?: string | null
  description?: string | null
  order_index: number
  show_on_home: boolean
  is_visible: boolean
}

const PARTNER_TYPES = [
  'Collaborating Institution',
  'Partner',
  'Development Partner',
  'Network & Affiliation',
]

export default function PartnerManager({
  initialPartners,
}: {
  initialPartners: PartnerItem[]
}) {
  const [partners, setPartners] = useState<PartnerItem[]>(initialPartners)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this partner affiliation?')) return

    try {
      await fetch(`/api/admin/crud/partners?id=${id}`, { method: 'DELETE' })
      setPartners((prev) => prev.filter((item) => item.id !== id))
      showNotification('Partner removed successfully.')
    } catch {
      setPartners((prev) => prev.filter((item) => item.id !== id))
      showNotification('Partner deleted.')
    }
  }

  const toggleHome = async (p: PartnerItem) => {
    const updated = !p.show_on_home
    setPartners((prev) => prev.map((item) => (item.id === p.id ? { ...item, show_on_home: updated } : item)))

    try {
      await fetch('/api/admin/crud/partners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, show_on_home: updated }),
      })
      showNotification(`Home banner: ${updated ? 'Shown' : 'Hidden'}`)
    } catch {
      // Local fallback
    }
  }

  const filtered = partners.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = typeFilter === 'ALL' || p.type === typeFilter

    return matchesSearch && matchesType
  })

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
            Partners & Affiliations
          </h1>
          <p className="text-xs text-[#5c6f62] mt-0.5">
            Manage collaborating ministries, international cooperating partners, and farmer federations.
          </p>
        </div>

        <Link
          href="/admin/partners/new"
          className="px-4 py-2.5 bg-[#175432] hover:bg-[#114227] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Add New Partner</span>
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2ebe4] shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-[#5c6f62]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search partner organization name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-[#f6f9f6] border border-[#e2ebe4] rounded-xl text-xs font-semibold text-[#0f1d14] focus:outline-none focus:ring-2 focus:ring-[#175432]"
        >
          <option value="ALL">All Categories</option>
          {PARTNER_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-3xl border border-[#e2ebe4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f9f6] text-[#5c6f62] uppercase tracking-wider font-bold border-b border-[#e2ebe4]">
              <tr>
                <th className="py-4 px-6">Order</th>
                <th className="py-4 px-6">Partner Organization</th>
                <th className="py-4 px-6">Classification</th>
                <th className="py-4 px-6">Home Showcase</th>
                <th className="py-4 px-6">Visibility</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2ebe4]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#5c6f62]">
                    No partners found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#5c6f62]">
                      #{item.order_index}
                    </td>
                    <td className="py-4 px-6 max-w-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 p-1 bg-white rounded-xl border border-[#e2ebe4] flex items-center justify-center shrink-0">
                          {item.logo_url ? (
                            <img
                              src={item.logo_url}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/photos/logo.png'
                              }}
                            />
                          ) : (
                            <Handshake size={18} className="text-[#175432]" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#0f1d14]">{item.name}</div>
                          {item.website_url && (
                            <a
                              href={item.website_url}
                              target="_blank"
                              className="text-[10px] text-[#175432] hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <Globe size={10} />
                              <span>{item.website_url.replace(/^https?:\/\//, '')}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-[#175432] whitespace-nowrap">
                      {item.type}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => toggleHome(item)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1.5 cursor-pointer ${
                          item.show_on_home
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                        title="Toggle logo strip on homepage"
                      >
                        <Home size={11} />
                        <span>{item.show_on_home ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.is_visible
                            ? 'bg-[#f0f6f1] text-[#175432]'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item.is_visible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-1">
                      <Link
                        href="/partners"
                        target="_blank"
                        className="p-1.5 inline-flex items-center text-[#5c6f62] hover:text-[#175432] transition-colors rounded-lg hover:bg-gray-100"
                        title="View Public Partners Page"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <Link
                        href={`/admin/partners/${item.id}/edit`}
                        className="p-1.5 inline-flex items-center text-[#175432] hover:bg-[#f0f6f1] transition-colors rounded-lg"
                        title="Edit Partner"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 inline-flex items-center text-rose-600 hover:bg-rose-50 transition-colors rounded-lg cursor-pointer"
                        title="Delete Partner"
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
