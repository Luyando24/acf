import { NextResponse } from 'next/server'
import { membershipFormSchema } from '@/lib/validations/forms'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/mailer'
import { escapeHtml } from '@/lib/content/richText'
import { allowRequest, clientIp, verifyTurnstile } from '@/lib/security/requests'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const validation = membershipFormSchema.safeParse(json)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid form input' },
        { status: 400 }
      )
    }

    const {
      applicant_type,
      org_name,
      contact_name,
      email,
      phone,
      category_id,
      location_province,
      sector_interest,
      message,
      consent_given,
      honeypot,
      turnstile_token,
    } = validation.data

    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Application submitted' })
    }

    if (!allowRequest(`membership:${clientIp(request)}`)) {
      return NextResponse.json({ error: 'Too many applications. Please try again later.' }, { status: 429 })
    }

    const turnstileError = await verifyTurnstile(turnstile_token, clientIp(request))
    if (turnstileError) {
      return NextResponse.json({ error: turnstileError }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Store submission in database
    const { error: dbError } = await supabase
      .from('membership_applications')
      .insert({
        applicant_type,
        org_name: org_name || null,
        contact_name,
        email,
        phone,
        category_id: category_id || null,
        location_province: location_province || null,
        sector_interest: sector_interest || null,
        details: { message: message || '' },
        consent_given,
        consent_at: new Date().toISOString(),
        status: 'new',
      } as any)

    if (dbError) {
      console.error('Membership application database error:', dbError)
      return NextResponse.json(
        { error: 'Your application could not be saved. Please try again.' },
        { status: 500 }
      )
    }

    // 2. Dispatch email notification to ACF membership officers
    const recipients =
      process.env.MEMBERSHIP_FORM_RECIPIENTS?.split(',').map((r) => r.trim()) || [
        'membership@acfzambia.org',
        'info@acfzambia.org',
      ]

    await sendEmail({
      to: recipients,
      subject: `[ACF New Membership Application] ${org_name || contact_name}`,
      html: `
        <h2>New Membership Application Received</h2>
        <p><strong>Applicant Type:</strong> ${escapeHtml(applicant_type)}</p>
        <p><strong>Organization Name:</strong> ${escapeHtml(org_name || 'N/A')}</p>
        <p><strong>Contact Person:</strong> ${escapeHtml(contact_name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Province / Location:</strong> ${escapeHtml(location_province)}</p>
        <p><strong>Area of Sector Interest:</strong> ${escapeHtml(sector_interest)}</p>
        <p><strong>Statement / Message:</strong></p>
        <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #175432;">
          ${escapeHtml(message || 'No additional message provided.').replace(/\n/g, '<br/>')}
        </blockquote>
      `,
    })

    return NextResponse.json({
      success: true,
      message:
        'Thank you! Your membership enquiry/application has been recorded and submitted to the Secretariat.',
    })
  } catch (error: any) {
    console.error('Membership API error:', error)
    return NextResponse.json(
      { error: 'An unexpected server error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
