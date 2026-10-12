import test from 'node:test'
import assert from 'node:assert/strict'
import {
  contactFormSchema,
  membershipFormSchema,
  newsletterSchema,
} from '../src/lib/validations/forms'

test('contactFormSchema validates valid submissions and enforces consent', () => {
  const validData = {
    name: 'Mwamba Banda',
    email: 'mbanda@example.com',
    subject: 'Policy Research Inquiry',
    message: 'We would like to request copies of the latest agricultural brief.',
    consent_given: true,
  }

  const result = contactFormSchema.safeParse(validData)
  assert.equal(result.success, true)

  // Rejection when consent_given is false
  const invalidConsent = { ...validData, consent_given: false }
  const resultConsent = contactFormSchema.safeParse(invalidConsent)
  assert.equal(resultConsent.success, false)
})

test('contactFormSchema detects spam in honeypot', () => {
  const spamData = {
    name: 'Spam Bot',
    email: 'bot@spam.com',
    subject: 'Buy cheap items',
    message: 'This is automated spam link',
    consent_given: true,
    honeypot: 'http://spam-link.com',
  }

  const result = contactFormSchema.safeParse(spamData)
  assert.equal(result.success, false)
})

test('newsletterSchema requires valid email and consent', () => {
  const valid = {
    email: 'farmer@coop.zm',
    consent_given: true,
  }
  assert.equal(newsletterSchema.safeParse(valid).success, true)

  const invalidEmail = {
    email: 'not-an-email',
    consent_given: true,
  }
  assert.equal(newsletterSchema.safeParse(invalidEmail).success, false)
})
