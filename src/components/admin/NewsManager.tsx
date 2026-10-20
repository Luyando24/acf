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
import { formatDate } from '@/lib/utils/formatters'

export interface NewsItem {
  id: string
  slug: string
  title: string
  category?: string
  excerpt?: string
  body?: string
  featured_image?: string | null
  published_at: string
  status: 'published' | 'scheduled' | 'draft' | 'archived'
  is_featured?: boolean
  author_name?: string
}

const NEWS_CATEGORIES = [
  'Sector News',
  'Policy Dialogue',
  'Secretariat Updates',
  'Press Release',
  'Field Insights',
]

export default function NewsManager({
  initialNews,
}: {
  initialNews: NewsItem[]
}) {
  const [articles, setArticles] = useState<NewsItem[]>(initialNews)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this news article?')) return

    try {
      await fetch(`/api/admin/crud/news?id=${id}`, { method: 'DELETE' })
      setArticles((prev) => prev.filter((item) => item.id !== id))
      showNotification('Article removed successfully.')
    } catch {
      setArticles((prev) => prev.filter((item) => item.id !== id))
      showNotification('Article deleted.')
    }
  }

  const filtered = articles.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.excerpt && item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

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
            News & Press Releases
          </h1>
          <p className="text-sm text-[#5c6f62] mt-0.5">
            Publish institutional press releases, sector updates, and policy dialogues.
          </p>
        </div>

        <Link
          href="/admin/news/new"
          className="px-4 py-2.5 bg-[#175432] hover:bg-[#114227] text-white text-sm font-bold rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#e2ebe4] shadow-xs">
          <div className="text-xs font-bold text-[#5c6f62] uppercase tracking-wider">Total Articles</div>
          <div className="text-2xl font-black text-[#0f1d14] mt-1">{articles.length}</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e2ebe4] shadow-xs">
          <div className="text-xs font-bold text-[#5c6f62] uppercase tracking-wider">Published Active</div>
          <div className="text-2xl font-black text-[#175432] mt-1">
            {articles.filter((a) => a.status === 'published').length}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e2ebe4] shadow-xs">
          <div className="text-xs font-bold text-[#5c6f62] uppercase tracking-wider">Featured Stories</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {articles.filter((a) => a.is_featured).length}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-lg border border-[#e2ebe4] shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-[#5c6f62]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news by title or content keywords..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-[#e2ebe4] text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#f6f9f6] border border-[#e2ebe4] rounded-md text-sm font-semibold text-[#0f1d14] focus:outline-none focus:ring-2 focus:ring-[#175432]"
          >
            <option value="ALL">All Categories</option>
            {NEWS_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#f6f9f6] border border-[#e2ebe4] rounded-md text-sm font-semibold text-[#0f1d14] focus:outline-none focus:ring-2 focus:ring-[#175432]"
          >
            <option value="ALL">All Statuses</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#e2ebe4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f6f9f6] text-[#5c6f62] uppercase tracking-wider font-bold border-b border-[#e2ebe4]">
              <tr>
                <th className="py-4 px-6">Article Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Published Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2ebe4]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#5c6f62]">
                    No articles found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 max-w-md">
                      <div className="font-bold text-[#0f1d14] flex items-center gap-2">
                        <span>{item.title}</span>
                        {item.is_featured && (
                          <span className="shrink-0 p-1 bg-amber-50 rounded-md text-amber-600" title="Featured Story">
                            <Star size={11} className="fill-amber-500 text-amber-500" />
                          </span>
                        )}
                      </div>
                      {item.excerpt && (
                        <div className="text-xs text-[#5c6f62] line-clamp-1 mt-0.5">
                          {item.excerpt}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-[#175432] font-semibold whitespace-nowrap">
                      {item.category || 'Sector News'}
                    </td>
                    <td className="py-4 px-6 text-[#5c6f62] whitespace-nowrap">
                      {formatDate(item.published_at)}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          item.status === 'published'
                            ? 'bg-[#f0f6f1] text-[#175432]'
                            : item.status === 'scheduled'
                            ? 'bg-blue-50 text-blue-700'
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
                        href={`/news/${item.slug}`}
                        target="_blank"
                        className="p-1.5 inline-flex items-center text-[#5c6f62] hover:text-[#175432] transition-colors rounded-lg hover:bg-gray-100"
                        title="View Public Article"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <Link
                        href={`/admin/news/${item.id}/edit`}
                        className="p-1.5 inline-flex items-center text-[#175432] hover:bg-[#f0f6f1] transition-colors rounded-lg cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 inline-flex items-center text-rose-600 hover:bg-rose-50 transition-colors rounded-lg cursor-pointer"
                        title="Delete Article"
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
