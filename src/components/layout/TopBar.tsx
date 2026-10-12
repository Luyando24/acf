import Link from 'next/link'
import { Phone, Mail, Clock } from 'lucide-react'
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import { SiteSettings } from '@/lib/supabase/settings'

interface TopBarProps {
  settings: SiteSettings
}

export default function TopBar({ settings }: TopBarProps) {
  return (
    <div className="bg-[#0f1d14] text-white text-xs border-b border-[#1b3424] py-2 px-4 transition-colors">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Contact details & location */}
        <div className="flex flex-wrap items-center gap-4 text-emerald-100/80">
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Clock size={13} className="text-[#65c466]" />
            <span>Lusaka (CAT) • Mon - Fri 08:00 - 17:00</span>
          </span>
          {settings.phone && (
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone size={13} className="text-[#65c466]" />
              <span>{settings.phone}</span>
            </a>
          )}
          {settings.email && (
            <a
              href={`mailto:${settings.email}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail size={13} className="text-[#65c466]" />
              <span>{settings.email}</span>
            </a>
          )}
        </div>

        {/* Quick action links & socials */}
        <div className="flex items-center gap-4 ml-auto">
          <Link
            href="/opportunities"
            className="text-emerald-200 hover:text-white font-medium transition-colors"
          >
            Opportunities & Tenders
          </Link>
          <span className="text-emerald-800">|</span>
          <Link
            href="/admin/login"
            className="text-emerald-300 hover:text-white font-medium transition-colors"
          >
            Staff Portal
          </Link>
          <div className="flex items-center gap-2 pl-2 border-l border-emerald-900">
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 hover:text-white transition-colors p-1"
                aria-label="ACF Facebook"
              >
                <FacebookIcon size={13} />
              </a>
            )}
            {settings.twitter_url && (
              <a
                href={settings.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 hover:text-white transition-colors p-1"
                aria-label="ACF Twitter"
              >
                <TwitterIcon size={13} />
              </a>
            )}
            {settings.linkedin_url && (
              <a
                href={settings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 hover:text-white transition-colors p-1"
                aria-label="ACF LinkedIn"
              >
                <LinkedinIcon size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
