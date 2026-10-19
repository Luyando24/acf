'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Star,
} from 'lucide-react'
import { formatDate, formatFileSize } from '@/lib/utils/formatters'

export interface PublicationItem {
  id: string
  slug: string
  title: string
  summary: string
  category_id?: string | null
  publication_categories?: { name: string } | null
  category_name?: string
  published_on: string
  file_path: string
  file_size?: number
  download_count?: number
  is_featured?: boolean
  status: 'published' | 'draft' | 'archived'
}

const CATEGORIES = [
  'Policy Briefs',
  'Research Reports',
  'Policy Advisory Notes',
  'Annual Reports',
  'Parliamentary Submissions',
  'Workshop Reports',
]

export default function PublicationManager({
  initialPublications,
}: {
  initialPublications: PublicationItem[]
}) {
  const [publications, setPublications] = useState<PublicationItem[]>(initialPublications)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this publication?')) return

    try {
      await fetch(`/api/admin/crud/publications?id=${id}`, { method: 'DELETE' })
      setPublications((prev) => prev.filter((item) => item.id !== id))
      showNotification('Publication deleted successfully.')
    } catch {
      setPublications((prev) => prev.filter((item) => item.id !== id))
      showNotification('Publication removed.')
    }
  }

  // Filtered publications
  const filtered = publications.filter((pub) => {
    const matchesSearch =
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.slug.toLowerCase().includes(searchQuery.toLowerCase())

    const cat = pub.category_name || pub.publication_categories?.name || 'Policy Briefs'
    const matchesCategory = categoryFilter === 'ALL' || cat === categoryFilter
    const matchesStatus = statusFilter === 'ALL' || pub.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalDownloads = publications.reduce((acc, p) => acc + (p.download_count || 0), 0)
  const featuredCount = publications.filter((p) => p.is_featured).length

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

      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-[#0f1d14] tracking-tight">
            Publications & Knowledge Repository
          </h1>
          <p className="text-xs text-[#5c6f62] mt-0.5">
            Manage institutional research reports, policy advisory notes, and track downloads.
          </p>
        </div>

        <Link
          href="/admin/publications/new"
          className="px-4 py-2.5 bg-[#175432] hover:bg-[#114227] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Upload Publication</span>
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e2ebe4] shadow-xs">
          <div className="text-[11px] font-bold text-[#5c6f62] uppercase tracking-wider">Total Publications</div>
          <div className="text-2xl font-black text-[#0f1d14] mt-1">{publications.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2ebe4] shadow-xs">
          <div className="text-[11px] font-bold text-[#5c6f62] uppercase tracking-wider">Total Policy Downloads</div>
          <div className="text-2xl font-black text-[#175432] mt-1">{totalDownloads}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2ebe4] shadow-xs">
          <div className="text-[11px] font-bold text-[#5c6f62] uppercase tracking-wider">Featured on Home</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{featuredCount}</div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2ebe4] shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-[#5c6f62]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, keyword, or summary..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#f6f9f6] border border-[#e2ebe4] rounded-xl text-xs font-semibold text-[#0f1d14] focus:outline-none focus:ring-2 focus:ring-[#175432]"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
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

      {/* Publications Table */}
      <div className="bg-white rounded-3xl border border-[#e2ebe4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f9f6] text-[#5c6f62] uppercase tracking-wider font-bold border-b border-[#e2ebe4]">
              <tr>
                <th className="py-4 px-6">Document Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Size</th>
                <th className="py-4 px-6">Downloads</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2ebe4]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#5c6f62]">
                    No publications found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((pub) => {
                  const cat = pub.category_name || pub.publication_categories?.name || 'Policy Brief'
                  return (
                    <tr key={pub.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-6 max-w-sm">
                        <div className="font-bold text-[#0f1d14] flex items-center gap-2">
                          <span>{pub.title}</span>
                          {pub.is_featured && (
                            <span className="shrink-0 p-1 bg-amber-50 rounded-md text-amber-600" title="Featured on home">
                              <Star size={11} className="fill-amber-500 text-amber-500" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#5c6f62] line-clamp-1 mt-0.5">
                          {pub.summary}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-[#175432] whitespace-nowrap">
                        {cat}
                      </td>
                      <td className="py-4 px-6 text-[#5c6f62] whitespace-nowrap">
                        {formatDate(pub.published_on)}
                      </td>
                      <td className="py-4 px-6 text-[#5c6f62] whitespace-nowrap">
                        {formatFileSize(pub.file_size)}
                      </td>
                      <td className="py-4 px-6 font-bold text-[#0f1d14]">
                        {pub.download_count || 0}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            pub.status === 'published'
                              ? 'bg-[#f0f6f1] text-[#175432]'
                              : pub.status === 'draft'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {pub.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap space-x-1">
                        <Link
                          href={`/publications/${pub.slug}`}
                          target="_blank"
                          className="p-1.5 inline-flex items-center text-[#5c6f62] hover:text-[#175432] transition-colors rounded-lg hover:bg-gray-100"
                          title="Preview public paper"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <Link
                          href={`/admin/publications/${pub.id}/edit`}
                          className="p-1.5 inline-flex items-center text-[#175432] hover:bg-[#f0f6f1] transition-colors rounded-lg cursor-pointer"
                          title="Edit publication"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(pub.id)}
                          className="p-1.5 inline-flex items-center text-rose-600 hover:bg-rose-50 transition-colors rounded-lg cursor-pointer"
                          title="Delete publication"
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
