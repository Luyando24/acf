import { NextResponse } from 'next/server'
import { dialogueJoinSchema } from '@/lib/validations/forms'
import { insertDialogueRegistration } from '@/lib/supabase/dialogues'
import { sendEmail } from '@/lib/email/mailer'
import { escapeHtml } from '@/lib/content/richText'
import { allowRequest, clientIp, verifyTurnstile } from '@/lib/security/requests'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const validation = dialogueJoinSchema.safeParse(json)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid registration input' },
        { status: 400 }
      )
    }

    const {
      event_id,
      event_slug,
      event_title,
      participant_name,
      organization,
      role_title,
      email,
      phone,
      attendance_mode,
      contribution_note,
      consent_given,
      honeypot,
      turnstile_token,
    } = validation.data

    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Registration request submitted' })
    }

    if (!allowRequest(`dialogue-join:${clientIp(request)}`)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const turnstileError = await verifyTurnstile(turnstile_token, clientIp(request))
    if (turnstileError) {
      return NextResponse.json({ error: turnstileError }, { status: 400 })
    }

    const registration = await insertDialogueRegistration({
      event_id,
      event_slug,
      event_title,
      participant_name,
      organization,
      role_title: role_title || null,
      email,
      phone,
      attendance_mode,
      contribution_note: contribution_note || null,
      consent_given,
    })

    const recipients =
      process.env.CONTACT_FORM_RECIPIENTS?.split(',').map((r) => r.trim()) || [
        'info@acfzambia.org',
      ]

    try {
      await sendEmail({
        to: recipients,
        subject: `[ACF Dialogue Join Request — Pending Approval] ${event_title}`,
        html: `
          <h2>New Dialogue Participation Request (Awaiting Admin Approval)</h2>
          <p><strong>Policy Dialogue:</strong> ${escapeHtml(event_title)}</p>
          <p><strong>Participant Name:</strong> ${escapeHtml(participant_name)}</p>
          <p><strong>Organization / Constituency:</strong> ${escapeHtml(organization)}</p>
          <p><strong>Role / Designation:</strong> ${escapeHtml(role_title || 'N/A')}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Attendance Mode:</strong> ${escapeHtml(attendance_mode)}</p>
          <p><strong>Contribution / Notes:</strong></p>
          <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #175432;">
            ${escapeHtml(contribution_note || 'No additional notes provided.').replace(/\n/g, '<br/>')}
          </blockquote>
          <p><em>Review and approve or decline this request in the ACF Admin Dashboard under Policy Dialogues &amp; Events.</em></p>
        `,
      })
    } catch {
      // Non-fatal email dispatch error
    }

    return NextResponse.json({
      success: true,
      registrationId: registration.id,
      status: registration.status,
      message:
        'Your request to join this policy dialogue has been received and is pending approval by the ACF Secretariat.',
    })
  } catch (error) {
    console.error('Dialogue join request error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while submitting your request. Please try again.' },
      { status: 500 }
    )
  }
}

