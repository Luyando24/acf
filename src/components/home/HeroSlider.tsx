'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import type { HeroSlide } from '@/lib/supabase/settings'
import type { HeroConfig } from '@/types/pageContent'
import ContentImage from '@/components/ui/ContentImage'

interface HeroSliderProps {
  slides: HeroSlide[]
  heroConfig?: HeroConfig
}

export default function HeroSlider({ slides, heroConfig }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const slideCount = slides.length

  // Fully automatic carousel cycling every 5 seconds
  useEffect(() => {
    if (slideCount <= 1) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideCount)
    }, 5000)
    return () => clearInterval(interval)
  }, [slideCount])

  if (!slides || slides.length === 0) {
    return null
  }

  return (
    <section
      className="relative overflow-hidden bg-[#153e28] text-white min-h-[440px] lg:min-h-[500px] flex items-center"
      aria-label="ACF Highlights Slider"
    >
      {/* 1. SLIDER BACKGROUND IMAGES (RIGHT & FULL BLEED) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {slides.map((slide, index) => {
          const isActive = index === current
          return (
            <div
              key={slide.image_url + index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
            >
              <ContentImage
                src={slide.image_url}
                alt={slide.alt_text || 'ACF Agricultural Forum'}
                priority={index === 0}
                className="object-cover object-center lg:object-[75%_center]"
              />
            </div>
          )
        })}
      </div>

      {/* 2. SOLID BACKGROUND LAYER WITH PATTERN & CRISP WHITE DIVIDER BORDER */}
      {/* Mobile: Solid #153e28 background with subtle pattern */}
      <div className="md:hidden absolute inset-0 bg-[#153e28]/95 pointer-events-none z-10 overflow-hidden">
        <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="mobile-hero-pattern" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#2e9e5b" strokeWidth="0.75" strokeOpacity="0.12" />
              <circle cx="0" cy="0" r="1.2" fill="#4ade80" fillOpacity="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mobile-hero-pattern)" />
        </svg>
      </div>

      {/* Tablet & Desktop: Solid #153e28 with bespoke pattern on the left, separated by crisp white border */}
      <svg
        className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle architectural dot-matrix & grid pattern */}
          <pattern
            id="hero-grid-pattern"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 28 0 L 0 0 0 28"
              fill="none"
              stroke="#2e9e5b"
              strokeWidth="0.75"
              strokeOpacity="0.12"
            />
            <circle
              cx="0"
              cy="0"
              r="1.2"
              fill="#4ade80"
              fillOpacity="0.25"
            />
          </pattern>
        </defs>

        {/* Solid #153e28 base background */}
        <path
          d="M 0,0 L 610,0 C 580,350 510,650 460,1000 L 0,1000 Z"
          fill="#153e28"
        />

        {/* Geometric pattern overlay clipped to the solid region */}
        <path
          d="M 0,0 L 610,0 C 580,350 510,650 460,1000 L 0,1000 Z"
          fill="url(#hero-grid-pattern)"
        />

        {/* Crisp white dividing border along the edge */}
        <path
          d="M 610,0 C 580,350 510,650 460,1000"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* 3. HERO CONTENT CONTAINER (POSITIONED WITHIN THE SOLID REGION) */}
      <div className="container relative mx-auto px-4 py-12 lg:py-16 z-20">
        <div className="max-w-xl lg:max-w-2xl space-y-5">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
            {heroConfig?.headline || 'Driving Evidence-Based Policy for a Food-Secure Zambia'}
          </h1>

          <p className="text-base sm:text-lg text-emerald-50/95 leading-relaxed font-normal max-w-xl">
            {heroConfig?.subheadline ||
              'The premier public-private dialogue platform bridging the gap between government, farmer organisations, civil society and academia, agribusiness and cooperative partners to transform the agricultural sector.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href={heroConfig?.primary_cta_url || '/publications'}
              className="px-8 py-4 bg-[#2e9e5b] hover:bg-[#258249] text-white font-extrabold rounded-full transition-all flex items-center gap-2 shadow-lg shadow-[#2e9e5b]/25 hover:scale-105"
            >
              <span>{heroConfig?.primary_cta_text || 'Explore Knowledge Hub'}</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href={heroConfig?.secondary_cta_url || '/publications'}
              className="px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all border border-white/25 backdrop-blur-xs flex items-center gap-2"
            >
              <BookOpen size={18} />
              <span>{heroConfig?.secondary_cta_text || 'Read Latest Policy Briefs'}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
