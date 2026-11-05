import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://acfzambia.org'

  const routes = [
    '',
    '/about',
    '/about/board',
    '/about/secretariat',
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

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))
}
