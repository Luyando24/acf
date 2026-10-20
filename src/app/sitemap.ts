import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://acfzambia.org'

  const routes = [
    '',
    '/about',
    '/about/board',
    '/about/management',
    '/about/staff',
    '/our-work',
    '/publications',
    '/news',
    '/events',
    '/opportunities',
    '/opportunities/archive',
    '/membership',
    '/membership/apply',
    '/partners',
    '/contact',
    '/privacy-policy',
  ]

  const supabase = await createClient()
  const { data: progData } = await supabase
    .from('programmes')
    .select('slug')
    .eq('status', 'published')

  const programmeRoutes = (progData || []).map((p) => `/our-work/${p.slug}`)

  return [...routes, ...programmeRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))
}
