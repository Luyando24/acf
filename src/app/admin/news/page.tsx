import { createClient } from '@/lib/supabase/server'
import NewsManager, { NewsItem } from '@/components/admin/NewsManager'

export default async function AdminNewsPage() {
  const supabase = await createClient()

  const { data: newsData } = await supabase
    .from('news_posts')
    .select('*')
    .order('published_at', { ascending: false })

  const defaultNews: NewsItem[] = [
    {
      id: '44444444-4444-4444-4444-444444444401',
      slug: 'national-consultative-dialogue-food-security-2026',
      title: 'ACF Convenes National Stakeholder Dialogue on Sustainable Food Security',
      category: 'Policy Dialogue',
      excerpt: 'Stakeholders from across the agricultural ecosystem gather to formulate strategic responses to the national drought and input sustainability.',
      body: 'The Agricultural Consultative Forum (ACF) hosted over 120 key stakeholders in Lusaka representing farmer organizations, agribusinesses, government ministries, and development partners to discuss strategic policy options for ensuring national food security.',
      featured_image: '/photos/dialogue.jpg',
      published_at: '2026-03-01T07:00:00Z',
      status: 'published',
      is_featured: true,
    },
    {
      id: '44444444-4444-4444-4444-444444444402',
      slug: 'evidence-based-review-fisp-reforms',
      title: 'Stakeholder Submission on Agricultural Input Programme Modernisation',
      category: 'Sector News',
      excerpt: 'Comprehensive policy brief submitted to the Ministry of Agriculture on transition mechanisms to direct electronic voucher delivery.',
      body: 'Following comprehensive consultative sessions with smallholder caucuses across Southern, Eastern, and Central Provinces, ACF presented its technical synthesis on sustainable input reform.',
      featured_image: '/photos/fieldwork.jpg',
      published_at: '2026-02-18T08:30:00Z',
      status: 'published',
      is_featured: false,
    },
  ]

  const articles = newsData && newsData.length > 0 ? (newsData as unknown as NewsItem[]) : defaultNews

  return <NewsManager initialNews={articles} />
}
