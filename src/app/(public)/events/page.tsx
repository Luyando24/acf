import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDateTime, formatDate } from '@/lib/utils/formatters'
import { constructMetadata } from '@/lib/utils/seo'

export const metadata = constructMetadata({
  title: 'Events & Policy Dialogues | Upcoming & Past Forums',
  description:
    'Join national agricultural policy symposiums, stakeholder roundtables, and consultative workshops organized by the Agricultural Consultative Forum.',
  pathname: '/events',
})

export default async function EventsPage() {
  const supabase = await createClient()

  const nowIso = new Date().toISOString()

  // Upcoming events: starts_at >= now
  const { data: upcomingData } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .gte('starts_at', nowIso)
    .order('starts_at', { ascending: true })

  // Past events: starts_at < now
  const { data: pastData } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .lt('starts_at', nowIso)
    .order('starts_at', { ascending: false })

  const upcomingEvents = (upcomingData || []) as any[]
  const pastEvents = (pastData || []) as any[]

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#153e28] text-white py-16 lg:py-20 border-b border-[#1e4a32]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white bg-white/15 px-3.5 py-1.5 rounded-full border border-white/20 inline-block">
            ACF Stakeholder Convenings
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Events & Dialogue Forums
          </h1>
          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            High-level policy roundtables, annual symposiums, and consultative workshops convened across Zambia.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-5xl pt-16 space-y-16">
        {/* Section 1: Upcoming Events */}
        <section className="space-y-6">
          <div className="border-b border-[#dbe6de] pb-3 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-[#122419]">Upcoming Events</h2>
            <span className="text-xs font-bold text-[#1e7e48] bg-[#eef6f1] px-3 py-1 rounded-full">
              {upcomingEvents.length} Scheduled
            </span>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.slug}
                  className="bg-white rounded-3xl border border-[#dbe6de] p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1e7e48]">
                      <Calendar size={15} />
                      <span>{formatDateTime(evt.starts_at)}</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#122419] hover:text-[#1e7e48] transition-colors leading-snug">
                      <Link href={`/events/${evt.slug}`}>{evt.title}</Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-[#526658] leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>

                    {evt.venue && (
                      <div className="flex items-center gap-1.5 text-xs text-[#2d3f33] font-semibold pt-2">
                        <MapPin size={14} className="text-[#1e7e48]" />
                        <span>{evt.venue}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-[#dbe6de] mt-6 flex items-center justify-between">
                    <Link
                      href={`/events/${evt.slug}`}
                      className="text-xs font-bold text-[#1e7e48] hover:underline"
                    >
                      View Details
                    </Link>

                    {evt.registration_url && (
                      <Link
                        href={evt.registration_url}
                        className="px-4 py-2 bg-[#1e7e48] hover:bg-[#166538] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        Register
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#dbe6de] p-8 max-w-md mx-auto">
              <p className="text-base font-semibold text-[#122419]">No upcoming events currently scheduled</p>
              <p className="text-xs text-[#526658] mt-1">New dialogues and symposium announcements will appear here.</p>
            </div>
          )}
        </section>

        {/* Section 2: Past Events */}
        {pastEvents.length > 0 && (
          <section className="space-y-6">
            <div className="border-b border-[#dbe6de] pb-3">
              <h2 className="text-xl font-bold text-[#526658]">Past Dialogue Forums & Proceedings</h2>
            </div>

            <div className="space-y-4">
              {pastEvents.map((evt) => (
                <div
                  key={evt.slug}
                  className="bg-white rounded-2xl border border-[#dbe6de] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-80"
                >
                  <div className="space-y-1">
                    <div className="text-xs text-[#526658] font-semibold">
                      Concluded on {formatDate(evt.starts_at)}
                    </div>
                    <h3 className="text-base font-bold text-[#122419]">
                      <Link href={`/events/${evt.slug}`} className="hover:text-[#1e7e48]">
                        {evt.title}
                      </Link>
                    </h3>
                    <div className="text-xs text-[#526658]">{evt.venue}</div>
                  </div>

                  <Link
                    href={`/events/${evt.slug}`}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-[#122419] rounded-lg transition-colors shrink-0"
                  >
                    View Proceedings
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
