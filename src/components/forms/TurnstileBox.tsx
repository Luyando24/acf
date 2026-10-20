'use client'

import { useEffect, useRef } from 'react'

const TEST_SITE_KEY = '1x00000000000000000000AA'

interface TurnstileBoxProps {
  onToken: (token: string) => void
}

export default function TurnstileBox({ onToken }: TurnstileBoxProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!siteKey || siteKey === TEST_SITE_KEY || !containerRef.current) return

    const render = () => {
      const turnstile = (window as Window & { turnstile?: { render: (el: HTMLElement, options: object) => void } }).turnstile
      if (!turnstile || !containerRef.current) return
      containerRef.current.innerHTML = ''
      turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onToken,
      })
    }

    const existing = document.querySelector('script[src*="turnstile/v0/api.js"]')
    if (existing) {
      render()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.onload = render
    document.head.appendChild(script)
  }, [onToken, siteKey])

  if (!siteKey || siteKey === TEST_SITE_KEY) return null
  return <div ref={containerRef} className="min-h-16" />
}
