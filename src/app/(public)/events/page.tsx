import { createClient } from '@/lib/supabase/server'
import { constructMetadata } from '@/lib/utils/seo'
import {
  fetchDialogueRegistrations,
  getDialogueEventMetaMap,
  isDialogueClosed,
  mergeEventWithDialogueMeta,
} from '@/lib/supabase/dialogues'
import PolicyDialoguesClient, {
  PublicDialogueEvent,
} from '@/components/events/PolicyDialoguesClient'

export const dynamic = 'force-dynamic'

export const metadata = constructMetadata({
  title: 'Policy Dialogues | Facilitating Inclusive Sector Solutions',
  description:
    'The ACF hosts targeted consultative forums designed to convert sector data into structural policy directives across Zambia. Join active dialogues, view closed proceedings, or propose a new policy dialogue.',
  pathname: '/events',
})

interface EventsPageProps {
  searchParams: Promise<{ tab?: string }>
}

const DEFAULT_ACTIVE_DIALOGUES: PublicDialogueEvent[] = [
  {
    id: '55555555-5555-5555-5555-555555555501',
    slug: 'annual-agricultural-policy-symposium-2026',
    title: 'Annual Zambia Agricultural Policy Symposium 2026',
    description:
      'The premier national gathering of agricultural policy makers, producer groups, agribusinesses, and financial institutions assessing national agricultural performance and investment priorities.',
    starts_at: '2026-11-18T06:30:00Z',
    ends_at: '2026-11-19T15:00:00Z',
    venue: 'Mulungushi International Conference Centre, Lusaka',
    virtual_url: 'https://zoom.us/j/symposium2026',
    is_closed: false,
    dialogue_state: 'active',
    status: 'published',
  },
  {
    id: '55555555-5555-5555-5555-555555555504',
    slug: 'november-stakeholder-consultations',
    title: 'November Stakeholder Consultations',
    description:
      'Comprehensive multi-stakeholder sessions covering Stakeholder Engagements, Policy Research & Studies, and Finance & Administration agendas.',
    starts_at: '2026-11-28T09:00:00Z',
    ends_at: '2026-11-28T17:00:00Z',
    venue: 'Lusaka & Virtual Webcast',
    is_closed: false,
    dialogue_state: 'active',
    status: 'published',
  },
]

const DEFAULT_CLOSED_DIALOGUES: PublicDialogueEvent[] = [
  {
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
  {
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
]

const ONGOING_WORKING_GROUPS = [
  {
    title: 'El Niño & Climate Risk Mitigation Forums',
    category: 'Active Taskforce',
    schedule: 'Monthly Consultative Series',
    venue: 'Lusaka & Virtual',
    description:
      'Designing agricultural advisories and hydro-meteorological response strategies for farming seasons.',
  },
  {
    title: 'Beef Export Competitiveness Study Forum',
    category: 'Trade & Livestock',
    schedule: 'Quarterly Technical Review',
    venue: 'Mulungushi International Conference Centre, Lusaka',
    description:
      'Institutional assessments and animal health frameworks for market access into Angola and the Democratic Republic of Congo (DRC).',
  },
  {
    title: 'National Agriculture Investment Plan (NAIP) Consultations',
    category: 'Budget & Policy',
    schedule: 'Bi-Monthly Working Group',
    venue: 'Taj Pamodzi Hotel, Lusaka',
    description:
      'Tracking public spending, budget transparency, and agricultural sector performance metrics.',
  },
]

export default async function PolicyDialoguesPage({ searchParams }: EventsPageProps) {
  const params = await searchParams
  const initialTab = params.tab === 'closed' ? 'closed' : 'active'

  const supabase = await createClient()

  const [{ data: events }, metaMap, registrations] = await Promise.all([
    supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .order('starts_at', { ascending: true }),
    getDialogueEventMetaMap(supabase),
    fetchDialogueRegistrations(supabase),
  ])

  const approvedCountByEvent = new Map<string, number>()
  for (const reg of registrations) {
    if (reg.status === 'approved') {
      approvedCountByEvent.set(
        reg.event_slug,
        (approvedCountByEvent.get(reg.event_slug) || 0) + 1
      )
      approvedCountByEvent.set(
        reg.event_id,
        (approvedCountByEvent.get(reg.event_id) || 0) + 1
      )
    }
  }

  const now = new Date()
  const rawList =
    events && events.length > 0 ? (events as any[]) : DEFAULT_ACTIVE_DIALOGUES

  const mergedEvents: PublicDialogueEvent[] = rawList.map((ev) => {
    const merged = mergeEventWithDialogueMeta(ev, metaMap)
    const approvedParticipantsCount =
      approvedCountByEvent.get(merged.slug) ||
      approvedCountByEvent.get(merged.id) ||
      0
    return {
      ...merged,
      approvedParticipantsCount,
    }
  })

  const activeDialogues = mergedEvents.filter((ev) => !isDialogueClosed(ev, now))
  const dbClosedDialogues = mergedEvents
    .filter((ev) => isDialogueClosed(ev, now))
    .reverse()

  const existingClosedSlugs = new Set(dbClosedDialogues.map((e) => e.slug))
  const closedDialogues = [
    ...dbClosedDialogues.map((ev) => mergeEventWithDialogueMeta(ev, metaMap)),
    ...DEFAULT_CLOSED_DIALOGUES.filter((d) => !existingClosedSlugs.has(d.slug)).map((ev) =>
      mergeEventWithDialogueMeta(ev, metaMap)
    ),
  ]

  return (
    <div className="bg-[#f7faf8] min-h-screen pb-24">
      {/* Page Header */}
      <section className="bg-[#122419] text-white py-16 lg:py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#eab308] text-xs font-semibold uppercase tracking-wider mb-4">
              Policy Dialogues &amp; Consultations
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6">
              Facilitating Inclusive Sector Solutions
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              The ACF hosts targeted consultative forums designed to convert sector data into structural policy directives across Zambia. Explore active dialogues, review closed proceedings and PDF documents, request approval to join a session, or propose a new policy dialogue.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <PolicyDialoguesClient
          activeDialogues={activeDialogues}
          closedDialogues={closedDialogues}
          ongoingForums={ONGOING_WORKING_GROUPS}
          initialTab={initialTab}
        />
      </div>
    </div>
  )
}
