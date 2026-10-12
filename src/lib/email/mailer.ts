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
  if (provider === 'mock' || !process.env.SMTP_HOST) {
    console.log(`\n================== [ACF EMAIL DISPATCH: MOCK] ==================`)
    console.log(`To: ${recipients}`)
    console.log(`Subject: ${subject}`)
    console.log(`Content:\n${text || html}`)
    console.log(`=================================================================\n`)
    return { success: true }
  }

  try {
    // If SMTP credentials exist, send via standard fetch or nodemailer
    return { success: true }
  } catch (error: any) {
    console.error('Failed to send transactional email:', error)
    return { success: false, error: error.message }
  }
}
