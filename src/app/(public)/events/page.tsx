import Link from 'next/link'
import { Calendar, MapPin, Clock, ArrowRight, ExternalLink } from 'lucide-react'
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

  const defaultUpcoming = [
    {
      id: '55555555-5555-5555-5555-555555555501',
      slug: 'annual-agricultural-policy-symposium-2026',
      title: 'Annual Zambia Agricultural Policy Symposium 2026',
      description:
        'A two-day national symposium gathering policymakers, agricultural economists, and farmer leaders to discuss Zambia’s agricultural transformation roadmap.',
      starts_at: '2026-11-18T06:30:00Z',
      ends_at: '2026-11-19T15:00:00Z',
      venue: 'Mulungushi International Conference Centre, Lusaka',
      registration_url: '/membership/apply',
    },
    {
      id: '55555555-5555-5555-5555-555555555502',
      slug: 'workshop-land-tenure-governance-2026',
      title: 'Multi-Stakeholder Workshop on Customary Land Tenure',
      description:
        'Deliberations on equitable land allocation and tenure documentation guidelines for small-scale rural producers.',
      starts_at: '2026-10-28T07:00:00Z',
      ends_at: '2026-10-28T14:00:00Z',
      venue: 'Golden Peacock Hotel, Lusaka',
      registration_url: null,
    },
  ]

  const defaultPast = [
    {
      id: '55555555-5555-5555-5555-555555555503',
      slug: 'seed-systems-stakeholder-forum-2025',
      title: 'National Seed Systems & Climate Adaptation Forum',
      description:
        'Review of certified seed varieties and community seed bank systems in drought-prone agro-ecological zones.',
      starts_at: '2025-09-12T07:00:00Z',
      venue: 'Cresta Golfview Hotel, Lusaka',
    },
  ]

  const upcomingEvents = upcomingData && upcomingData.length > 0 ? upcomingData : defaultUpcoming
  const pastEvents = pastData && pastData.length > 0 ? pastData : defaultPast

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0f1d14] via-[#142d1f] to-[#175432] text-white py-16 lg:py-20 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#a3e635] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 inline-block">
            ACF Stakeholder Convenings
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Events & Dialogue Forums
          </h1>
          <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            High-level policy roundtables, annual symposiums, and consultative workshops convened across Zambia.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-5xl pt-16 space-y-16">
        {/* Section 1: Upcoming Events */}
        <section className="space-y-6">
          <div className="border-b border-[#e2ebe4] pb-3 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-[#0f1d14]">Upcoming Events</h2>
            <span className="text-xs font-bold text-[#175432] bg-[#f0f6f1] px-3 py-1 rounded-full">
              {upcomingEvents.length} Scheduled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.slug}
                className="bg-white rounded-3xl border border-[#e2ebe4] p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#175432]">
                    <Calendar size={15} />
                    <span>{formatDateTime(evt.starts_at)}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0f1d14] hover:text-[#175432] transition-colors leading-snug">
                    <Link href={`/events/${evt.slug}`}>{evt.title}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5c6f62] leading-relaxed line-clamp-3">
                    {evt.description}
                  </p>

                  {evt.venue && (
                    <div className="flex items-center gap-1.5 text-xs text-[#3b4d41] font-semibold pt-2">
                      <MapPin size={14} className="text-[#175432]" />
                      <span>{evt.venue}</span>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-[#e2ebe4] mt-6 flex items-center justify-between">
                  <Link
                    href={`/events/${evt.slug}`}
                    className="text-xs font-bold text-[#175432] hover:underline"
                  >
                    View Details
                  </Link>

                  {evt.registration_url && (
                    <Link
                      href={evt.registration_url}
                      className="px-4 py-2 bg-[#175432] hover:bg-[#114227] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      Register
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Past Events */}
        <section className="space-y-6">
          <div className="border-b border-[#e2ebe4] pb-3">
            <h2 className="text-xl font-bold text-[#5c6f62]">Past Dialogue Forums & Proceedings</h2>
          </div>

          <div className="space-y-4">
            {pastEvents.map((evt) => (
              <div
                key={evt.slug}
                className="bg-white rounded-2xl border border-[#e2ebe4] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-80"
              >
                <div className="space-y-1">
                  <div className="text-xs text-[#5c6f62] font-semibold">
                    Concluded on {formatDate(evt.starts_at)}
                  </div>
                  <h3 className="text-base font-bold text-[#0f1d14]">
                    <Link href={`/events/${evt.slug}`} className="hover:text-[#175432]">
                      {evt.title}
                    </Link>
                  </h3>
                  <div className="text-xs text-[#5c6f62]">{evt.venue}</div>
                </div>

                <Link
                  href={`/events/${evt.slug}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-[#0f1d14] rounded-lg transition-colors shrink-0"
                >
                  View Proceedings
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
