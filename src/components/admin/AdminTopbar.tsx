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
    <header className="h-14 bg-white border-b border-[#e4e8e6] flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#8a9a8f]">
          ACF CMS
        </span>
        <span className="text-[#c4cfc7]">/</span>
        <h2 className="text-sm font-bold text-[#0f1d14] truncate">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#e4e8e6]">
          <div className="w-8 h-8 rounded-full bg-[#175432] text-white flex items-center justify-center text-sm font-bold shrink-0">
            {initial}
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-sm font-semibold text-[#0f1d14] max-w-[180px] truncate">
              {email || 'Staff'}
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8a9a8f]">
              {ROLE_LABELS[role] || role}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
