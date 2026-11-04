import Link from 'next/link'
import { Calendar, MapPin, Users, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDateTime, formatDate } from '@/lib/utils/formatters'
import { constructMetadata } from '@/lib/utils/seo'

export const metadata = constructMetadata({
  title: 'Policy Dialogues | Facilitating Inclusive Sector Solutions',
  description:
    'The ACF hosts targeted consultative forums designed to convert sector data into structural policy directives across Zambia.',
  pathname: '/events',
})

export default async function PolicyDialoguesPage() {
  const supabase = await createClient()

  const nowIso = new Date().toISOString()

  // Upcoming dialogues & events: starts_at >= now
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

  const activeWorkingGroups = [
    {
      title: 'El Niño & Climate Risk Mitigation Forums',
      description:
        'Designing agricultural advisories and hydro-meteorological response strategies for farming seasons.',
      badge: 'Active Taskforce',
      icon: ShieldAlert,
    },
    {
      title: 'Beef Export Competitiveness Study',
      description:
        'Institutional assessments and animal health frameworks for market access into Angola and the Democratic Republic of Congo (DRC).',
      badge: 'Trade & Livestock',
      icon: Users,
    },
    {
      title: 'National Agriculture Investment Plan (NAIP) Consultations',
      description:
        'Tracking public spending, budget transparency, and agricultural sector performance metrics.',
      badge: 'Budget & Policy',
      icon: Sparkles,
    },
  ]

  // Default featured upcoming event if none scheduled in DB
  const defaultUpcoming = [
    {
      slug: 'november-stakeholder-consultations',
      title: 'November Stakeholder Consultations',
      description:
        'Comprehensive multi-stakeholder sessions covering Stakeholder Engagements, Policy Research & Studies, and Finance & Administration agendas.',
      starts_at: '2026-11-28T09:00:00Z',
      venue: 'Lusaka & Virtual Webcast',
      registration_url: '/contact?subject=Register+for+November+Stakeholder+Consultations',
    },
  ]

  const displayUpcoming = upcomingEvents.length > 0 ? upcomingEvents : defaultUpcoming

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#153e28] text-white py-16 lg:py-20 border-b border-[#1e4a32]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white bg-white/15 px-3.5 py-1.5 rounded-full border border-white/20 inline-block">
            ACF Policy Dialogues
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Facilitating Inclusive Sector Solutions
          </h1>
          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            The ACF hosts targeted consultative forums designed to convert sector data into structural policy directives.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-5xl pt-16 space-y-16">
        {/* Active Discussions & Working Groups */}
        <section className="space-y-6">
          <div className="border-b border-[#dbe6de] pb-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#1e7e48]">
                Consultative Working Groups
              </span>
              <h2 className="text-2xl font-extrabold text-[#122419]">
                Active Discussions &amp; Working Groups
              </h2>
            </div>
            <span className="text-xs font-bold text-[#1e7e48] bg-[#eef6f1] px-3 py-1 rounded-full border border-[#dbe6de]">
              3 Ongoing Caucuses
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeWorkingGroups.map((wg) => {
              const Icon = wg.icon
              return (
                <div
                  key={wg.title}
                  className="bg-white rounded-3xl border border-[#dbe6de] p-6 shadow-xs hover:border-[#1e7e48]/50 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#eef6f1] text-[#1e7e48] flex items-center justify-center font-bold">
                        <Icon size={20} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f4f8f5] text-[#1e7e48] border border-[#dbe6de]">
                        {wg.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#122419] leading-snug">
                      {wg.title}
                    </h3>

                    <p className="text-xs text-[#526658] leading-relaxed">
                      {wg.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#f4f8f5]">
                    <Link
                      href="/contact?subject=Join+Working+Group+Discussion"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e7e48] hover:text-[#166538]"
                    >
                      <span>Inquire to Join</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Section 1: Upcoming Events Calendar */}
        <section className="space-y-6">
          <div className="border-b border-[#dbe6de] pb-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#1e7e48]">
                Calendar
              </span>
              <h2 className="text-2xl font-extrabold text-[#122419]">Upcoming Events Calendar</h2>
            </div>
            <span className="text-xs font-bold text-[#1e7e48] bg-[#eef6f1] px-3 py-1 rounded-full border border-[#dbe6de]">
              {displayUpcoming.length} Scheduled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayUpcoming.map((evt) => (
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

                <div className="pt-6 border-t border-[#dbe6de] mt-6 flex items-center justify-between gap-3">
                  <Link
                    href={`/events/${evt.slug}`}
                    className="text-xs font-bold text-[#1e7e48] hover:underline"
                  >
                    View Details
                  </Link>

                  <Link
                    href={evt.registration_url || `/contact?subject=Register+for+${encodeURIComponent(evt.title)}`}
                    className="px-5 py-2.5 bg-[#1e7e48] hover:bg-[#166538] text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    Register to Attend / Request Invitation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Past Events */}
        {pastEvents.length > 0 && (
          <section className="space-y-6">
            <div className="border-b border-[#dbe6de] pb-3">
              <h2 className="text-xl font-bold text-[#526658]">Past Dialogue Forums &amp; Proceedings</h2>
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
