import { Mail } from 'lucide-react'
import ContentImage from '@/components/ui/ContentImage'
import { LinkedinIcon, TwitterIcon, FacebookIcon } from '@/components/ui/SocialIcons'

export interface Person {
  id: string
  name: string
  position: string
  bio?: string | null
  photo_url?: string | null
  email?: string | null
  linkedin_url?: string | null
  twitter_url?: string | null
  facebook_url?: string | null
  group_type: 'board' | 'management' | 'staff'
}

export default function PersonCard({ person }: { person: Person }) {
  const displayName = person.name.replace('[PLACEHOLDER] ', '')
  const hasSocials =
    person.email || person.linkedin_url || person.twitter_url || person.facebook_url

  return (
    <div className="bg-white rounded-2xl border border-[#dbe6de] p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
      <div>
        {/* Photo ID or Initials Avatar */}
        {person.photo_url ? (
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-neutral-100 border border-[#dbe6de] shadow-sm mb-5 group-hover:scale-105 transition-transform duration-300">
            <ContentImage
              src={person.photo_url}
              alt={displayName}
              className="object-cover object-top"
            />
          </div>
        ) : (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#1e7e48] text-white flex items-center justify-center font-black text-2xl shadow-sm border border-[#2e9e5b]/30 mb-5">
            {displayName.charAt(0)}
          </div>
        )}

        <h3 className="text-lg font-bold text-[#122419] leading-tight group-hover:text-[#1e7e48] transition-colors">
          {displayName}
        </h3>

        <div className="text-xs font-semibold text-[#1e7e48] mt-1.5 uppercase tracking-wider">
          {person.position}
        </div>

        {person.bio && (
          <p className="text-xs text-[#526658] mt-3 leading-relaxed line-clamp-4">
            {person.bio}
          </p>
        )}
      </div>

      {hasSocials && (
        <div className="pt-4 border-t border-[#dbe6de] mt-5 flex items-center gap-2">
          {person.email && (
            <a
              href={`mailto:${person.email}`}
              className="w-8 h-8 rounded-full bg-[#eef6f1] text-[#1e7e48] hover:bg-[#1e7e48] hover:text-white flex items-center justify-center transition-colors"
              aria-label={`Email ${displayName}`}
              title="Email"
            >
              <Mail size={14} />
            </a>
          )}
          {person.linkedin_url && (
            <a
              href={person.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#eef6f1] text-[#1e7e48] hover:bg-[#1e7e48] hover:text-white flex items-center justify-center transition-colors"
              aria-label={`LinkedIn for ${displayName}`}
              title="LinkedIn"
            >
              <LinkedinIcon size={14} />
            </a>
          )}
          {person.twitter_url && (
            <a
              href={person.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#eef6f1] text-[#1e7e48] hover:bg-[#1e7e48] hover:text-white flex items-center justify-center transition-colors"
              aria-label={`Twitter/X for ${displayName}`}
              title="Twitter / X"
            >
              <TwitterIcon size={14} />
            </a>
          )}
          {person.facebook_url && (
            <a
              href={person.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#eef6f1] text-[#1e7e48] hover:bg-[#1e7e48] hover:text-white flex items-center justify-center transition-colors"
              aria-label={`Facebook for ${displayName}`}
              title="Facebook"
            >
              <FacebookIcon size={14} />
            </a>
          )}
        </div>
      )}
    </div>
  )
}
