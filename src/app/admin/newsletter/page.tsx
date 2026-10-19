import { createClient } from '@/lib/supabase/server'
import NewsletterManager, { SubscriberItem } from '@/components/admin/NewsletterManager'

const DEFAULT_SUBSCRIBERS: SubscriberItem[] = [
  {
    id: 'aaaa1111-1111-1111-1111-111111111101',
    email: 'agricultural.policy@znfu.org.zm',
    status: 'subscribed',
    source: 'website_footer',
    consent_at: '2026-10-18T10:00:00.000Z',
    confirmed_at: '2026-10-18T10:00:00.000Z',
    created_at: '2026-10-18T10:00:00.000Z',
  },
  {
    id: 'aaaa1111-1111-1111-1111-111111111102',
    email: 'rural.dev@ministry.gov.zm',
    status: 'subscribed',
    source: 'news_box',
    consent_at: '2026-10-13T10:00:00.000Z',
    confirmed_at: '2026-10-13T10:00:00.000Z',
    created_at: '2026-10-13T10:00:00.000Z',
  },
  {
    id: 'aaaa1111-1111-1111-1111-111111111103',
    email: 'info@cooperativefed.zm',
    status: 'pending',
    source: 'homepage_banner',
    consent_at: '2026-10-06T10:00:00.000Z',
    confirmed_at: null,
    created_at: '2026-10-06T10:00:00.000Z',
  },
]

export default async function AdminNewsletterPage() {
  const supabase = await createClient()

  const { data: subData } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false })

  const subscribers = subData && subData.length > 0 ? (subData as unknown as SubscriberItem[]) : DEFAULT_SUBSCRIBERS

  return <NewsletterManager initialSubscribers={subscribers} />
}
