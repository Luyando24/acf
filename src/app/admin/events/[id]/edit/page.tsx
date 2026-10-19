import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EventForm from '@/components/admin/forms/EventForm'
import { EventItem } from '@/components/admin/EventManager'

export const metadata = {
  title: 'Edit Event | ACF Admin CMS',
}

interface EditEventProps {
  params: Promise<{ id: string }>
}

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

export default async function EditEventPage({ params }: EditEventProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  const eventItem = data || defaultEvents.find((e) => e.id === id)

  if (!eventItem) {
    notFound()
  }

  return <EventForm initialData={eventItem as unknown as EventItem} />
}
