import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import type { SiteSettings } from '@/lib/supabase/settings'

interface FooterProps {
  settings: SiteSettings
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#f4f8f5] text-[#2d3f33] border-t border-[#dbe6de]">
      {/* Main Footer Links */}
      <div className="container mx-auto px-4 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16">
          {/* Column 1: Institutional Brand & Mandate */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block py-1">
              <div className="bg-white rounded-xl p-2.5 inline-block border border-[#dbe6de] shadow-xs">
                <img
                  src={settings.logo_url || '/photos/logo.png'}
                  alt={settings.site_name || 'ACF Zambia'}
                  className="h-10 w-auto max-w-[190px] object-contain"
                />
              </div>
            </Link>

            <p className="text-[#526658] text-sm leading-relaxed max-w-sm">
              The Agricultural Consultative Forum is a multi-stakeholder platform championing evidence-based policy dialogue, sustainable food systems, and secure tenure rights for Zambian smallholders.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-[#dbe6de] flex items-center justify-center text-[#1e7e48] hover:text-white hover:bg-[#1e7e48] hover:border-[#1e7e48] shadow-2xs transition-colors"
                  aria-label="ACF Facebook"
                >
                  <FacebookIcon size={17} />
                </a>
              )}
              {settings.twitter_url && (
                <a
                  href={settings.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-[#dbe6de] flex items-center justify-center text-[#1e7e48] hover:text-white hover:bg-[#1e7e48] hover:border-[#1e7e48] shadow-2xs transition-colors"
                  aria-label="ACF Twitter"
                >
                  <TwitterIcon size={17} />
                </a>
              )}
              {settings.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-[#dbe6de] flex items-center justify-center text-[#1e7e48] hover:text-white hover:bg-[#1e7e48] hover:border-[#1e7e48] shadow-2xs transition-colors"
                  aria-label="ACF LinkedIn"
                >
                  <LinkedinIcon size={17} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#122419]">
              Organisation
            </h3>
            <ul className="space-y-2 text-sm text-[#526658]">
              <li>
                <Link href="/about" className="hover:text-[#1e7e48] transition-colors">
                  About ACF &amp; Mission
                </Link>
              </li>
              <li>
                <Link href="/about/board" className="hover:text-[#1e7e48] transition-colors">
                  Board of Directors
                </Link>
              </li>
              <li>
                <Link href="/about/secretariat" className="hover:text-[#1e7e48] transition-colors">
                  Secretariat
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-[#1e7e48] transition-colors">
                  Partners &amp; Networks
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Programmes & Knowledge */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#122419]">
              Programmes &amp; Work
            </h3>
            <ul className="space-y-2 text-sm text-[#526658]">
              <li>
                <Link href="/our-work" className="hover:text-[#1e7e48] transition-colors">
                  All Thematic Areas
                </Link>
              </li>
              <li>
                <Link href="/publications" className="hover:text-[#1e7e48] transition-colors">
                  Knowledge Hub
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#1e7e48] transition-colors">
                  News &amp; Sector Updates
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#1e7e48] transition-colors">
                  Policy Dialogues
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-[#1e7e48] transition-colors">
                  Opportunities &amp; Tenders
                </Link>
              </li>
              <li>
                <Link href="/facebook-posts" className="hover:text-[#1e7e48] transition-colors">
                  Social Highlights
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Secretariat Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#122419]">
              Secretariat
            </h3>
            <div className="space-y-2.5 text-xs text-[#526658] leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#1e7e48] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#1e7e48] shrink-0" />
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-[#1e7e48] transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#1e7e48] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-[#1e7e48] transition-colors">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock size={15} className="text-[#1e7e48] shrink-0 mt-0.5" />
                <span>{settings.office_hours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Compliance Section */}
      <div className="bg-white border-t border-[#dbe6de] py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#526658]">
          <div>
            © {currentYear} Agricultural Consultative Forum (ACF). All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-[#1e7e48] transition-colors">
              Privacy Policy &amp; Consent
            </Link>
            <span className="text-[#dbe6de]">•</span>
            <Link href="/contact" className="hover:text-[#1e7e48] transition-colors">
              Contact Secretariat
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
