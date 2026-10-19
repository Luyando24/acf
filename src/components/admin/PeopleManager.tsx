'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Users,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Mail,
  Eye,
  EyeOff,
} from 'lucide-react'
import { LinkedinIcon } from '@/components/ui/SocialIcons'

export interface PersonItem {
  id: string
  group_type: 'board' | 'management' | 'staff'
  name: string
  position: string
  bio?: string | null
  photo_url?: string | null
  order_index: number
  email?: string | null
  linkedin_url?: string | null
  is_visible: boolean
}

export default function PeopleManager({
  initialPeople,
}: {
  initialPeople: PersonItem[]
}) {
  const [people, setPeople] = useState<PersonItem[]>(initialPeople)
  const [searchQuery, setSearchQuery] = useState('')
  const [groupFilter, setGroupFilter] = useState<'ALL' | 'board' | 'management' | 'staff'>('ALL')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this profile?')) return

    try {
      await fetch(`/api/admin/crud/people?id=${id}`, { method: 'DELETE' })
      setPeople((prev) => prev.filter((item) => item.id !== id))
      showNotification('Profile deleted successfully.')
    } catch {
      setPeople((prev) => prev.filter((item) => item.id !== id))
      showNotification('Profile removed.')
    }
  }

  const toggleVisibility = async (p: PersonItem) => {
    const updated = !p.is_visible
    setPeople((prev) => prev.map((item) => (item.id === p.id ? { ...item, is_visible: updated } : item)))

    try {
      await fetch('/api/admin/crud/people', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, is_visible: updated }),
      })
      showNotification(`Visibility toggled: ${updated ? 'Public' : 'Hidden'}`)
    } catch {
      // Keep local update
    }
  }

  const filtered = people.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesGroup = groupFilter === 'ALL' || p.group_type === groupFilter

    return matchesSearch && matchesGroup
  })

  const boardCount = people.filter((p) => p.group_type === 'board').length
  const mgmtCount = people.filter((p) => p.group_type === 'management').length
  const staffCount = people.filter((p) => p.group_type === 'staff').length

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
            Board & Staff Profiles
          </h1>
          <p className="text-xs text-[#5c6f62] mt-0.5">
            Manage governance leadership, management team, and secretariat specialists.
          </p>
        </div>

        <Link
          href="/admin/people/new"
          className="px-4 py-2.5 bg-[#175432] hover:bg-[#114227] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Add Personnel Profile</span>
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e2ebe4] pb-2">
        <button
          type="button"
          onClick={() => setGroupFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            groupFilter === 'ALL'
              ? 'bg-[#175432] text-white shadow-xs'
              : 'text-[#5c6f62] hover:bg-[#f0f6f1] hover:text-[#175432]'
          }`}
        >
          All Members ({people.length})
        </button>
        <button
          type="button"
          onClick={() => setGroupFilter('board')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            groupFilter === 'board'
              ? 'bg-[#175432] text-white shadow-xs'
              : 'text-[#5c6f62] hover:bg-[#f0f6f1] hover:text-[#175432]'
          }`}
        >
          Board of Directors ({boardCount})
        </button>
        <button
          type="button"
          onClick={() => setGroupFilter('management')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            groupFilter === 'management'
              ? 'bg-[#175432] text-white shadow-xs'
              : 'text-[#5c6f62] hover:bg-[#f0f6f1] hover:text-[#175432]'
          }`}
        >
          Management Team ({mgmtCount})
        </button>
        <button
          type="button"
          onClick={() => setGroupFilter('staff')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            groupFilter === 'staff'
              ? 'bg-[#175432] text-white shadow-xs'
              : 'text-[#5c6f62] hover:bg-[#f0f6f1] hover:text-[#175432]'
          }`}
        >
          Secretariat Staff ({staffCount})
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2ebe4] shadow-xs">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3 text-[#5c6f62]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, title, or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#e2ebe4] text-xs focus:ring-2 focus:ring-[#175432] focus:outline-none"
          />
        </div>
      </div>

      {/* People Table */}
      <div className="bg-white rounded-3xl border border-[#e2ebe4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f9f6] text-[#5c6f62] uppercase tracking-wider font-bold border-b border-[#e2ebe4]">
              <tr>
                <th className="py-4 px-6">Order</th>
                <th className="py-4 px-6">Person</th>
                <th className="py-4 px-6">Group Category</th>
                <th className="py-4 px-6">Contact / Social</th>
                <th className="py-4 px-6">Visibility</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2ebe4]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#5c6f62]">
                    No personnel profiles found in this category.
                  </td>
                </tr>
              ) : (
                filtered.map((person) => (
                  <tr key={person.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#5c6f62]">
                      #{person.order_index}
                    </td>
                    <td className="py-4 px-6 max-w-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={person.photo_url || '/people/placeholder.jpg'}
                          alt={person.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#e2ebe4] shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/photos/logo.png'
                          }}
                        />
                        <div>
                          <div className="font-bold text-[#0f1d14]">{person.name}</div>
                          <div className="text-[11px] text-[#5c6f62]">{person.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          person.group_type === 'board'
                            ? 'bg-purple-50 text-purple-800'
                            : person.group_type === 'management'
                            ? 'bg-blue-50 text-blue-800'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {person.group_type}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-[#5c6f62]">
                      <div className="flex items-center gap-2">
                        {person.email && (
                          <a href={`mailto:${person.email}`} className="hover:text-[#175432]" title={person.email}>
                            <Mail size={13} />
                          </a>
                        )}
                        {person.linkedin_url && (
                          <a href={person.linkedin_url} target="_blank" className="hover:text-[#175432]" title="LinkedIn">
                            <LinkedinIcon size={13} />
                          </a>
                        )}
                        {!person.email && !person.linkedin_url && <span>—</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => toggleVisibility(person)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1.5 cursor-pointer ${
                          person.is_visible
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                        title="Click to toggle visibility on website"
                      >
                        {person.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{person.is_visible ? 'Public' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-1">
                      <Link
                        href={`/about/${person.group_type}`}
                        target="_blank"
                        className="p-1.5 inline-flex items-center text-[#5c6f62] hover:text-[#175432] transition-colors rounded-lg hover:bg-gray-100"
                        title="Preview Public Page"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <Link
                        href={`/admin/people/${person.id}/edit`}
                        className="p-1.5 inline-flex items-center text-[#175432] hover:bg-[#f0f6f1] transition-colors rounded-lg"
                        title="Edit Profile"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(person.id)}
                        className="p-1.5 inline-flex items-center text-rose-600 hover:bg-rose-50 transition-colors rounded-lg cursor-pointer"
                        title="Delete Profile"
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
