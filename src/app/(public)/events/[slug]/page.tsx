import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  FileText,
  Download,
  Lock,
  Sparkles,
  Users,
  UserPlus,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDateTime } from '@/lib/utils/formatters'
import { constructMetadata } from '@/lib/utils/seo'
import { renderRichText } from '@/lib/content/richText'
import {
  fetchDialogueRegistrations,
  getDialogueDocuments,
  getDialogueEventMetaMap,
  isDialogueClosed,
  mergeEventWithDialogueMeta,
} from '@/lib/supabase/dialogues'
import DialogueJoinForm from '@/components/events/DialogueJoinForm'

export const dynamic = 'force-dynamic'

interface EventDetailProps {
  params: Promise<{ slug: string }>
}

const FALLBACK_DIALOGUES: Record<string, any> = {
  'workshop-land-tenure-governance-2026': {
    id: '55555555-5555-5555-5555-555555555502',
    slug: 'workshop-land-tenure-governance-2026',
    title: 'Multi-Stakeholder Workshop on Customary Land Tenure',
    description:
      'Consultative dialogue reviewing the implementation guidelines for customary land documentation, smallholder tenure security, and gender-inclusive title protection across provinces.',
    starts_at: '2026-08-28T07:00:00Z',
    ends_at: '2026-08-28T14:30:00Z',
    venue: 'Golden Peacock Hotel, Lusaka',
    is_closed: true,
    dialogue_state: 'closed',
    status: 'published',
  },
  'fisp-e-voucher-modalities-review-2026': {
    id: '55555555-5555-5555-5555-555555555503',
    slug: 'fisp-e-voucher-modalities-review-2026',
    title: 'National Review of FISP E-Voucher Agro-Dealer Modalities',
    description:
      'Post-season technical assessment of the Farmer Input Support Programme (FISP) electronic voucher redemption performance, input supply chain bottlenecks, and agro-dealer liquidity.',
    starts_at: '2026-06-15T07:30:00Z',
    ends_at: '2026-06-15T15:00:00Z',
    venue: 'Taj Pamodzi Hotel, Lusaka',
    is_closed: true,
    dialogue_state: 'closed',
    status: 'published',
  },
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

  const evtItem = (evt as any) || FALLBACK_DIALOGUES[slug]
  if (!evtItem) {
    return constructMetadata({ title: 'Policy Dialogue' })
  }

  return constructMetadata({
    title: `${evtItem.title} | Policy Dialogues`,
    description: evtItem.description,
    pathname: `/events/${slug}`,
  })
}

export default async function EventDetailPage({ params }: EventDetailProps) {
  const { slug } = await params
  const supabase = await createClient()

  const [{ data: rawEvt }, metaMap, registrations] = await Promise.all([
    supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle(),
    getDialogueEventMetaMap(supabase),
    fetchDialogueRegistrations(supabase),
  ])

  const baseEvt = (rawEvt as any) || FALLBACK_DIALOGUES[slug]
  if (!baseEvt) {
    notFound()
  }

  const evt = mergeEventWithDialogueMeta(baseEvt, metaMap)
  const closed = isDialogueClosed(evt)
  const docs = getDialogueDocuments(evt)

  const approvedParticipants = registrations.filter(
    (r) =>
      r.status === 'approved' && (r.event_slug === evt.slug || r.event_id === evt.id)
  )

  return (
    <div className="bg-[#f7faf8] min-h-screen pb-24">
      {/* Header Banner */}
      <section className="bg-[#122419] text-white py-16 border-b border-[#1e4a32]">
        <div className="container mx-auto px-4 max-w-4xl space-y-4">
          <Link
            href={closed ? '/events?tab=closed' : '/events?tab=active'}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to {closed ? 'Closed' : 'Active'} Policy Dialogues</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                closed
                  ? 'bg-white/10 text-gray-200 border-white/20'
                  : 'bg-[#1e7e48] text-white border-[#86efac]/30'
              }`}
            >
              {closed ? <Lock size={12} /> : <Sparkles size={12} />}
              <span>{closed ? 'Closed Dialogue' : 'Active Policy Dialogue'}</span>
            </span>

            {approvedParticipants.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-[#eab308] border border-white/15">
                <Users size={12} />
                <span>
                  {approvedParticipants.length} Approved Stakeholder
                  {approvedParticipants.length > 1 ? 's' : ''}
                </span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {evt.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-emerald-100/90 pt-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#eab308]" />
              <span>{formatDateTime(evt.starts_at)}</span>
            </div>
            {evt.ends_at && (
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#eab308]" />
                <span>Ends: {formatDateTime(evt.ends_at)}</span>
              </div>
            )}
            {evt.venue && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#eab308]" />
                <span>{evt.venue}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-4xl pt-12 space-y-10">
        {/* About This Forum */}
        <div className="bg-white rounded-3xl border border-[#dbe6de] p-8 sm:p-10 shadow-xs space-y-6">
          <h2 className="text-2xl font-bold text-[#122419]">
            Dialogue Overview & Policy Objectives
          </h2>
          <div
            className="prose-acf text-base leading-relaxed text-[#2d3f33] whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: renderRichText(evt.description || '') }}
          />

          {/* Action Strip */}
          <div className="pt-6 border-t border-[#dbe6de] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs text-[#526658]">
              Convened by the Agricultural Consultative Forum (ACF) Secretariat.
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {evt.virtual_url && (
                <a
                  href={evt.virtual_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full border border-[#1e7e48] text-[#1e7e48] hover:bg-[#eef6f1] text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Virtual Stream Link</span>
                  <ExternalLink size={13} />
                </a>
              )}

              {!closed && (
                <a
                  href="#join-dialogue"
                  className="px-6 py-2.5 bg-[#1e7e48] hover:bg-[#166538] text-white text-xs font-bold rounded-full transition-colors shadow-md inline-flex items-center gap-1.5"
                >
                  <UserPlus size={14} />
                  <span>Request to Join Dialogue</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Attached PDF Documents Section */}
        {docs.length > 0 && (
          <div className="bg-white rounded-3xl border border-[#dbe6de] p-8 sm:p-10 shadow-xs space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#1e7e48]">
                  Briefing Materials & Proceedings
                </span>
                <h2 className="text-xl font-bold text-[#122419] mt-0.5">
                  Attached Policy Dialogue Documents (PDF)
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                {docs.length} PDF{docs.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {docs.map((doc, idx) => (
                <a
                  key={idx}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 rounded-2xl bg-[#f6f9f6] hover:bg-[#edf5ef] border border-[#dbe6de] hover:border-[#1e7e48] flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 border border-red-200">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#122419] group-hover:text-[#1e7e48] truncate">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-[#526658]">
                        PDF Document · Click to view or download
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#dbe6de] flex items-center justify-center text-[#1e7e48] shrink-0">
                    <Download size={14} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Join Dialogue Section (for Active Dialogues) or Concluded Banner (for Closed Dialogues) */}
        {!closed ? (
          <DialogueJoinForm
            eventId={evt.id}
            eventSlug={evt.slug}
            eventTitle={evt.title}
          />
        ) : (
          <div className="bg-white rounded-3xl border border-[#dbe6de] p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center mx-auto">
              <Lock size={22} />
            </div>
            <h3 className="text-lg font-bold text-[#122419]">
              This Policy Dialogue Has Concluded
            </h3>
            <p className="text-xs sm:text-sm text-[#526658] max-w-lg mx-auto">
              Participant registration for this session is now closed. You can explore currently active dialogues or propose a follow-up policy dialogue topic on the main Policy Dialogues page.
            </p>
            <div className="pt-2">
              <Link
                href="/events?tab=active"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e7e48] text-white text-xs font-bold hover:bg-[#166538] transition-colors"
              >
                <span>Explore Active Dialogues</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
