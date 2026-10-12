import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Clock, ExternalLink, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDateTime, formatDate } from '@/lib/utils/formatters'
import { constructMetadata } from '@/lib/utils/seo'

interface EventDetailProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: EventDetailProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: evt } = await supabase
    .from('events')
    .select('title, description')
    .eq('slug', slug)
    .single()

  const evtItem = evt as any
  if (!evtItem) {
    return constructMetadata({ title: 'Event' })
  }

  return constructMetadata({
    title: `${evtItem.title} | Events & Dialogues`,
    description: evtItem.description,
    pathname: `/events/${slug}`,
  })
}

export default async function EventDetailPage({ params }: EventDetailProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: evtData } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  const evt =
    evtData ||
    (slug === 'annual-agricultural-policy-symposium-2026'
      ? {
          id: '55555555-5555-5555-5555-555555555501',
          slug: 'annual-agricultural-policy-symposium-2026',
          title: 'Annual Zambia Agricultural Policy Symposium 2026',
          description:
            'A two-day national symposium gathering policymakers, agricultural economists, and farmer leaders to discuss Zambia’s agricultural transformation roadmap.\n\nKey themes include climate-smart farming, drought mitigation financing, and market access.',
          starts_at: '2026-11-18T06:30:00Z',
          ends_at: '2026-11-19T15:00:00Z',
          venue: 'Mulungushi International Conference Centre, Lusaka',
          virtual_url: null,
          registration_url: '/membership/apply',
        }
      : null)

  if (!evt) {
    notFound()
  }

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#0f1d14] text-white py-16 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl space-y-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Events</span>
          </Link>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1e462f] text-[#a3e635] border border-[#2da44e]/40 inline-block">
            Consultative Dialogue
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {evt.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200/80 pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#a3e635]" />
              <span>{formatDateTime(evt.starts_at)}</span>
            </span>
            {evt.venue && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#a3e635]" />
                <span>{evt.venue}</span>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-4xl pt-16 space-y-8">
        <div className="bg-white rounded-3xl border border-[#e2ebe4] p-8 sm:p-12 shadow-xs space-y-8">
          <div>
            <h2 className="text-xl font-bold text-[#0f1d14] mb-3">Event Agenda & Details</h2>
            <p className="text-base sm:text-lg text-[#3b4d41] leading-relaxed whitespace-pre-line">
              {evt.description}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#f6f9f6] border border-[#e2ebe4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#0f1d14]">Participation & Registration</h3>
              <p className="text-xs text-[#5c6f62]">
                Open to accredited farmer associations, agribusiness executives, researchers, and government officials.
              </p>
            </div>

            {evt.registration_url && (
              <Link
                href={evt.registration_url}
                className="px-6 py-3.5 bg-[#175432] hover:bg-[#114227] text-white font-bold text-xs rounded-xl shadow-md transition-colors shrink-0"
              >
                Register Online
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
