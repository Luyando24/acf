import { test } from 'node:test'
import assert from 'node:assert'
import {
  DEFAULT_HOME_PAGE_CONTENT,
  DEFAULT_ABOUT_PAGE_CONTENT,
  DEFAULT_CONTACT_PAGE_CONTENT,
  DEFAULT_MEMBERSHIP_PAGE_CONTENT,
} from '../src/lib/supabase/pageContent'

test('DEFAULT_HOME_PAGE_CONTENT conforms to structured section requirements', () => {
  // Hero slides
  assert.ok(Array.isArray(DEFAULT_HOME_PAGE_CONTENT.hero_slides))
  assert.ok(DEFAULT_HOME_PAGE_CONTENT.hero_slides.length > 0)
  assert.ok(DEFAULT_HOME_PAGE_CONTENT.hero_slides[0].image_url)

  // Stats
  assert.ok(Array.isArray(DEFAULT_HOME_PAGE_CONTENT.stats))
  assert.ok(DEFAULT_HOME_PAGE_CONTENT.stats.length >= 4)
  assert.ok(DEFAULT_HOME_PAGE_CONTENT.stats[0].value)
  assert.ok(DEFAULT_HOME_PAGE_CONTENT.stats[0].label)

  // About snippet & feature cards
  assert.ok(DEFAULT_HOME_PAGE_CONTENT.about_snippet.title)
  assert.ok(DEFAULT_HOME_PAGE_CONTENT.about_snippet.description)
  assert.ok(DEFAULT_HOME_PAGE_CONTENT.about_snippet.feature_1.title)
  assert.ok(DEFAULT_HOME_PAGE_CONTENT.about_snippet.feature_2.title)

  // Strategic objectives
  assert.ok(DEFAULT_HOME_PAGE_CONTENT.strategic_objectives.title)
  assert.strictEqual(DEFAULT_HOME_PAGE_CONTENT.strategic_objectives.objectives.length, 4)

  // Sections
  assert.ok(DEFAULT_HOME_PAGE_CONTENT.programmes_section.title)
  assert.ok(DEFAULT_HOME_PAGE_CONTENT.news_events_section.news_title)
  assert.ok(DEFAULT_HOME_PAGE_CONTENT.publications_section.title)
  assert.ok(DEFAULT_HOME_PAGE_CONTENT.membership_cta.title)
  assert.ok(DEFAULT_HOME_PAGE_CONTENT.partners_section.title)
})

test('DEFAULT_ABOUT_PAGE_CONTENT includes all pillars and narrative elements', () => {
  assert.ok(DEFAULT_ABOUT_PAGE_CONTENT.header.title)
  assert.ok(DEFAULT_ABOUT_PAGE_CONTENT.vision.title)
  assert.ok(DEFAULT_ABOUT_PAGE_CONTENT.vision.description)
  assert.ok(DEFAULT_ABOUT_PAGE_CONTENT.mission.title)
  assert.ok(DEFAULT_ABOUT_PAGE_CONTENT.mission.description)
  assert.ok(DEFAULT_ABOUT_PAGE_CONTENT.history.image_url)
  assert.ok(Array.isArray(DEFAULT_ABOUT_PAGE_CONTENT.history.paragraphs))
  assert.strictEqual(DEFAULT_ABOUT_PAGE_CONTENT.objectives.items.length, 4)
})

test('DEFAULT_CONTACT_PAGE_CONTENT has complete Lusaka Secretariat credentials', () => {
  assert.ok(DEFAULT_CONTACT_PAGE_CONTENT.details.address.includes('Woodlands'))
  assert.ok(DEFAULT_CONTACT_PAGE_CONTENT.details.email.includes('acfzambia.org'))
  assert.ok(DEFAULT_CONTACT_PAGE_CONTENT.details.phone.startsWith('+260'))
  assert.ok(DEFAULT_CONTACT_PAGE_CONTENT.social_links.facebook_url)
})

test('DEFAULT_MEMBERSHIP_PAGE_CONTENT defines benefits and stakeholder directives', () => {
  assert.ok(DEFAULT_MEMBERSHIP_PAGE_CONTENT.header.title)
  assert.ok(Array.isArray(DEFAULT_MEMBERSHIP_PAGE_CONTENT.why_join.benefits))
  assert.strictEqual(DEFAULT_MEMBERSHIP_PAGE_CONTENT.why_join.benefits.length, 3)
  assert.ok(DEFAULT_MEMBERSHIP_PAGE_CONTENT.cta.contact_email)
})
