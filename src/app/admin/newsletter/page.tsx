import { createClient } from '@/lib/supabase/server'
import NewsletterManager, { SubscriberItem } from '@/components/admin/NewsletterManager'

export default async function AdminNewsletterPage() {
  const supabase = await createClient()

  const { data: subData } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false })

  const defaultSubscribers: SubscriberItem[] = [
    {
      id: 'aaaa1111-1111-1111-1111-111111111101',
      email: 'agricultural.policy@znfu.org.zm',
      status: 'subscribed',
      source: 'website_footer',
      consent_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: 'aaaa1111-1111-1111-1111-111111111102',
      email: 'rural.dev@ministry.gov.zm',
      status: 'subscribed',
      source: 'news_box',
      consent_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      confirmed_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'aaaa1111-1111-1111-1111-111111111103',
      email: 'info@cooperativefed.zm',
      status: 'pending',
      source: 'homepage_banner',
      consent_at: new Date(Date.now() - 86400000 * 12).toISOString(),
      confirmed_at: null,
      created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    },
  ]

  const subscribers = subData && subData.length > 0 ? (subData as unknown as SubscriberItem[]) : defaultSubscribers

  return <NewsletterManager initialSubscribers={subscribers} />
}
