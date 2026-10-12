import { Metadata } from 'next'

interface SEOMetadataParams {
  title?: string
  description?: string
  image?: string
  pathname?: string
  noIndex?: boolean
}

const DEFAULT_TITLE = 'Agricultural Consultative Forum (ACF) | Zambia'
const DEFAULT_DESCRIPTION =
  'Agricultural Consultative Forum (ACF) is a Zambian multi-stakeholder agricultural policy NGO bringing together public, private, farmer and research sectors for sustainable agricultural development.'

export function constructMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  image = '/images/og-default.jpg',
  pathname = '',
  noIndex = false,
}: SEOMetadataParams = {}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://acfzambia.org'
  const fullTitle = title ? `${title} | ACF Zambia` : DEFAULT_TITLE
  const url = `${siteUrl}${pathname}`

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'Agricultural Consultative Forum (ACF)',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || 'ACF Zambia',
        },
      ],
      locale: 'en_ZM',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@ACFZambia',
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

/**
 * Organization Schema (JSON-LD)
 */
export function generateOrganizationSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://acfzambia.org'
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Agricultural Consultative Forum',
    alternateName: 'ACF Zambia',
    url: siteUrl,
    logo: `${siteUrl}/images/acf-logo.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '24 Elm Rd, Woodlands',
      addressLocality: 'Lusaka',
      addressCountry: 'ZM',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+260954755071',
      contactType: 'Secretariat',
      email: 'info@acfzambia.org',
    },
    sameAs: [
      'https://facebook.com/ACFZambia',
      'https://twitter.com/ACFZambia',
    ],
  }
}
