import { NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validations/forms'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/mailer'

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

    const { name, email, phone, subject, message, consent_given, honeypot } =
      validation.data

    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Message sent' })
    }

    const supabase = await createClient()

    // 1. Store submission in database
    const { error: dbError } = await supabase.from('contact_messages').insert({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      consent_given,
      is_read: false,
    } as any)

    if (dbError) {
      console.error('Contact message database error:', dbError)
    }

    // 2. Dispatch email to ACF staff mailboxes
    const recipients =
      process.env.CONTACT_FORM_RECIPIENTS?.split(',').map((r) => r.trim()) || [
        'info@acfzambia.org',
      ]

    await sendEmail({
      to: recipients,
      subject: `[ACF Website Enquiry] ${subject}`,
      html: `
        <h2>New Contact Enquiry from ACF Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #175432;">
          ${message.replace(/\n/g, '<br/>')}
        </blockquote>
        <p><small>Submitted at: ${new Date().toUTCString()} (Consent verified under Zambian Data Protection Act)</small></p>
      `,
    })

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
