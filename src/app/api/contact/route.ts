import { NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validations/forms'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/mailer'
import { escapeHtml } from '@/lib/content/richText'
import { allowRequest, clientIp, verifyTurnstile } from '@/lib/security/requests'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const validation = contactFormSchema.safeParse(json)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid form input' },
        { status: 400 }
      )
    }

    const {
      name,
      organization,
      constituency,
      email,
      phone,
      subject,
      message,
      consent_given,
      honeypot,
      turnstile_token,
    } = validation.data

    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Message sent' })
    }

    if (!allowRequest(`contact:${clientIp(request)}`)) {
      return NextResponse.json(
        { error: 'Too many messages. Please try again later.' },
        { status: 429 }
      )
    }

    const turnstileError = await verifyTurnstile(turnstile_token, clientIp(request))
    if (turnstileError) {
      return NextResponse.json({ error: turnstileError }, { status: 400 })
    }

    let dbClient: any
    try {
      dbClient = createAdminClient()
    } catch {
      dbClient = await createClient()
    }

    // 1. Store submission in database (with fallback if organization/constituency columns aren't migrated yet)
    const fullPayload = {
      name,
      organization: organization || null,
      constituency: constituency || null,
      email,
      phone: phone || null,
      subject,
      message,
      consent_given,
      is_read: false,
    }

    let { error: dbError } = await dbClient.from('contact_messages').insert(fullPayload)

    if (dbError) {
      const metaLines: string[] = []
      if (organization) metaLines.push(`Organization: ${organization}`)
      if (constituency) metaLines.push(`Constituency / Sector: ${constituency}`)
      const fallbackMessage =
        metaLines.length > 0 ? `${metaLines.join(' | ')}\n\n${message}` : message

      const retry = await dbClient.from('contact_messages').insert({
        name,
        email,
        phone: phone || null,
        subject,
        message: fallbackMessage,
        consent_given,
        is_read: false,
      })
      dbError = retry.error
    }

    if (dbError) {
      console.error('Contact message database error:', dbError)
      return NextResponse.json(
        { error: 'Your message could not be saved. Please try again.' },
        { status: 500 }
      )
    }

    // 2. Dispatch email to ACF staff mailboxes
    const recipients =
      process.env.CONTACT_FORM_RECIPIENTS?.split(',').map((r) => r.trim()) || [
        'info@acfzambia.org',
      ]

    try {
      await sendEmail({
        to: recipients,
        subject: `[ACF Website Enquiry] ${subject}`,
        html: `
          <h2>New Contact Enquiry from ACF Website</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Organization:</strong> ${escapeHtml(organization || 'Not provided')}</p>
          <p><strong>Constituency:</strong> ${escapeHtml(constituency || 'Not provided')}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #175432;">
            ${escapeHtml(message).replace(/\n/g, '<br/>')}
          </blockquote>
          <p><small>Submitted at: ${new Date().toUTCString()} (Consent verified under Zambian Data Protection Act)</small></p>
        `,
      })
    } catch {
      // Non-fatal email dispatch error
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your enquiry has been received by the ACF Secretariat.',
    })
  } catch (error: any) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'An unexpected server error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
