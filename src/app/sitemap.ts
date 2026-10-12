import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://acfzambia.org'

  const routes = [
    '',
    '/about',
    '/about/board',
    '/about/management',
    '/about/staff',
    '/our-work',
    '/our-work/policy-advocacy',
    '/our-work/research-and-evidence',
    '/our-work/multi-stakeholder-dialogue',
    '/our-work/climate-resilience',
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
