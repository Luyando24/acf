import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Clock, ExternalLink } from 'lucide-react'
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
    .eq('status', 'published')
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

  const { data: rawEvt } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!rawEvt) {
    notFound()
  }

  const evt = rawEvt as any

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#153e28] text-white py-16 border-b border-[#1e4a32]">
        <div className="container mx-auto px-4 max-w-4xl space-y-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Events</span>
          </Link>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-white border border-white/20 inline-block">
            Consultative Dialogue
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {evt.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-emerald-100/90 pt-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-emerald-300" />
              <span>{formatDateTime(evt.starts_at)}</span>
            </div>
            {evt.ends_at && (
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-emerald-300" />
                <span>Ends: {formatDateTime(evt.ends_at)}</span>
              </div>
            )}
            {evt.venue && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-emerald-300" />
                <span>{evt.venue}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-4xl pt-12 space-y-12">
        <div className="bg-white rounded-3xl border border-[#dbe6de] p-8 sm:p-12 shadow-xs space-y-8">
          <h2 className="text-2xl font-bold text-[#122419]">About this Forum</h2>
          <div className="prose-acf text-base sm:text-lg leading-relaxed text-[#2d3f33] whitespace-pre-line">
            {evt.description}
          </div>

          {/* Action Strip */}
          <div className="pt-8 border-t border-[#dbe6de] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs text-[#526658]">
              Event organized by the Agricultural Consultative Forum Secretariat.
            </div>

            <div className="flex items-center gap-3">
              {evt.virtual_url && (
                <a
                  href={evt.virtual_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full border border-[#1e7e48] text-[#1e7e48] hover:bg-[#eef6f1] text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Virtual Link</span>
                  <ExternalLink size={13} />
                </a>
              )}

              {evt.registration_url && (
                <a
                  href={evt.registration_url}
                  className="px-6 py-2.5 bg-[#1e7e48] hover:bg-[#166538] text-white text-xs font-bold rounded-full transition-colors shadow-md"
                >
                  Register to Attend
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
