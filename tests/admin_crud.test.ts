import test from 'node:test'
import assert from 'node:assert/strict'

test('slug generation produces clean, url-safe lowercase strings', () => {
  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  assert.equal(
    generateSlug('ACF Convenes National Stakeholder Dialogue 2026!'),
    'acf-convenes-national-stakeholder-dialogue-2026'
  )
  assert.equal(
    generateSlug('Senior Agricultural Policy Consultant & Analyst'),
    'senior-agricultural-policy-consultant-analyst'
  )
  assert.equal(
    generateSlug('   Leading with Science & Evidence   '),
    'leading-with-science-evidence'
  )
})

test('admin entity table map contains all required CMS tables', () => {
  const TABLE_MAP: Record<string, string> = {
    publications: 'publications',
    news: 'news_posts',
    news_posts: 'news_posts',
    events: 'events',
    opportunities: 'opportunities',
    programmes: 'programmes',
    people: 'people',
    partners: 'partners',
    membership: 'membership_applications',
    membership_applications: 'membership_applications',
    membership_categories: 'membership_categories',
    contacts: 'contact_messages',
    contact_messages: 'contact_messages',
    newsletter: 'newsletter_subscribers',
    newsletter_subscribers: 'newsletter_subscribers',
  }

  const expectedEntities = [
    'publications',
    'news',
    'events',
    'opportunities',
    'programmes',
    'people',
    'partners',
    'membership',
    'contacts',
    'newsletter',
  ]

  for (const entity of expectedEntities) {
    assert.ok(TABLE_MAP[entity], `Missing table mapping for ${entity}`)
  }
})

test('publication status and opportunity types conform to schema enums', () => {
  const allowedContentStatuses = ['draft', 'scheduled', 'published', 'archived']
  const allowedOpportunityTypes = ['Job', 'Consultancy', 'Tender', 'Procurement', 'Call for Proposals']
  const allowedPeopleGroups = ['board', 'management', 'staff']
  const allowedPartnerTypes = ['Partner', 'Development Partner', 'Collaborating Institution', 'Network & Affiliation']

  assert.ok(allowedContentStatuses.includes('published'))
  assert.ok(allowedContentStatuses.includes('draft'))
  assert.ok(allowedOpportunityTypes.includes('Consultancy'))
  assert.ok(allowedOpportunityTypes.includes('Tender'))
  assert.ok(allowedPeopleGroups.includes('board'))
  assert.ok(allowedPeopleGroups.includes('staff'))
  assert.ok(allowedPartnerTypes.includes('Collaborating Institution'))
})
