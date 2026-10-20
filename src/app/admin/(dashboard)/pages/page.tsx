'use client'

import React from 'react'
import Link from 'next/link'
import {
  LayoutTemplate,
  Home,
  Info,
  PhoneCall,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  CheckCircle2,
  Sliders,
  Settings,
} from 'lucide-react'

interface PageConfig {
  slug: string
  title: string
  subtitle: string
  description: string
  publicUrl: string
  icon: any
  badge: string
  sections: string[]
  color: string
  bg: string
  borderColor: string
}

const PAGES: PageConfig[] = [
  {
    slug: 'home',
    title: 'Home Page',
    subtitle: 'Primary Public Landing Page',
    description:
      'Manage hero slider photos, key impact statistics, "About The Forum" showcase snippet, strategic objectives, and section titles.',
    publicUrl: '/',
    icon: Home,
    badge: 'Core Gateway',
    sections: ['Hero Carousel', 'Impact Stats', 'About Forum Snippet', 'Strategic Objectives', 'CTA Banners'],
    color: 'text-[#175432]',
    bg: 'bg-[#f0f6f1]',
    borderColor: 'border-[#175432]/20',
  },
  {
    slug: 'about',
    title: 'About ACF',
    subtitle: 'Institutional Profile & Mandate',
    description:
      'Edit the institutional mandate, vision and mission statements, historical narrative, Lusaka dialogue photo, and 4 core strategic pillars.',
    publicUrl: '/about',
    icon: Info,
    badge: 'Institutional',
    sections: ['Mandate Header', 'Vision & Mission', 'Background & Photo', '4 Strategic Objectives', 'Governance CTA'],
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    borderColor: 'border-emerald-600/20',
  },
  {
    slug: 'contact',
    title: 'Contact & Secretariat',
    subtitle: 'Public Inquiries & Office Channels',
    description:
      'Update the Woodlands Secretariat address, telephone numbers, official emails, working hours, and social media channels.',
    publicUrl: '/contact',
    icon: PhoneCall,
    badge: 'Secretariat',
    sections: ['Office Details', 'Hotlines & Emails', 'Working Hours', 'Social Channels', 'Map Description'],
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    borderColor: 'border-teal-600/20',
  },
  {
    slug: 'membership',
    title: 'Membership & Partnerships',
    subtitle: 'Stakeholder Engagement & Onboarding',
    description:
      'Configure the membership value proposition, why join benefits, application criteria, and secretariat onboarding contact information.',
    publicUrl: '/membership',
    icon: ShieldCheck,
    badge: 'Stakeholders',
    sections: ['Header Banner', 'Why Join Benefits', 'Policy Representation', 'Application Directives'],
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    borderColor: 'border-amber-600/20',
  },
]

export default function AdminPagesDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Title & Context Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f6f1] text-[#175432] text-sm font-bold border border-[#e2ebe4]">
            <Sparkles size={14} />
            <span>Structured Section CMS</span>
          </div>
          <h1 className="text-3xl font-black text-[#0f1d14] tracking-tight flex items-center gap-3">
            <LayoutTemplate className="text-[#175432]" size={32} />
            Website Page Content & Sections
          </h1>
          <p className="text-sm text-[#5c6f62] max-w-2xl leading-relaxed">
            Manage and update textual content, headlines, statistics, images, and banners across all public website pages.
            All content updates are safely constrained to prevent CSS breakage and maintain responsive visual fidelity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/settings"
            className="px-4 py-2.5 rounded-md border border-[#e2ebe4] text-sm font-bold text-[#0f1d14] hover:bg-[#f6f9f6] transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Settings size={14} className="text-[#5c6f62]" />
            <span>Global Site Settings</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-md bg-[#175432] hover:bg-[#114227] text-white text-sm font-bold transition-colors flex items-center gap-2 shadow-md shadow-[#175432]/10"
          >
            <span>View Live Site</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PAGES.map((page) => {
          const Icon = page.icon
          return (
            <div
              key={page.slug}
              className="bg-white rounded-lg border border-[#e2ebe4] p-6 sm:p-8 shadow-xs hover:shadow-xl hover:border-[#175432]/40 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-5">
                {/* Header: Icon + Badge + Live Preview link */}
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-lg ${page.bg} flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs`}>
                    <Icon size={28} className={page.color} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#f6f9f6] text-[#5c6f62] border border-[#e2ebe4]">
                      {page.badge}
                    </span>
                    <a
                      href={page.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-[#5c6f62] hover:text-[#175432] hover:bg-[#f0f6f1] rounded-lg transition-colors"
                      title="Open page in new tab"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                {/* Titles */}
                <div>
                  <h2 className="text-xl font-bold text-[#0f1d14] group-hover:text-[#175432] transition-colors flex items-center gap-2">
                    {page.title}
                  </h2>
                  <p className="text-sm font-semibold text-[#5c6f62] mt-0.5">
                    {page.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-sm text-[#3b4d41] leading-relaxed">
                  {page.description}
                </p>

                {/* Managed Sections Pills */}
                <div className="pt-2">
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#5c6f62] mb-2 flex items-center gap-1.5">
                    <Layers size={12} />
                    <span>Editable Content Sections ({page.sections.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {page.sections.map((sec) => (
                      <span
                        key={sec}
                        className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#f6f9f6] text-[#3b4d41] border border-[#e2ebe4] flex items-center gap-1"
                      >
                        <CheckCircle2 size={10} className="text-[#175432]" />
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-[#e2ebe4] flex items-center justify-between">
                <span className="text-sm font-semibold text-[#5c6f62] group-hover:text-[#175432] transition-colors">
                  Path: <code className="bg-[#f0f6f1] px-1.5 py-0.5 rounded text-xs text-[#175432] font-mono">{page.publicUrl}</code>
                </span>

                <Link
                  href={`/admin/pages/${page.slug}`}
                  className="px-5 py-2.5 rounded-md bg-[#175432] hover:bg-[#114227] text-white text-sm font-bold transition-all shadow-md shadow-[#175432]/10 flex items-center gap-1.5 group-hover:translate-x-0.5"
                >
                  <span>Edit Sections</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* CSS Protection & Architecture Best Practice Notice */}
      <div className="bg-[#f0f6f1] rounded-lg p-6 border border-[#175432]/20 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#175432] text-white flex items-center justify-center shrink-0 shadow-sm">
          <Sliders size={24} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#0f1d14]">
            Layout & CSS Integrity Protection Active
          </h4>
          <p className="text-sm text-[#3b4d41] leading-relaxed">
            Content updates edited here are decoupled from CSS layout classes and responsive breakpoints. Your updates preserve all typography hierarchies, green brand palettes, button animations, and mobile responsiveness automatically.
          </p>
        </div>
      </div>
    </div>
  )
}
