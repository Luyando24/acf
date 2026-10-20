import { NextResponse } from 'next/server'
import { newsletterSchema } from '@/lib/validations/forms'
import { createClient } from '@/lib/supabase/server'
import { allowRequest, clientIp } from '@/lib/security/requests'

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
      return NextResponse.json({ success: true, message: 'Saved' })
    }

    if (!allowRequest(`newsletter:${clientIp(request)}`)) {
      return NextResponse.json({ error: 'Too many signups. Please try again later.' }, { status: 429 })
    }

    const supabase = await createClient()
    const { error: dbError } = await supabase.from('newsletter_subscribers').insert({
      email,
      status: 'pending',
      source: source || 'website',
      consent_at: new Date().toISOString(),
    } as any)

    if (dbError) {
      if (dbError.code === '23505') {
        return NextResponse.json({
          success: true,
          message: 'This address is already on the list.',
        })
      }
      console.error('Newsletter subscription database error:', dbError)
      return NextResponse.json(
        { error: 'Your address could not be saved. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Your address has been recorded. ACF will confirm it before sending updates.',
    })
  } catch (error) {
    console.error('Newsletter API error:', error)
    return NextResponse.json(
      { error: 'An unexpected server error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
