import { Mail, User } from 'lucide-react'
import { LinkedinIcon } from '@/components/ui/SocialIcons'

export interface Person {
  id: string
  name: string
  position: string
  bio?: string | null
  photo_url?: string | null
  email?: string | null
  linkedin_url?: string | null
  group_type: 'board' | 'management' | 'staff'
}

export default function PersonCard({ person }: { person: Person }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e2ebe4] p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
      <div>
        {/* Photo or placeholder avatar */}
        <div className="w-20 h-20 rounded-2xl bg-[#175432] text-white flex items-center justify-center font-bold text-2xl shadow-md border border-[#2da44e]/30 mb-5">
          {person.name.replace('[PLACEHOLDER] ', '').charAt(0)}
        </div>

        <h3 className="text-lg font-bold text-[#0f1d14] leading-tight">
          {person.name}
        </h3>

        <div className="text-xs font-semibold text-[#175432] mt-1 uppercase tracking-wider">
          {person.position}
        </div>

        {person.bio && (
          <p className="text-xs text-[#5c6f62] mt-3 leading-relaxed line-clamp-4">
            {person.bio}
          </p>
        )}
      </div>

      {(person.email || person.linkedin_url) && (
        <div className="pt-5 border-t border-[#e2ebe4] mt-5 flex items-center gap-3">
          {person.email && (
            <a
              href={`mailto:${person.email}`}
              className="text-[#5c6f62] hover:text-[#175432] transition-colors"
              aria-label={`Email ${person.name}`}
            >
              <Mail size={16} />
            </a>
          )}
          {person.linkedin_url && (
            <a
              href={person.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5c6f62] hover:text-[#175432] transition-colors"
              aria-label={`LinkedIn for ${person.name}`}
            >
              <LinkedinIcon size={16} />
            </a>
          )}
        </div>
      )}
    </div>
  )
}
