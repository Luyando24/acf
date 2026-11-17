import type { NextConfig } from "next";

// Client-side external surface: Cloudflare Turnstile (script + iframe),
// Google Maps embed iframe, Supabase (REST/auth/websockets + storage images),
// Facebook CDN post images. Fonts are self-hosted via next/font.
const isDev = process.env.NODE_ENV !== "production";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://*.supabase.co https://*.fbcdn.net",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com",
  "frame-src https://www.google.com https://challenges.cloudflare.com",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
  async redirects() {
    // Permanent (308) consolidation of retired and alias URLs so search
    // engines pass equity to the live route instead of juggling duplicates.
    return [
      { source: '/dialogues', destination: '/events', permanent: true },
      { source: '/knowledge-hub', destination: '/publications', permanent: true },
      { source: '/board', destination: '/about/board', permanent: true },
      { source: '/staff', destination: '/about/secretariat', permanent: true },
      { source: '/management', destination: '/about/secretariat', permanent: true },
      { source: '/about/management', destination: '/about/secretariat', permanent: true },
      { source: '/about/staff', destination: '/about/secretariat', permanent: true },
      { source: '/climate-resilience', destination: '/our-work#climate-resilience', permanent: true },
      { source: '/policy-advocacy', destination: '/our-work#policy-advocacy', permanent: true },
      { source: '/research-and-evidence', destination: '/our-work#research-and-evidence', permanent: true },
      { source: '/our-work/:slug', destination: '/our-work#:slug', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ]
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
