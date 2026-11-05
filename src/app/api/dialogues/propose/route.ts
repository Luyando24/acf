import { NextResponse } from 'next/server'
import { dialogueProposalSchema } from '@/lib/validations/forms'
import { insertDialogueProposal } from '@/lib/supabase/dialogues'
import { sendEmail } from '@/lib/email/mailer'
import { escapeHtml } from '@/lib/content/richText'
import { allowRequest, clientIp, verifyTurnstile } from '@/lib/security/requests'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const validation = dialogueProposalSchema.safeParse(json)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid proposal form input' },
        { status: 400 }
      )
    }

    const {
      title,
      topic_area,
      proposer_name,
      organization,
      email,
      phone,
      proposed_format,
      preferred_timeframe,
      description,
      document_url,
      document_name,
      consent_given,
      honeypot,
      turnstile_token,
    } = validation.data

    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Proposal submitted' })
    }

    if (!allowRequest(`dialogue-propose:${clientIp(request)}`)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      )
    }

    const turnstileError = await verifyTurnstile(turnstile_token, clientIp(request))
    if (turnstileError) {
      return NextResponse.json({ error: turnstileError }, { status: 400 })
    }

    const proposal = await insertDialogueProposal({
      title,
      topic_area,
      proposer_name,
      organization,
      email,
      phone,
      proposed_format,
      preferred_timeframe: preferred_timeframe || null,
      description,
      document_url: document_url || null,
      document_name: document_name || null,
      consent_given,
    })

    const recipients =
      process.env.CONTACT_FORM_RECIPIENTS?.split(',').map((r) => r.trim()) || [
        'info@acfzambia.org',
      ]

    try {
      await sendEmail({
        to: recipients,
        subject: `[ACF Policy Dialogue Proposal] ${title}`,
        html: `
          <h2>New Public Policy Dialogue Proposal</h2>
          <p><strong>Proposed Title:</strong> ${escapeHtml(title)}</p>
          <p><strong>Thematic Topic Area:</strong> ${escapeHtml(topic_area)}</p>
          <p><strong>Proposed Format:</strong> ${escapeHtml(proposed_format)}</p>
          <p><strong>Preferred Timeframe:</strong> ${escapeHtml(preferred_timeframe || 'Flexible')}</p>
          <hr/>
          <p><strong>Proposer Name:</strong> ${escapeHtml(proposer_name)}</p>
          <p><strong>Organization / Constituency:</strong> ${escapeHtml(organization)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          ${
            document_url
              ? `<p><strong>Attached PDF Document:</strong> <a href="${escapeHtml(document_url)}">${escapeHtml(document_name || document_url)}</a></p>`
              : ''
          }
          <p><strong>Concept Note & Key Policy Questions:</strong></p>
          <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #175432;">
            ${escapeHtml(description).replace(/\n/g, '<br/>')}
          </blockquote>
        `,
      })
    } catch {
      // Non-fatal email dispatch error
    }

    return NextResponse.json({
      success: true,
      proposalId: proposal.id,
      message:
        'Thank you! Your proposed policy dialogue has been submitted to the ACF Secretariat for review and approval.',
    })
  } catch (error) {
    console.error('Dialogue proposal submission error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while submitting your proposal. Please try again.' },
      { status: 500 }
    )
  }
}

