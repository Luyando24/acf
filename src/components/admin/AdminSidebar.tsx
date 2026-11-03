'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Globe, ChevronRight } from 'lucide-react'
import { navGroups, isAdminActive, type AdminNavItem } from './navConfig'

export default function AdminSidebar({ role }: { role?: string }) {
  const pathname = usePathname()
  const canManageStaff = role === 'super_admin'

  const handleSignOut = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      window.location.href = '/admin/login'
    } catch {
      window.location.href = '/admin/login'
    }
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <img
            src="/photos/logo.png"
            alt="ACF CMS"
            className="h-9 w-auto max-w-[140px] object-contain"
          />
        </Link>
        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-black border border-slate-200">
          CMS
        </span>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-grow overflow-y-auto py-5 px-3 space-y-6">
        {navGroups.map((group) => {
          const items = group.items.filter(
            (item: AdminNavItem) => !item.superAdminOnly || canManageStaff
          )
          if (items.length === 0) return null

          return (
            <div key={group.title} className="space-y-1">
              <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                {group.title}
              </div>

              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive = isAdminActive(pathname, item.href)
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all group ${
                        isActive
                          ? 'bg-[#175432] text-white shadow-xs font-semibold'
                          : 'text-slate-600 font-medium hover:bg-slate-100/70 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          size={16}
                          strokeWidth={isActive ? 2.2 : 1.8}
                          className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {isActive && <ChevronRight size={13} className="text-white/70 shrink-0" />}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Footer / Sign Out */}
      <div className="p-3 border-t border-slate-200 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 transition-all"
        >
          <Globe size={15} className="text-slate-400" />
          <span>View Public Website</span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50/80 transition-all cursor-pointer"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
