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
  Shield,
  Layers,
  LayoutTemplate,
  UserCog,
} from 'lucide-react'

export interface AdminNavItem {
  name: string
  href: string
  icon: typeof LayoutDashboard
  superAdminOnly?: boolean
}

export interface AdminNavGroup {
  title: string
  items: AdminNavItem[]
}

export const navGroups: AdminNavGroup[] = [
  {
    title: 'Core Management',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Website Pages & Content', href: '/admin/pages', icon: LayoutTemplate },
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
      { name: 'Staff Accounts', href: '/admin/team', icon: UserCog, superAdminOnly: true },
      { name: 'Site Settings & Contacts', href: '/admin/settings', icon: Settings },
    ],
  },
]

export function isAdminActive(pathname: string, href: string): boolean {
  return pathname === href || (href !== '/admin' && pathname.startsWith(href + '/'))
}

export function resolveAdminTitle(pathname: string): string {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (isAdminActive(pathname, item.href)) return item.name
    }
  }
  if (pathname.startsWith('/admin/login')) return 'Staff Portal'
  return 'Admin'
}
