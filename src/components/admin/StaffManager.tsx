'use client'

import { useCallback, useEffect, useState } from 'react'
import { PlusCircle, Copy, KeyRound, ShieldCheck, ShieldOff, X } from 'lucide-react'
import { STAFF_ROLE_LABELS } from '@/lib/auth/permissions'

interface StaffMember {
  id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  created_at: string
  last_sign_in_at: string | null
}

const ROLE_OPTIONS = ['super_admin', 'admin', 'editor', 'contributor', 'viewer'] as const

function formatDate(value: string | null): string {
  if (!value) return 'Never'
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function StaffManager({ currentUserId }: { currentUserId: string }) {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  const [showAddForm, setShowAddForm] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<string>('editor')
  const [password, setPassword] = useState('')
  const [creating, setCreating] = useState(false)
  const [tempPassword, setTempPassword] = useState<{ email: string; password: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [resettingId, setResettingId] = useState('')

  const loadStaff = useCallback(async () => {
    setError('')
    try {
      const res = await fetch('/api/admin/staff')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load staff accounts.')
      setStaff(data.staff)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load staff accounts.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch('/api/admin/staff')
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load staff accounts.')
        if (!cancelled) setStaff(data.staff)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load staff accounts.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setActionError('')
    setCopied(false)
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, role, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create the staff account.')

      setStaff((prev) => [...prev, data.staff])
      if (data.tempPassword) {
        setTempPassword({ email: data.staff.email, password: data.tempPassword })
      }
      setShowAddForm(false)
      setFullName('')
      setEmail('')
      setRole('editor')
      setPassword('')
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to create the staff account.')
    } finally {
      setCreating(false)
    }
  }

  const handleUpdate = async (member: StaffMember, updates: { role?: string; is_active?: boolean }) => {
    setActionError('')
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: member.id, ...updates }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update the staff account.')
      setStaff((prev) => prev.map((s) => (s.id === member.id ? { ...s, ...data.staff } : s)))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update the staff account.')
      loadStaff()
    }
  }

  const handleResetPassword = async (member: StaffMember) => {
    if (
      !window.confirm(
        `Generate a new temporary password for ${member.email}? Their current password will stop working immediately.`
      )
    ) {
      return
    }
    setResettingId(member.id)
    setActionError('')
    setCopied(false)
    try {
      const res = await fetch('/api/admin/staff/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: member.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to reset the password.')
      setTempPassword({ email: member.email, password: data.tempPassword })
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to reset the password.')
    } finally {
      setResettingId('')
    }
  }

  const copyPassword = async () => {
    if (!tempPassword) return
    await navigator.clipboard.writeText(tempPassword.password)
    setCopied(true)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f1d14] tracking-tight">Staff Accounts</h1>
          <p className="text-sm text-[#5c6f62] mt-0.5">
            Create CMS accounts, assign roles, and control access for ACF personnel.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowAddForm((v) => !v)
            setActionError('')
          }}
          className="px-3.5 py-2 bg-[#175432] hover:bg-[#114227] text-white text-sm font-bold rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          {showAddForm ? <X size={14} /> : <PlusCircle size={14} />}
          <span>{showAddForm ? 'Cancel' : 'Add Staff Account'}</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          {error}
        </div>
      )}

      {tempPassword && (
        <div className="p-4 rounded-lg bg-[#fffbeb] border border-amber-300 space-y-2">
          <div className="text-sm font-bold text-amber-900">
            Temporary password for {tempPassword.email}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <code className="px-3 py-1.5 rounded-md bg-white border border-amber-300 text-sm font-mono text-[#0f1d14] select-all">
              {tempPassword.password}
            </code>
            <button
              type="button"
              onClick={copyPassword}
              className="px-2.5 py-1.5 rounded-md bg-white border border-amber-300 text-xs font-bold text-amber-900 hover:bg-amber-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Copy size={13} />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-amber-800">
            Shown only once — share it securely now. The account holder should change it after signing in.
          </p>
        </div>
      )}

      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-lg border border-[#e4e8e6] p-5 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="staff-name" className="text-xs font-bold text-[#0f1d14]">
                Full Name
              </label>
              <input
                id="staff-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Mary Banda"
                className="w-full px-3 py-2 rounded-md border border-[#e4e8e6] text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="staff-email" className="text-xs font-bold text-[#0f1d14]">
                Work Email
              </label>
              <input
                id="staff-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@acfzambia.org"
                className="w-full px-3 py-2 rounded-md border border-[#e4e8e6] text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="staff-role" className="text-xs font-bold text-[#0f1d14]">
                Role
              </label>
              <select
                id="staff-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[#e4e8e6] text-sm bg-white focus:ring-2 focus:ring-[#175432] focus:outline-none"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {STAFF_ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="staff-password" className="text-xs font-bold text-[#0f1d14]">
                Initial Password <span className="font-medium text-[#8a9a8f]">(optional)</span>
              </label>
              <input
                id="staff-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to auto-generate"
                minLength={10}
                className="w-full px-3 py-2 rounded-md border border-[#e4e8e6] text-sm focus:ring-2 focus:ring-[#175432] focus:outline-none"
              />
            </div>
          </div>

          <p className="text-xs text-[#8a9a8f]">
            Roles: Super Admin has full control including staff accounts. Administrators manage all
            content and submissions. Editors publish and delete content. Contributors create and
            edit content. Viewers have read-only access.
          </p>

          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2 bg-[#175432] hover:bg-[#114227] disabled:opacity-50 text-white text-sm font-bold rounded-md transition-colors cursor-pointer"
          >
            {creating ? 'Creating…' : 'Create Account'}
          </button>
        </form>
      )}

      {actionError && (
        <div className="p-3.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-sm">
          {actionError}
        </div>
      )}

      {/* Staff List */}
      <div className="bg-white rounded-lg border border-[#e4e8e6] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#e4e8e6]">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#5c6f62]">
            Team Members ({staff.length})
          </h2>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-[#8a9a8f]">Loading staff accounts…</div>
        ) : staff.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#8a9a8f]">
            No staff accounts yet. Add the first one above.
          </div>
        ) : (
          <div className="divide-y divide-[#eef2ef]">
            {staff.map((member) => {
              const isSelf = member.id === currentUserId
              return (
                <div key={member.id} className="px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1 basis-52">
                    <div className="w-9 h-9 rounded-full bg-[#eef6ef] text-[#175432] flex items-center justify-center text-sm font-bold shrink-0">
                      {(member.full_name || member.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#0f1d14] truncate">
                        {member.full_name || member.email}
                        {isSelf && (
                          <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-[#8a9a8f]">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#8a9a8f] truncate">{member.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${member.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`}
                    />
                    <span className="text-xs font-semibold text-[#3b4d41]">
                      {member.is_active ? 'Active' : 'Deactivated'}
                    </span>
                  </div>

                  <div>
                    <label className="sr-only" htmlFor={`role-${member.id}`}>
                      Role for {member.email}
                    </label>
                    <select
                      id={`role-${member.id}`}
                      value={member.role}
                      disabled={isSelf}
                      onChange={(e) => handleUpdate(member, { role: e.target.value })}
                      className="px-2.5 py-1.5 rounded-md border border-[#e4e8e6] text-sm bg-white disabled:opacity-60 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#175432] focus:outline-none"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {STAFF_ROLE_LABELS[r]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-xs text-[#8a9a8f] basis-28">
                    <span className="block font-semibold text-[#5c6f62]">Last active</span>
                    {formatDate(member.last_sign_in_at)}
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    {!isSelf && (
                      <button
                        type="button"
                        onClick={() => handleUpdate(member, { is_active: !member.is_active })}
                        className="px-2.5 py-1.5 rounded-md border border-[#e4e8e6] text-xs font-bold text-[#0f1d14] hover:bg-[#f5f8f5] transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {member.is_active ? <ShieldOff size={13} /> : <ShieldCheck size={13} />}
                        {member.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleResetPassword(member)}
                      disabled={resettingId === member.id}
                      className="px-2.5 py-1.5 rounded-md border border-[#e4e8e6] text-xs font-bold text-[#0f1d14] hover:bg-[#f5f8f5] transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      <KeyRound size={13} />
                      {resettingId === member.id ? 'Resetting…' : 'Reset Password'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
