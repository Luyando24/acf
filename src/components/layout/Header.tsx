'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  ChevronDown,
} from 'lucide-react'

import type { SiteSettings } from '@/lib/supabase/settings'

interface HeaderProps {
  settings?: SiteSettings
}

export default function Header({ settings }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const pathname = usePathname()

  const toggleDropdown = (key: string) => {
    setOpenDropdown((prev) => (prev === key ? null : key))
  }

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null)
    setMobileMenuOpen(false)
  }, [pathname])

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null)
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const navLinks = [
    { label: 'Home', href: '/' },
    {
      label: 'About Us',
      key: 'about',
      dropdown: [
        { label: 'Overview & Mission', href: '/about', desc: 'History, vision, and strategic mandate' },
        { label: 'Board of Directors', href: '/about/board', desc: 'Governance and oversight leadership' },
        { label: 'Secretariat', href: '/about/secretariat', desc: 'Executive leadership and operational staff' },
      ],
    },
    { label: 'Our Work', href: '/our-work' },
    { label: 'Policy Dialogues', href: '/events' },
    { label: 'Knowledge Hub', href: '/publications' },
    { label: 'News', href: '/news' },
    {
      label: 'Get Involved',
      key: 'involved',
      dropdown: [
        { label: 'Membership Overview', href: '/membership', desc: 'Categories, benefits & requirements' },
        { label: 'Apply for Membership', href: '/membership/apply', desc: 'Online application form' },
        { label: 'Partners & Networks', href: '/partners', desc: 'Collaborating institutions' },
        { label: 'Opportunities & Tenders', href: '/opportunities', desc: 'Jobs, tenders, and consultancies' },
        { label: 'Social Highlights', href: '/facebook-posts', desc: 'Live updates from our Facebook page' },
      ],
    },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <>
      {/* Skip to Main Content Link for WCAG 2.1 AA Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#1e7e48] focus:text-white focus:rounded focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <header
        ref={navRef}
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2ebe4] shadow-xs transition-all"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              onClick={() => setOpenDropdown(null)}
              className="flex items-center gap-3 group focus:outline-hidden py-1"
            >
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
                  const isOpen = openDropdown === item.key
                  const isActive =
                    item.dropdown.some((sub) => pathname.startsWith(sub.href))
                  return (
                    <div key={item.key} className="relative">
                      <button
                        type="button"
                        onClick={() => toggleDropdown(item.key!)}
                        className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                          isActive || isOpen
                            ? 'text-[#1e7e48] bg-[#eef6f1]'
                            : 'text-[#142018] hover:text-[#1e7e48] hover:bg-[#f4f8f5]'
                        }`}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                      >
                        {item.label}
                        <ChevronDown
                          size={15}
                          className={`transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[#1e7e48]' : ''
                          }`}
                        />
                      </button>

                      <div
                        className={`absolute top-full left-0 pt-2 w-72 transition-all duration-200 shadow-xl rounded-xl overflow-hidden z-50 ${
                          isOpen
                            ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                            : 'opacity-0 invisible -translate-y-1 pointer-events-none'
                        }`}
                      >
                        <div className="bg-white border border-[#e2ebe4] rounded-xl p-2 shadow-2xl">
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setOpenDropdown(null)}
                              className="block p-2.5 rounded-lg hover:bg-[#eef6f1] transition-colors group/item"
                            >
                              <div className="font-bold text-sm text-[#0f1d14] group-hover/item:text-[#1e7e48]">
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

                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpenDropdown(null)}
                    className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#1e7e48] bg-[#eef6f1]'
                        : 'text-[#142018] hover:text-[#1e7e48] hover:bg-[#f4f8f5]'
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
                href="/events"
                onClick={() => setOpenDropdown(null)}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white bg-[#1e7e48] hover:bg-[#166538] px-5 py-2.5 rounded-full shadow-md shadow-[#1e7e48]/20 hover:shadow-lg transition-all"
              >
                <span>Join a Dialogue</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#0f1d14] hover:bg-[#eef6f1] rounded-lg transition-colors"
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
                const isOpen = openDropdown === item.key
                return (
                  <div key={item.key} className="border-b border-[#e2ebe4]/60 pb-3">
                    <button
                      type="button"
                      onClick={() => toggleDropdown(item.key!)}
                      className="w-full flex items-center justify-between text-base font-bold text-[#0f1d14] py-1 cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#1e7e48]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-2 pl-3 space-y-2">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => {
                              setOpenDropdown(null)
                              setMobileMenuOpen(false)
                            }}
                            className="block py-1.5 text-sm font-medium text-[#5c6f62] hover:text-[#1e7e48]"
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
                    onClick={() => {
                      setOpenDropdown(null)
                      setMobileMenuOpen(false)
                    }}
                    className="block text-base font-bold text-[#0f1d14] hover:text-[#1e7e48] py-1"
                  >
                    {item.label}
                  </Link>
                </div>
              )
            })}

            <div className="pt-2 space-y-2.5">
              <Link
                href="/events"
                onClick={() => {
                  setOpenDropdown(null)
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#1e7e48] hover:bg-[#166538] text-white font-bold rounded-xl shadow-md text-center text-sm uppercase tracking-wider transition-colors"
              >
                Join a Dialogue
              </Link>
              <Link
                href="/membership/apply"
                onClick={() => {
                  setOpenDropdown(null)
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#f4f8f5] hover:bg-[#eef6f1] text-[#1e7e48] border border-[#dbe6de] font-bold rounded-xl text-center text-xs uppercase tracking-wider transition-colors"
              >
                Apply for Membership
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
