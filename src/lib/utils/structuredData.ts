import type { SiteSettings } from '@/lib/supabase/settings'
import { absoluteUrl, siteUrl } from './seo'

export const ORG_ID = () => `${siteUrl()}/#organization`
export const SITE_ID = () => `${siteUrl()}/#website`

/**
 * All values are sourced from admin-editable site settings or real content
 * rows — nothing here invents organisation facts.
 */
export function organizationSchema(settings: SiteSettings) {
  const base = siteUrl()
  const sameAs = [
    settings.facebook_url,
    settings.twitter_url,
    settings.linkedin_url,
    settings.youtube_url,
  ].filter((url): url is string => Boolean(url))

  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    '@id': ORG_ID(),
    name: settings.site_name || 'Agricultural Consultative Forum (ACF)',
    alternateName: 'ACF Zambia',
    description: settings.description,
    slogan: settings.tagline,
    url: base,
    logo: absoluteUrl(settings.logo_url || '/photos/logo.png'),
    image: absoluteUrl('/og/og-default.png'),
    email: settings.email,
    telephone: settings.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressCountry: 'ZM',
    },
    areaServed: { '@type': 'Country', name: 'Zambia' },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.phone,
      email: settings.email,
      contactType: 'secretariat',
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

export function websiteSchema(settings: SiteSettings) {
  const base = siteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID(),
    url: base,
    name: settings.site_name || 'Agricultural Consultative Forum (ACF)',
    description: settings.description,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID() },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${base}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export interface BreadcrumbEntry {
  name: string
  url?: string
}

export function breadcrumbSchema(trail: BreadcrumbEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((entry, index) => {
      const isLast = index === trail.length - 1
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: entry.name,
        // Google expects no item on the terminal crumb.
        ...(isLast || !entry.url ? {} : { item: absoluteUrl(entry.url) }),
      }
    }),
  }
}

export interface ArticleSchemaInput {
  type?: 'NewsArticle' | 'Article' | 'ScholarlyArticle'
  headline: string
  description: string
  image?: string | null
  pathname: string
  publishedAt?: string | Date | null
  modifiedAt?: string | Date | null
  section?: string
}

export function articleSchema({
  type = 'Article',
  headline,
  description,
  image,
  pathname,
  publishedAt,
  modifiedAt,
  section,
}: ArticleSchemaInput) {
  const url = absoluteUrl(pathname)
  const asIso = (value?: string | Date | null) =>
    value ? new Date(value).toISOString() : undefined

  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline,
    description,
    image: image ? [absoluteUrl(image)] : [absoluteUrl('/og/og-default.png')],
    inLanguage: 'en',
    datePublished: asIso(publishedAt),
    dateModified: asIso(modifiedAt) ?? asIso(publishedAt),
    author: { '@id': ORG_ID() },
    publisher: { '@id': ORG_ID() },
    ...(section ? { articleSection: section } : {}),
  }
}

export interface EventSchemaInput {
  name: string
  description: string
  image?: string | null
  pathname: string
  startsAt?: string | Date | null
  endsAt?: string | Date | null
  venue?: string | null
  virtualUrl?: string | null
}

export function eventSchema({
  name,
  description,
  image,
  pathname,
  startsAt,
  endsAt,
  venue,
  virtualUrl,
}: EventSchemaInput) {
  const url = absoluteUrl(pathname)
  // No venue and no virtual link means the location is unknown, so it is
  // omitted rather than guessed.
  const location = venue
    ? { '@type': 'Place', name: venue }
    : virtualUrl
      ? { '@type': 'VirtualLocation', url: virtualUrl }
      : null

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${url}#event`,
    name,
    description,
    url,
    image: image ? [absoluteUrl(image)] : [absoluteUrl('/og/og-default.png')],
    startDate: startsAt ? new Date(startsAt).toISOString() : undefined,
    endDate: endsAt ? new Date(endsAt).toISOString() : undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: virtualUrl && !venue
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    ...(location ? { location } : {}),
    organizer: { '@id': ORG_ID() },
  }
}
