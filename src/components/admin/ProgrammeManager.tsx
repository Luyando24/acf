'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sprout,
  Scale,
  BookOpen,
  Users,
  Shield,
  Award,
} from 'lucide-react'

export interface ProgrammeItem {
  id: string
  slug: string
  title: string
  summary: string
  body?: string
  cover_image?: string | null
  icon?: string | null
  order_index: number
  status: 'published' | 'draft' | 'archived'
}

const ICON_OPTIONS = [
  { name: 'Sprout', icon: Sprout, label: 'Sprout / Agriculture' },
  { name: 'Scale', icon: Scale, label: 'Scale / Policy & Law' },
  { name: 'BookOpen', icon: BookOpen, label: 'Book / Evidence & Research' },
  { name: 'Users', icon: Users, label: 'Users / Multi-Stakeholder' },
  { name: 'Shield', icon: Shield, label: 'Shield / Tenure & Protection' },
  { name: 'Award', icon: Award, label: 'Award / Excellence' },
]

export default function ProgrammeManager({
  initialProgrammes,
}: {
  initialProgrammes: ProgrammeItem[]
}) {
  const [programmes, setProgrammes] = useState<ProgrammeItem[]>(initialProgrammes)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this thematic programme area?')) return

    try {
      await fetch(`/api/admin/crud/programmes?id=${id}`, { method: 'DELETE' })
      setProgrammes((prev) => prev.filter((item) => item.id !== id))
      showNotification('Programme pillar deleted.')
    } catch {
      setProgrammes((prev) => prev.filter((item) => item.id !== id))
      showNotification('Programme removed.')
    }
  }

  const filtered = programmes.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const renderIcon = (iconName?: string | null) => {
    const found = ICON_OPTIONS.find((i) => i.name === iconName)
    const IconComp = found ? found.icon : Sprout
    return <IconComp size={16} className="text-[#175432]" />
  }

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
            Thematic Programmes (Our Work)
          </h1>
          <p className="text-xs text-[#5c6f62] mt-0.5">
            Manage institutional strategic programmes, thematic pillars, and research agendas.
          </p>
        </div>

        <Link
          href="/admin/programmes/new"
          className="px-4 py-2.5 bg-[#175432] hover:bg-[#114227] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Add Programme Area</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2ebe4] shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-[#5c6f62]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search programme pillars..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
          />
        </div>

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

      {/* Programmes Table */}
      <div className="bg-white rounded-3xl border border-[#e2ebe4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f9f6] text-[#5c6f62] uppercase tracking-wider font-bold border-b border-[#e2ebe4]">
              <tr>
                <th className="py-4 px-6">Order</th>
                <th className="py-4 px-6">Thematic Pillar</th>
                <th className="py-4 px-6">Icon</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2ebe4]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#5c6f62]">
                    No programmes found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#5c6f62]">
                      #{item.order_index}
                    </td>
                    <td className="py-4 px-6 max-w-md">
                      <div className="font-bold text-[#0f1d14]">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#5c6f62] line-clamp-1 mt-0.5">
                        {item.summary}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="p-2 bg-[#f0f6f1] rounded-xl w-fit">
                        {renderIcon(item.icon)}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.status === 'published'
                            ? 'bg-[#f0f6f1] text-[#175432]'
                            : item.status === 'draft'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-1">
                      <Link
                        href={`/our-work`}
                        target="_blank"
                        className="p-1.5 inline-flex items-center text-[#5c6f62] hover:text-[#175432] transition-colors rounded-lg hover:bg-gray-100"
                        title="View Public Work Area"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <Link
                        href={`/admin/programmes/${item.id}/edit`}
                        className="p-1.5 inline-flex items-center text-[#175432] hover:bg-[#f0f6f1] transition-colors rounded-lg"
                        title="Edit Programme"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 inline-flex items-center text-rose-600 hover:bg-rose-50 transition-colors rounded-lg cursor-pointer"
                        title="Delete Programme"
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
