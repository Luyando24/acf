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
    return { success: false, message: 'Newsletter provider is not configured.' }
  }

  return { success: false, message: 'Newsletter provider is not connected.' }
}
