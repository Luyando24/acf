'use client'

import { usePathname } from 'next/navigation'
import { resolveAdminTitle } from './navConfig'

interface AdminTopbarProps {
  email: string
  role: string
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrator',
  editor: 'Editor',
  contributor: 'Contributor',
  viewer: 'Viewer',
}

export default function AdminTopbar({ email, role }: AdminTopbarProps) {
  const pathname = usePathname()
  const title = resolveAdminTitle(pathname)
  const initial = (email.charAt(0) || 'A').toUpperCase()

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          ACF CMS
        </span>
        <span className="text-slate-300">/</span>
        <h2 className="text-sm font-bold text-slate-900 truncate">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">
            {initial}
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-sm font-semibold text-slate-900 max-w-[180px] truncate">
              {email || 'Staff'}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {ROLE_LABELS[role] || role}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
