'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Download,
  Search,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { formatDate } from '@/lib/utils/formatters'

export interface MembershipApplicationItem {
  id: string
  applicant_type: 'organisation' | 'individual'
  org_name?: string | null
  contact_name: string
  email: string
  phone: string
  location_province?: string | null
  sector_interest?: string | null
  details?: any
  status: 'new' | 'in_review' | 'approved' | 'declined'
  notes?: string | null
  created_at: string
  membership_categories?: { name: string } | null
}

export default function MembershipManager({
  initialApplications,
}: {
  initialApplications: MembershipApplicationItem[]
}) {
  const [applications, setApplications] = useState<MembershipApplicationItem[]>(initialApplications)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this membership submission?')) return

    try {
      await fetch(`/api/admin/crud/membership?id=${id}`, { method: 'DELETE' })
      setApplications((prev) => prev.filter((item) => item.id !== id))
      showNotification('Application submission deleted.')
    } catch {
      setApplications((prev) => prev.filter((item) => item.id !== id))
      showNotification('Deleted application.')
    }
  }

  const filtered = applications.filter((app) => {
    const matchesSearch =
      (app.org_name && app.org_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      app.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.location_province && app.location_province.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const newCount = applications.filter((a) => a.status === 'new').length
  const approvedCount = applications.filter((a) => a.status === 'approved').length

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
            Membership Applications
          </h1>
          <p className="text-sm text-[#5c6f62] mt-0.5">
            Review stakeholder caucus submissions, verify eligibility, and manage status.
          </p>
        </div>

        <a
          href="/api/admin/export/membership"
          download
          className="px-4 py-2.5 bg-[#175432] hover:bg-[#114227] text-white text-sm font-bold rounded-md shadow-xs transition-colors flex items-center gap-2"
        >
          <Download size={16} />
          <span>Export Submissions (CSV)</span>
        </a>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#e2ebe4] shadow-xs">
          <div className="text-xs font-bold text-[#5c6f62] uppercase tracking-wider">Total Submissions</div>
          <div className="text-2xl font-black text-[#0f1d14] mt-1">{applications.length}</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e2ebe4] shadow-xs">
          <div className="text-xs font-bold text-[#5c6f62] uppercase tracking-wider">Pending Review</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{newCount}</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e2ebe4] shadow-xs">
          <div className="text-xs font-bold text-[#5c6f62] uppercase tracking-wider">Approved Members</div>
          <div className="text-2xl font-black text-[#175432] mt-1">{approvedCount}</div>
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
            placeholder="Search by organization name, contact person, or province..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-[#e2ebe4] text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-[#f6f9f6] border border-[#e2ebe4] rounded-md text-sm font-semibold text-[#0f1d14] focus:outline-none focus:ring-2 focus:ring-[#175432]"
        >
          <option value="ALL">All Application Statuses</option>
          <option value="new">Pending Review (New)</option>
          <option value="in_review">In Committee Review</option>
          <option value="approved">Approved</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg border border-[#e2ebe4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f6f9f6] text-[#5c6f62] uppercase tracking-wider font-bold border-b border-[#e2ebe4]">
              <tr>
                <th className="py-4 px-6">Entity / Contact</th>
                <th className="py-4 px-6">Category Caucus</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Sector Interest</th>
                <th className="py-4 px-6">Submitted Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2ebe4]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#5c6f62]">
                    No membership applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#0f1d14]">
                        {app.org_name || app.contact_name}
                      </div>
                      <div className="text-xs text-[#5c6f62]">
                        {app.contact_name} • {app.email} • {app.phone}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#175432] font-semibold">
                      {app.membership_categories?.name || 'Producer Association'}
                    </td>
                    <td className="py-4 px-6 text-[#5c6f62]">
                      {app.location_province || 'Lusaka'}
                    </td>
                    <td className="py-4 px-6 text-[#5c6f62] max-w-xs truncate">
                      {app.sector_interest || 'General Agriculture'}
                    </td>
                    <td className="py-4 px-6 text-[#5c6f62] whitespace-nowrap">
                      {formatDate(app.created_at)}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          app.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'in_review'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'declined'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-1">
                      <Link
                        href={`/admin/membership/${app.id}`}
                        className="px-3 py-1.5 bg-[#f0f6f1] text-[#175432] hover:bg-[#e2ebe4] text-sm font-bold rounded-md transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye size={13} />
                        <span>Review</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(app.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 transition-colors rounded-lg cursor-pointer inline-flex items-center"
                        title="Delete application"
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
