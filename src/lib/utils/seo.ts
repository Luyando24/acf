import { Metadata } from 'next'

const PRODUCTION_URL = 'https://www.acfzambia.org'

const DEFAULT_TITLE = 'Agricultural Consultative Forum (ACF) | Zambia'
const DEFAULT_DESCRIPTION =
  'Agricultural Consultative Forum (ACF) is a Zambian multi-stakeholder agricultural policy NGO bringing together public, private, farmer and research sectors for sustainable agricultural development.'
const DEFAULT_OG_IMAGE = '/og/og-default.png'
const DEFAULT_KEYWORDS = [
  'Agricultural Consultative Forum',
  'ACF Zambia',
  'agricultural policy Zambia',
  'policy dialogue',
  'food security Zambia',
  'smallholder farmers',
  'land tenure',
  'agricultural research',
]

/**
 * Canonical origin of the site. Falls back to the production host so a missing
 * NEXT_PUBLIC_SITE_URL in a deployment can never leak localhost URLs into
 * canonicals, sitemaps or social scrapers.
 */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || PRODUCTION_URL
  return raw.replace(/\/+$/, '')
}

export function absoluteUrl(path?: string | null): string {
  const clean = path?.trim() || '/'
  if (/^https?:\/\//i.test(clean)) return clean
  return `${siteUrl()}${clean.startsWith('/') ? clean : `/${clean}`}`
}

interface SEOMetadataParams {
  title?: string
  description?: string | null
  image?: string | null
  pathname?: string
  noIndex?: boolean
  type?: 'website' | 'article'
  publishedTime?: string | Date
  modifiedTime?: string | Date
  keywords?: string[]
  verification?: Metadata['verification']
}

const ISO_DATE = (value?: string | Date) =>
  value ? new Date(value).toISOString() : undefined

/** Search results show ~155-160 characters, so long rich text is flattened and clamped. */
function clampDescription(value: string): string {
  const plain = value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return plain.length > 200 ? `${plain.slice(0, 197).trimEnd()}...` : plain
}

export function constructMetadata({
  title,
  description,
  image,
  pathname = '',
  noIndex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
  keywords,
  verification,
}: SEOMetadataParams = {}): Metadata {
  const base = siteUrl()
  const fullTitle = title ? `${title} | ACF Zambia` : DEFAULT_TITLE
  const summary = clampDescription(description || DEFAULT_DESCRIPTION)
  const url = `${base}${pathname}`
  const imageUrl = absoluteUrl(image || DEFAULT_OG_IMAGE)
  const datePublished = ISO_DATE(publishedTime)
  const dateModified = ISO_DATE(modifiedTime)

  return {
    title: { absolute: fullTitle },
    description: summary,
    keywords: keywords ? [...new Set([...keywords, ...DEFAULT_KEYWORDS])] : DEFAULT_KEYWORDS,
    metadataBase: new URL(base),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      title: fullTitle,
      description: summary,
      url,
      siteName: 'Agricultural Consultative Forum (ACF)',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title || 'Agricultural Consultative Forum (ACF)'} — Zambia`,
        },
      ],
      locale: 'en_ZM',
      ...(datePublished ? { publishedTime } : {}),
      ...(dateModified ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: summary,
      images: [imageUrl],
      site: '@ACFZambia',
      creator: '@ACFZambia',
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    category: 'website',
    ...(verification ? { verification } : {}),
  }
}
