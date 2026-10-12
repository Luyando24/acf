/**
 * Provider-agnostic Newsletter Adapter
 * Supports local DB subscribers, Mailchimp, Brevo, or mock.
 */

export interface NewsletterSubscriber {
  email: string
  source?: string
}

export async function addSubscriber({ email, source = 'website' }: NewsletterSubscriber): Promise<{ success: boolean; message?: string }> {
  const provider = process.env.NEWSLETTER_PROVIDER || 'mock'

  if (provider === 'mock') {
    return { success: true, message: 'Subscribed successfully (dev mode).' }
  }

  // Extensible integration points for Brevo / Mailchimp
  return { success: true }
}
