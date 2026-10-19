import { createClient } from '@/lib/supabase/server'
import EventManager, { EventItem } from '@/components/admin/EventManager'

export default async function AdminEventsPage() {
  const supabase = await createClient()

  const { data: eventsData } = await supabase
    .from('events')
    .select('*')
    .order('starts_at', { ascending: false })

  const defaultEvents: EventItem[] = [
    {
      id: '55555555-5555-5555-5555-555555555501',
      slug: 'annual-agricultural-policy-symposium-2026',
      title: 'Annual Zambia Agricultural Policy Symposium 2026',
      description: 'The premier national gathering of agricultural policy makers, producer groups, agribusinesses, and financial institutions assessing national agricultural performance and investment priorities.',
      starts_at: '2026-11-18T06:30:00Z',
      ends_at: '2026-11-19T15:00:00Z',
      venue: 'Mulungushi International Conference Centre, Lusaka',
      virtual_url: 'https://zoom.us/j/symposium2026',
      registration_url: 'https://acfzambia.org/register',
      featured_image: '/photos/event1.jpg',
      status: 'published',
    },
    {
      id: '55555555-5555-5555-5555-555555555502',
      slug: 'workshop-land-tenure-governance-2026',
      title: 'Multi-Stakeholder Workshop on Customary Land Tenure',
      description: 'Consultative dialogue reviewing the implementation guidelines for customary land documentation, smallholder tenure security, and gender-inclusive title protection.',
      starts_at: '2026-10-28T07:00:00Z',
      ends_at: '2026-10-28T14:30:00Z',
      venue: 'Golden Peacock Hotel, Lusaka',
      virtual_url: null,
      registration_url: 'https://acfzambia.org/register',
      featured_image: '/photos/dialogue.jpg',
      status: 'published',
    },
  ]

  const events = eventsData && eventsData.length > 0 ? (eventsData as unknown as EventItem[]) : defaultEvents

  return <EventManager initialEvents={events} />
}
