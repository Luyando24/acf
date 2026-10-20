'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Briefcase,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Edit,
  Trash2,
  ExternalLink,
  Search,
} from 'lucide-react'
import { formatDate, isOpportunityClosed } from '@/lib/utils/formatters'

export interface OpportunityItem {
  id: string
  slug: string
  title: string
  type: 'Job' | 'Consultancy' | 'Tender' | 'Internship' | 'Procurement' | 'Call for Proposals'
  opens_on: string
  closes_on: string
  description?: string
  application_instructions?: string
  apply_url?: string | null
  contact_info?: string | null
  status: string
  accepted_documents?: string[]
  attachment_url?: string | null
}

export default function OpportunityManager({
  initialOpportunities,
}: {
  initialOpportunities: OpportunityItem[]
}) {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(initialOpportunities)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this opportunity notice?')) {
      try {
        await fetch(`/api/admin/crud/opportunities?id=${id}`, { method: 'DELETE' })
      } catch {
        // Fallback
      }
      setOpportunities((prev) => prev.filter((item) => item.id !== id))
      showNotification('Opportunity notice deleted.')
    }
  }

  const filtered = opportunities.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = typeFilter === 'ALL' || item.type === typeFilter
    const isClosed = isOpportunityClosed(item.closes_on)
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'active' && !isClosed) ||
      (statusFilter === 'closed' && isClosed)

    return matchesSearch && matchesType && matchesStatus
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

      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-[#0f1d14] tracking-tight">
            Opportunities, Jobs & Tenders
          </h1>
          <p className="text-sm text-[#5c6f62] mt-0.5">
            Manage vacancies, consultancies and specify required submission documents.
          </p>
        </div>

        <Link
          href="/admin/opportunities/new"
          className="px-4 py-2.5 bg-[#175432] hover:bg-[#114227] text-white text-sm font-bold rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Post New Opportunity</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#e2ebe4] shadow-xs">
          <div className="text-xs font-bold text-[#5c6f62] uppercase tracking-wider">Total Notices</div>
          <div className="text-2xl font-black text-[#0f1d14] mt-1">{opportunities.length}</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e2ebe4] shadow-xs">
          <div className="text-xs font-bold text-[#5c6f62] uppercase tracking-wider">Active Openings</div>
          <div className="text-2xl font-black text-[#175432] mt-1">
            {opportunities.filter((o) => !isOpportunityClosed(o.closes_on)).length}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e2ebe4] shadow-xs">
          <div className="text-xs font-bold text-[#5c6f62] uppercase tracking-wider">Archived / Closed</div>
          <div className="text-2xl font-black text-[#5c6f62] mt-1">
            {opportunities.filter((o) => isOpportunityClosed(o.closes_on)).length}
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-lg border border-[#e2ebe4] shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-[#5c6f62]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opportunity notices..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-[#e2ebe4] text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-[#f6f9f6] border border-[#e2ebe4] rounded-md text-sm font-semibold text-[#0f1d14] focus:outline-none focus:ring-2 focus:ring-[#175432]"
          >
            <option value="ALL">All Types</option>
            <option value="Job">Jobs</option>
            <option value="Consultancy">Consultancies</option>
            <option value="Tender">Tenders</option>
            <option value="Internship">Internships</option>
            <option value="Call for Proposals">Call for Proposals</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#f6f9f6] border border-[#e2ebe4] rounded-md text-sm font-semibold text-[#0f1d14] focus:outline-none focus:ring-2 focus:ring-[#175432]"
          >
            <option value="ALL">All Deadlines</option>
            <option value="active">Active Only</option>
            <option value="closed">Closed / Archived</option>
          </select>
        </div>
      </div>

      {/* Opportunities List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 bg-white p-12 rounded-lg border border-[#e2ebe4] text-center text-sm text-[#5c6f62]">
            No opportunity notices match your filter.
          </div>
        ) : (
          filtered.map((item) => {
            const closed = isOpportunityClosed(item.closes_on)
            return (
              <div
                key={item.id}
                className="bg-white p-6 rounded-lg border border-[#e2ebe4] shadow-xs flex flex-col justify-between hover:border-[#175432] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#f0f6f1] text-[#175432]">
                      {item.type}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        closed
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      {closed ? 'Closed' : 'Active'}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-[#0f1d14] mb-2 leading-snug">
                    {item.title}
                  </h2>

                  {item.description && (
                    <p className="text-sm text-[#5c6f62] line-clamp-2 mb-4">
                      {item.description}
                    </p>
                  )}

                  <div className="space-y-1.5 text-sm text-[#5c6f62] pt-3 border-t border-[#e2ebe4]">
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-[#175432]" />
                      <span>
                        Deadline:{' '}
                        <strong className="text-[#0f1d14]">
                          {formatDate(item.closes_on)}
                        </strong>
                      </span>
                    </div>

                    {item.accepted_documents && item.accepted_documents.length > 0 && (
                      <div className="text-xs text-[#5c6f62] pt-1">
                        Required:{' '}
                        <span className="font-semibold text-[#0f1d14]">
                          {item.accepted_documents.length} document types
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#e2ebe4]">
                  <Link
                    href={`/opportunities/${item.slug}`}
                    target="_blank"
                    className="text-sm text-[#175432] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View Notice</span>
                    <ExternalLink size={12} />
                  </Link>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/opportunities/${item.id}/edit`}
                      className="p-2 text-[#175432] hover:bg-[#f0f6f1] rounded-md transition-colors inline-flex items-center"
                      title="Edit Opportunity"
                    >
                      <Edit size={14} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer inline-flex items-center"
                      title="Delete Opportunity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
