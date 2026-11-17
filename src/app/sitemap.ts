import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { siteUrl } from '@/lib/utils/seo'

export const revalidate = 3600

type SitemapRow = { slug: string; updated_at?: string | null }

type SitemapTable = 'news_posts' | 'publications' | 'events' | 'opportunities'

const STATIC_PAGES: Array<{
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}> = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/about/board', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/about/secretariat', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/our-work', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/publications', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/news', changeFrequency: 'daily', priority: 0.9 },
  { path: '/events', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/opportunities', changeFrequency: 'daily', priority: 0.8 },
  { path: '/opportunities/archive', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/membership', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/membership/apply', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/partners', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/facebook-posts', changeFrequency: 'weekly', priority: 0.4 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.7 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
]

async function fetchPublished(table: SitemapTable): Promise<SitemapRow[]> {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from(table)
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(5000)

    if (error) {
      console.error(`Sitemap: failed to read published rows from ${table}:`, error.message)
      return []
    }
    return (data as SitemapRow[]) || []
  } catch (err) {
    // Service role key absent or store unreachable: ship the static sitemap
    // instead of failing the route.
    console.error(`Sitemap: ${table} lookup skipped:`, err instanceof Error ? err.message : err)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()

  const [news, publications, events, opportunities] = await Promise.all([
    fetchPublished('news_posts'),
    fetchPublished('publications'),
    fetchPublished('events'),
    fetchPublished('opportunities'),
  ])

  const staticEntries = STATIC_PAGES.map((page) => ({
    url: `${base}${page.path}`,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  const dynamicEntries = (
    [
      [news, '/news', 'daily', 0.7],
      [publications, '/publications', 'monthly', 0.7],
      [events, '/events', 'weekly', 0.6],
      [opportunities, '/opportunities', 'daily', 0.6],
    ] as Array<[SitemapRow[], string, MetadataRoute.Sitemap[number]['changeFrequency'], number]>
  ).flatMap(([rows, prefix, changeFrequency, priority]) =>
    rows
      .filter((row) => Boolean(row?.slug))
      .map((row) => ({
        url: `${base}${prefix}/${row.slug}`,
        lastModified: row.updated_at ? new Date(row.updated_at) : undefined,
        changeFrequency,
        priority,
      }))
  )

  return [...staticEntries, ...dynamicEntries]
}
