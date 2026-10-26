const hits = new Map<string, { count: number; resetAt: number }>()

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || 'local'
}

export function allowRequest(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now()
  const current = hits.get(key)
  if (!current || current.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (current.count >= limit) return false
  current.count += 1
  return true
}

const TEST_TURNSTILE_SECRET = '1x0000000000000000000000000000000AA'

let warnedMissingTurnstile = false

export function turnstileConfigured(): boolean {
  const secret = process.env.TURNSTILE_SECRET_KEY
  return Boolean(secret && secret !== TEST_TURNSTILE_SECRET && !secret.includes('placeholder'))
}

export async function verifyTurnstile(token: string | undefined, ip: string): Promise<string | null> {
  // Without real keys the widget cannot challenge anyone, so enforcement would only
  // reject every submission. Honeypot + rate limiting still apply.
  if (!turnstileConfigured()) {
    if (!warnedMissingTurnstile) {
      warnedMissingTurnstile = true
      console.warn(
        '[security] Turnstile keys are missing or still set to test values. ' +
          'Form submissions fall back to honeypot and rate limiting until real keys are configured.'
      )
    }
    return null
  }
  if (!token) return 'Please complete the spam check.'

  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY || '',
    response: token,
    remoteip: ip,
  })
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  })
  const data = (await response.json().catch(() => null)) as { success?: boolean } | null
  if (!data?.success) return 'Spam check failed. Please try again.'
  return null
}

export function safeRevalidatePath(value: unknown): string | null {
  if (typeof value !== 'string') return null
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('://') || value.includes('\\')) {
    return null
  }
  return value
}
