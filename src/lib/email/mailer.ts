/**
 * Transactional email service for ACF forms (Contact, Membership Notifications).
 * Designed for full compatibility with Microsoft 365 mailboxes.
 */

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  const provider = process.env.EMAIL_PROVIDER || 'mock'
  const recipients = Array.isArray(to) ? to.join(', ') : to

  // In local/mock mode or if SMTP is not yet configured, log email safely
  if (provider === 'mock' || !process.env.SMTP_HOST || !process.env.SMTP_USER) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n================== [ACF EMAIL DISPATCH: NOT SENT] ==================`)
      console.log(`To: ${recipients}`)
      console.log(`Subject: ${subject}`)
      console.log(`====================================================================\n`)
    }
    return { success: false, error: 'Email delivery is not configured.' }
  }

  try {
    return { success: false, error: 'SMTP delivery is not connected yet.' }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to send email.'
    console.error('Failed to send transactional email:', error)
    return { success: false, error: message }
  }
}
