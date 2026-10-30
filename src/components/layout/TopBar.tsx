import Link from 'next/link'
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import { SiteSettings } from '@/lib/supabase/settings'

interface TopBarProps {
  settings: SiteSettings
}

export default function TopBar({ settings }: TopBarProps) {
  return (
    <div className="bg-[#0f1d14] text-white text-xs border-b border-[#1b3424] py-2 px-4 transition-colors">
      <div className="container mx-auto flex flex-row justify-between items-center gap-2">
        {/* Institutional tagline without contact details (Feedback 1.3) */}
        <div className="hidden sm:flex items-center gap-2 text-emerald-100/75">
          <span className="font-medium">
            {settings.tagline || 'Multi-stakeholder Agricultural Policy Platform — Zambia'}
          </span>
        </div>

        {/* Quick action links & socials */}
        <div className="flex items-center gap-4 ml-auto">
          <Link
            href="/opportunities"
            className="text-emerald-200 hover:text-white font-medium transition-colors"
          >
            Opportunities &amp; Tenders
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

