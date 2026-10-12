'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { HeroSlide } from '@/lib/supabase/settings'

interface HeroSliderProps {
  slides: HeroSlide[]
}

export default function HeroSlider({ slides }: HeroSliderProps) {
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
      className="relative overflow-hidden bg-[#0f1d14] text-white min-h-[560px] lg:min-h-[640px] flex items-center"
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
              <img
                src={slide.image_url}
                alt={slide.alt_text || 'ACF Agricultural Forum'}
                className="w-full h-full object-cover object-center lg:object-[75%_center]"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          )
        })}
      </div>

      {/* 2. SOLID BACKGROUND LAYER WITH CRISP WHITE DIVIDER BORDER (NO FADE) */}
      {/* Mobile: Solid #0f1d14 background for 100% legibility */}
      <div className="md:hidden absolute inset-0 bg-[#0f1d14]/95 pointer-events-none z-10" />

      {/* Tablet & Desktop: Solid #0f1d14 on the left up to the dividing line, with a crisp white border */}
      <svg
        className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Solid #0f1d14 left section without any fade */}
        <path
          d="M 0,0 L 610,0 C 580,350 510,650 460,1000 L 0,1000 Z"
          fill="#0f1d14"
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
      <div className="container relative mx-auto px-4 py-20 lg:py-28 z-20">
        <div className="max-w-xl lg:max-w-2xl space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
            Evidence-Based Dialogue for Zambia&apos;s Agricultural Transformation
          </h1>

          <p className="text-lg sm:text-xl text-emerald-100/90 leading-relaxed font-normal max-w-xl">
            Connecting smallholder farmers, policymakers, agribusinesses, and researchers to champion sustainable agriculture, climate resilience, and food security across Zambia.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/our-work"
              className="px-8 py-4 bg-[#2da44e] hover:bg-[#34a853] text-[#0a140e] font-extrabold rounded-full transition-all flex items-center gap-2 shadow-lg shadow-[#2da44e]/25 hover:scale-105"
            >
              <span>Explore Our Work</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/publications"
              className="px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all border border-white/20 backdrop-blur-xs flex items-center gap-2"
            >
              <BookOpen size={18} />
              <span>Publications & Research</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
