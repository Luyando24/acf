import test from 'node:test'
import assert from 'node:assert/strict'
import { constructMetadata, siteUrl, absoluteUrl } from '../src/lib/utils/seo'
import {
  articleSchema,
  breadcrumbSchema,
  eventSchema,
  organizationSchema,
} from '../src/lib/utils/structuredData'
import type { SiteSettings } from '../src/lib/supabase/settings'

const SETTINGS: SiteSettings = {
  site_name: 'Agricultural Consultative Forum (ACF)',
  tagline: 'Multi-stakeholder dialogue for sustainable agriculture in Zambia',
  description: 'ACF is a Zambian multi-stakeholder agricultural policy NGO.',
  email: 'info@acfzambia.org',
  phone: '+260 95 4755071',
  address: '24 Elm Rd, Woodlands, Lusaka, Zambia',
  office_hours: 'Monday - Friday: 08:00 - 17:00 CAT',
  facebook_url: 'https://facebook.com/ACFZambia',
}

function withSiteUrl(value: string | undefined, fn: () => void) {
  const prev = process.env.NEXT_PUBLIC_SITE_URL
  if (value === undefined) delete process.env.NEXT_PUBLIC_SITE_URL
  else process.env.NEXT_PUBLIC_SITE_URL = value
  try {
    fn()
  } finally {
    if (prev === undefined) delete process.env.NEXT_PUBLIC_SITE_URL
    else process.env.NEXT_PUBLIC_SITE_URL = prev
  }
}

test('siteUrl falls back to the canonical production host, never localhost', () => {
  withSiteUrl(undefined, () => {
    assert.equal(siteUrl(), 'https://www.acfzambia.org')
  })
})

test('siteUrl strips trailing slashes so canonicals are not doubled', () => {
  withSiteUrl('https://www.acfzambia.org/', () => {
    assert.equal(siteUrl(), 'https://www.acfzambia.org')
    assert.equal(absoluteUrl('/news/a'), 'https://www.acfzambia.org/news/a')
  })
})

test('absoluteUrl passes through already-absolute image URLs', () => {
  withSiteUrl('https://www.acfzambia.org', () => {
    assert.equal(
      absoluteUrl('https://cdn.example.org/a.jpg'),
      'https://cdn.example.org/a.jpg'
    )
  })
})

test('metadata emits a single canonical and one title suffix', () => {
  withSiteUrl('https://www.acfzambia.org', () => {
    const meta = constructMetadata({
      title: 'Policy Brief',
      pathname: '/publications/policy-brief',
    })
    assert.equal(meta.openGraph?.url, 'https://www.acfzambia.org/publications/policy-brief')
    assert.equal((meta.title as { absolute: string }).absolute, 'Policy Brief | ACF Zambia')
    assert.equal(
      (meta.alternates as { canonical: string }).canonical,
      'https://www.acfzambia.org/publications/policy-brief'
    )
    assert.equal(
      (meta.openGraph?.images as Array<{ url: string }>)[0].url,
      'https://www.acfzambia.org/og/og-default.png'
    )
  })
})

test('long rich-text descriptions are flattened and clamped', () => {
  withSiteUrl('https://www.acfzambia.org', () => {
    const meta = constructMetadata({
      description: '<p>ACF convenes&nbsp;stakeholders.  ' + 'x'.repeat(400) + '</p>',
    })
    assert.ok((meta.description || '').length <= 200)
    assert.ok(!meta.description!.includes('<p>'))
    assert.ok(!meta.description!.includes('&nbsp;'))
  })
})

test('noIndex pages stay crawlable but out of results', () => {
  const meta = constructMetadata({ pathname: '/search', noIndex: true })
  const robots = meta.robots as { index?: boolean; follow?: boolean }
  assert.equal(robots.index, false)
  assert.equal(robots.follow, true)
})

test('organization schema only lists social profiles that are configured', () => {
  const org = organizationSchema(SETTINGS)
  assert.equal(org['@type'], 'NGO')
  assert.deepEqual(org.sameAs, ['https://facebook.com/ACFZambia'])
  assert.equal(org.address.addressCountry, 'ZM')
})

test('breadcrumb omits item on the terminal crumb', () => {
  const trail = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'News', url: '/news' },
    { name: 'Current story' },
  ])
  assert.equal(trail.itemListElement.length, 3)
  assert.equal('item' in trail.itemListElement[1], true)
  assert.equal('item' in trail.itemListElement[2], false)
})

test('article schema falls back to published date for modified date', () => {
  const article = articleSchema({
    headline: 'Study',
    description: 'Findings',
    pathname: '/news/study',
    publishedAt: '2026-03-01T09:00:00Z',
  })
  assert.equal(article.dateModified, '2026-03-01T09:00:00.000Z')
  assert.equal(article.image![0], 'https://www.acfzambia.org/og/og-default.png')
})

test('event schema omits location instead of inventing one', () => {
  const withVenue = eventSchema({
    name: 'Dialogue',
    description: 'About the dialogue',
    pathname: '/events/dialogue',
    startsAt: '2026-08-28T07:00:00Z',
    venue: 'Golden Peacock Hotel, Lusaka',
  })
  assert.deepEqual((withVenue.location as any)['@type'], 'Place')

  const bare = eventSchema({
    name: 'Dialogue',
    description: 'About the dialogue',
    pathname: '/events/dialogue',
  })
  assert.equal('location' in bare, false)
})
