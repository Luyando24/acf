'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Calendar,
  Briefcase,
  Users,
  Handshake,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  ChevronRight,
  Globe,
  PlusCircle,
  Shield,
  Layers,
} from 'lucide-react'

const navGroups = [
  {
    title: 'Core Management',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Publications & Briefs', href: '/admin/publications', icon: BookOpen },
      { name: 'News & Press', href: '/admin/news', icon: FileText },
      { name: 'Events & Forums', href: '/admin/events', icon: Calendar },
      { name: 'Opportunities & Tenders', href: '/admin/opportunities', icon: Briefcase },
    ],
  },
  {
    title: 'Organisation & People',
    items: [
      { name: 'Thematic Programmes', href: '/admin/programmes', icon: Layers },
      { name: 'Board & Staff Profiles', href: '/admin/people', icon: Users },
      { name: 'Partners & Affiliations', href: '/admin/partners', icon: Handshake },
    ],
  },
  {
    title: 'Stakeholder Inquiries',
    items: [
      { name: 'Membership Applications', href: '/admin/membership', icon: Shield },
      { name: 'Contact Inquiries', href: '/admin/contacts', icon: MessageSquare },
      { name: 'Newsletter Subscribers', href: '/admin/newsletter', icon: Mail },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { name: 'Site Settings & Contacts', href: '/admin/settings', icon: Settings },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      window.location.href = '/admin/login'
    } catch {
      window.location.href = '/admin/login'
    }
  }

  return (
    <aside className="w-64 bg-white border-r border-[#e2ebe4] flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#e2ebe4] flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <img
            src="/photos/logo.png"
            alt="ACF CMS"
            className="h-10 w-auto max-w-[150px] object-contain"
          />
        </Link>
        <span className="text-[10px] bg-[#f0f6f1] text-[#175432] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border border-[#e2ebe4]">
          CMS
        </span>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-grow overflow-y-auto py-4 px-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="px-3 text-[10px] font-black uppercase tracking-widest text-[#5c6f62]/80">
              {group.title}
            </div>

            <div className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-[#175432] text-white shadow-xs'
                        : 'text-[#3b4d41] hover:bg-[#f6f9f6] hover:text-[#175432]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={17}
                        className={isActive ? 'text-[#a3e635]' : 'text-[#5c6f62] group-hover:text-[#175432]'}
                      />
                      <span>{item.name}</span>
                    </div>

                    {isActive && <ChevronRight size={13} className="text-[#a3e635]" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Sign Out */}
      <div className="p-3 border-t border-[#e2ebe4] space-y-1">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#5c6f62] hover:bg-gray-50 transition-colors"
        >
          <Globe size={15} />
          <span>View Public Website</span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
