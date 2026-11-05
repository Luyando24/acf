import test from 'node:test'
import assert from 'node:assert/strict'
import {
  contactFormSchema,
  membershipFormSchema,
  newsletterSchema,
  dialogueProposalSchema,
  dialogueJoinSchema,
} from '../src/lib/validations/forms'
import {
  getDialogueDocuments,
  isDialogueClosed,
  mergeEventWithDialogueMeta,
} from '../src/lib/supabase/dialogues'

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

test('dialogueProposalSchema validates public policy dialogue proposals and optional PDF attachments', () => {
  const validProposal = {
    title: 'National Roundtable on Smallholder Irrigation Financing',
    topic_area: 'Climate Resilience & Adaptation',
    proposer_name: 'Mrs. Bwalya Mulenga',
    organization: 'Cotton Association of Zambia',
    email: 'bmulenga@example.org',
    phone: '+260 97 7654321',
    proposed_format: 'Hybrid National Policy Dialogue',
    preferred_timeframe: 'Q1 2027',
    description:
      'A multi-stakeholder dialogue examining concessional finance mechanisms and water harvesting infrastructure for smallholder farmers.',
    document_url: '/api/files/private-uploads/11111111-1111-1111-1111-111111111111.pdf',
    document_name: 'Irrigation-Concept-Note.pdf',
    consent_given: true,
  }

  assert.equal(dialogueProposalSchema.safeParse(validProposal).success, true)

  const missingConsent = { ...validProposal, consent_given: false }
  assert.equal(dialogueProposalSchema.safeParse(missingConsent).success, false)
})

test('dialogueJoinSchema validates user requests to join a specific dialogue with admin approval', () => {
  const validJoin = {
    event_id: '55555555-5555-5555-5555-555555555501',
    event_slug: 'annual-agricultural-policy-symposium-2026',
    event_title: 'Annual Zambia Agricultural Policy Symposium 2026',
    participant_name: 'Dr. Mutale Chanda',
    organization: 'Zambia National Farmers Union',
    role_title: 'Senior Policy Analyst',
    email: 'mchanda@znfu.org.zm',
    phone: '+260 97 1234567',
    attendance_mode: 'In-Person',
    contribution_note: 'Presenting provincial smallholder survey findings.',
    consent_given: true,
  }

  assert.equal(dialogueJoinSchema.safeParse(validJoin).success, true)

  const invalidMode = { ...validJoin, attendance_mode: 'InvalidMode' }
  assert.equal(dialogueJoinSchema.safeParse(invalidMode).success, false)
})

test('getDialogueDocuments and isDialogueClosed handle PDF attachments and Active/Closed tabs', () => {
  const merged = mergeEventWithDialogueMeta(
    {
      id: 'ev-1',
      slug: 'sample-dialogue',
      title: 'Sample Dialogue',
      starts_at: '2027-05-01T09:00:00Z',
      status: 'published',
    },
    {
      'ev-1': {
        document_url: '/api/files/private-uploads/concept.pdf',
        attachments: [
          { title: 'Agenda (PDF)', url: '/api/files/private-uploads/agenda.pdf' },
        ],
        is_closed: true,
        dialogue_state: 'closed',
      },
    }
  )

  const docs = getDialogueDocuments(merged)
  assert.equal(docs.length, 2)
  assert.equal(docs[0].title, 'Agenda (PDF)')
  assert.equal(isDialogueClosed(merged), true)
})
