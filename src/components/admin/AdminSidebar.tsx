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
    <aside className="w-64 bg-white border-r border-[#e4e8e6] flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="px-4 py-3.5 border-b border-[#e4e8e6] flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <img
            src="/photos/logo.png"
            alt="ACF CMS"
            className="h-9 w-auto max-w-[140px] object-contain"
          />
        </Link>
        <span className="text-[11px] bg-[#f0f6f1] text-[#175432] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border border-[#e4e8e6]">
          CMS
        </span>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-grow overflow-y-auto py-4 px-3 space-y-5">
        {navGroups.map((group) => {
          const items = group.items.filter(
            (item: AdminNavItem) => !item.superAdminOnly || canManageStaff
          )
          if (items.length === 0) return null

          return (
          <div key={group.title} className="space-y-1">
            <div className="px-3 text-[11px] font-bold uppercase tracking-widest text-[#8a9a8f]">
              {group.title}
            </div>

            <div className="space-y-0.5 pt-1">
              {items.map((item) => {
                const isActive = isAdminActive(pathname, item.href)
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-semibold transition-colors group ${
                      isActive
                        ? 'bg-[#eef6ef] text-[#175432] border border-[#d9e8dc]'
                        : 'text-[#3b4d41] border border-transparent hover:bg-[#f5f8f5] hover:text-[#175432]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={16}
                        className={isActive ? 'text-[#175432]' : 'text-[#7a8b80] group-hover:text-[#175432]'}
                      />
                      <span>{item.name}</span>
                    </div>

                    {isActive && <ChevronRight size={13} className="text-[#175432]/60" />}
                  </Link>
                )
              })}
            </div>
          </div>
          )
        })}
      </nav>

      {/* Footer / Sign Out */}
      <div className="p-3 border-t border-[#e4e8e6] space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-[#5c6f62] hover:bg-[#f5f8f5] hover:text-[#175432] transition-colors"
        >
          <Globe size={15} />
          <span>View Public Website</span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
