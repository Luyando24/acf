'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  ChevronDown,
  Search,
  BookOpen,
  Users,
  Briefcase,
  Calendar,
  Shield,
  HelpCircle,
} from 'lucide-react'

import { SiteSettings } from '@/lib/supabase/settings'

interface HeaderProps {
  settings?: SiteSettings
}

export default function Header({ settings }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  const toggleDropdown = (key: string) => {
    setOpenDropdown(openDropdown === key ? null : key)
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    {
      label: 'About Us',
      key: 'about',
      dropdown: [
        { label: 'Overview & Mission', href: '/about', desc: 'History, vision, and strategic mandate' },
        { label: 'Board of Directors', href: '/about/board', desc: 'Governance and oversight leadership' },
        { label: 'Management Team', href: '/about/management', desc: 'Executive and operational directors' },
        { label: 'Staff Profiles', href: '/about/staff', desc: 'Dedicated secretariat team members' },
      ],
    },
    {
      label: 'Our Work',
      key: 'work',
      dropdown: [
        { label: 'Thematic Programmes', href: '/our-work', desc: 'Policy advocacy, dialogue, and climate' },
        { label: 'Policy Advocacy', href: '/our-work/policy-advocacy', desc: 'Engaging national policymakers' },
        { label: 'Research & Evidence', href: '/our-work/research-and-evidence', desc: 'Data-driven analysis' },
        { label: 'Climate Resilience', href: '/our-work/climate-resilience', desc: 'Sustainable smallholder systems' },
      ],
    },
    {
      label: 'News & Events',
      key: 'news-events',
      dropdown: [
        { label: 'News & Sector Updates', href: '/news', desc: 'Latest articles and sector releases' },
        { label: 'Events & Forums', href: '/events', desc: 'Upcoming dialogues and past symposia' },
        { label: 'Social Highlights', href: '/facebook-posts', desc: 'Live updates from our Facebook page' },
      ],
    },
    {
      label: 'Get Involved',
      key: 'involved',
      dropdown: [
        { label: 'Membership Overview', href: '/membership', desc: 'Categories, benefits & requirements' },
        { label: 'Apply for Membership', href: '/membership/apply', desc: 'Online application form' },
        { label: 'Partners & Networks', href: '/partners', desc: 'Collaborating institutions' },
        { label: 'Opportunities & Tenders', href: '/opportunities', desc: 'Jobs, tenders, and consultancies' },
      ],
    },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <>
      {/* Skip to Main Content Link for WCAG 2.1 AA Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#175432] focus:text-white focus:rounded focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2ebe4] shadow-xs transition-all">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group focus:outline-hidden py-1">
              <img
                src={settings?.logo_url || '/photos/logo.png'}
                alt={settings?.site_name || 'Agricultural Consultative Forum (ACF)'}
                className="h-12 sm:h-14 w-auto max-w-[220px] object-contain group-hover:scale-105 transition-transform"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((item) => {
                if (item.dropdown) {
                  const isActive =
                    item.dropdown.some((sub) => pathname.startsWith(sub.href))
                  return (
                    <div key={item.key} className="relative group">
                      <button
                        type="button"
                        onClick={() => toggleDropdown(item.key!)}
                        className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                          isActive
                            ? 'text-[#175432] bg-[#f0f6f1]'
                            : 'text-[#142018] hover:text-[#175432] hover:bg-[#f6f9f6]'
                        }`}
                        aria-expanded={openDropdown === item.key}
                      >
                        {item.label}
                        <ChevronDown size={15} className="group-hover:rotate-180 transition-transform duration-200" />
                      </button>

                      <div className="absolute top-full left-0 pt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl rounded-xl overflow-hidden z-50">
                        <div className="bg-white border border-[#e2ebe4] rounded-xl p-2 shadow-2xl">
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="block p-2.5 rounded-lg hover:bg-[#f0f6f1] transition-colors group/item"
                            >
                              <div className="font-bold text-sm text-[#0f1d14] group-hover/item:text-[#175432]">
                                {sub.label}
                              </div>
                              <div className="text-xs text-[#5c6f62] line-clamp-1 mt-0.5">
                                {sub.desc}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                }

                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#175432] bg-[#f0f6f1]'
                        : 'text-[#142018] hover:text-[#175432] hover:bg-[#f6f9f6]'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Quick Actions (Desktop) */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/membership/apply"
                className="flex items-center gap-2 text-sm font-bold text-white bg-[#175432] hover:bg-[#114227] px-5 py-2.5 rounded-full shadow-md shadow-[#175432]/20 hover:shadow-lg transition-all"
              >
                <span>Join ACF</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#0f1d14] hover:bg-[#f0f6f1] rounded-lg transition-colors"
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#e2ebe4] bg-white px-4 py-6 max-h-[85vh] overflow-y-auto space-y-4 shadow-xl">
            {navLinks.map((item) => {
              if (item.dropdown) {
                return (
                  <div key={item.key} className="border-b border-[#e2ebe4]/60 pb-3">
                    <button
                      type="button"
                      onClick={() => toggleDropdown(item.key!)}
                      className="w-full flex items-center justify-between text-base font-bold text-[#0f1d14] py-1"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${
                          openDropdown === item.key ? 'rotate-180 text-[#175432]' : ''
                        }`}
                      />
                    </button>
                    {openDropdown === item.key && (
                      <div className="mt-2 pl-3 space-y-2">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-1.5 text-sm font-medium text-[#5c6f62] hover:text-[#175432]"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <div key={item.href} className="border-b border-[#e2ebe4]/60 pb-3">
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-bold text-[#0f1d14] hover:text-[#175432] py-1"
                  >
                    {item.label}
                  </Link>
                </div>
              )
            })}

            <div className="pt-2 space-y-3">
              <Link
                href="/membership/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#175432] text-white font-bold rounded-xl shadow-md text-center"
              >
                Join ACF / Membership
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#e2ebe4] text-[#175432] font-semibold rounded-xl text-center text-sm"
              >
                Staff Portal Login
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
