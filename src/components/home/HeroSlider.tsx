'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react'
import { HeroSlide } from '@/lib/supabase/settings'

interface HeroSliderProps {
  slides: HeroSlide[]
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const slideCount = slides.length

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slideCount)
  }, [slideCount])

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slideCount) % slideCount)
  }, [slideCount])

  useEffect(() => {
    if (!isPlaying || isHovered || slideCount <= 1) return
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [isPlaying, isHovered, slideCount, nextSlide])

  if (!slides || slides.length === 0) {
    return null
  }

  const activeSlide = slides[current]

  return (
    <section
      className="relative overflow-hidden bg-[#0f1d14] text-white min-h-[580px] lg:min-h-[660px] flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="ACF Highlights Slider"
    >
      {/* 1. SLIDER BACKGROUND IMAGES */}
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
                className="w-full h-full object-cover object-center lg:object-[center_right] transform scale-100 transition-transform duration-7000 ease-out"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          )
        })}
      </div>

      {/* 2. SOLID FADING OVERLAY FROM LEFT (HERO TEXT CONTAINER) */}
      {/* Mobile: Top-to-bottom dark fade for 100% legibility */}
      <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-[#0f1d14] via-[#0f1d14]/90 to-[#0f1d14]/75 pointer-events-none z-10" />

      {/* Desktop: Solid #0f1d14 on the left where text lives, fading to transparent on the right to show photos */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#0f1d14] from-40% via-[#0f1d14]/90 via-60% via-[#0f1d14]/50 via-75% to-transparent to-100% pointer-events-none z-10" />

      {/* Subtle top/bottom edge shadow for seamless integration */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0f1d14] to-transparent pointer-events-none z-10" />

      {/* 3. HERO CONTENT CONTAINER */}
      <div className="container relative mx-auto px-4 py-20 lg:py-28 z-20">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
            Evidence-Based Dialogue for Zambia&apos;s Agricultural Transformation
          </h1>

          <p className="text-lg sm:text-xl text-emerald-100/90 leading-relaxed font-normal max-w-2xl">
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

        {/* 4. SLIDER CONTROLS & PHOTO CAPTION STRIP */}
        <div className="mt-12 lg:mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
          {/* Active Photo Caption Badge */}
          {activeSlide.caption && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f1d14]/90 border border-white/15 text-xs text-emerald-200/90 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-pulse" />
              <span className="font-semibold">{activeSlide.caption}</span>
            </div>
          )}

          {/* Controls: Indicators + Navigation Buttons */}
          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            {/* Slide Dots */}
            <div className="flex items-center gap-1.5 bg-black/30 p-1.5 rounded-full backdrop-blur-md border border-white/10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === current
                      ? 'w-6 bg-[#a3e635]'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevSlide}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-emerald-200 flex items-center justify-center transition-colors cursor-pointer text-xs"
                aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
