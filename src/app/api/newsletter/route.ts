import { NextResponse } from 'next/server'
import { newsletterSchema } from '@/lib/validations/forms'
import { createClient } from '@/lib/supabase/server'
import { addSubscriber } from '@/lib/newsletter/adapter'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const validation = newsletterSchema.safeParse(json)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid form input' },
        { status: 400 }
      )
    }

    const { email, source, honeypot } = validation.data

    if (honeypot) {
      // Spam honeypot triggered: return fake success to silent fail
      return NextResponse.json({ success: true, message: 'Subscribed' })
    }

    const supabase = await createClient()

    // Store in Supabase
    const { error: dbError } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        {
          email,
          status: 'subscribed',
          source: source || 'website',
          consent_at: new Date().toISOString(),
        } as any,
        { onConflict: 'email' }
      )

    if (dbError) {
      console.error('Newsletter subscription database error:', dbError)
      // If DB fails (e.g. during local offline dev), continue with adapter
    }

    await addSubscriber({ email, source })

    return NextResponse.json({
      success: true,
      message: 'Subscribed to ACF policy updates successfully.',
    })
  } catch (error: any) {
    console.error('Newsletter API error:', error)
    return NextResponse.json(
      { error: 'An unexpected server error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
