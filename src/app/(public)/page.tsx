import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Download,
  FileText,
  Scale,
  Shield,
  Sprout,
  Users,
  ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getSiteSettings, getSiteStats, getHeroSlides } from '@/lib/supabase/settings'
import { getPageContent, HomePageContent } from '@/lib/supabase/pageContent'
import { formatDate } from '@/lib/utils/formatters'
import HeroSlider from '@/components/home/HeroSlider'
import ContentImage from '@/components/ui/ContentImage'

export default async function HomePage() {
  const supabase = await createClient()
  const [settings, pageContent] = await Promise.all([
    getSiteSettings(),
    getPageContent<HomePageContent>('home'),
  ])

  const heroSlides = pageContent?.hero_slides && pageContent.hero_slides.length > 0 
    ? pageContent.hero_slides 
    : await getHeroSlides()
    
  const stats = pageContent?.stats && pageContent.stats.length > 0 
    ? pageContent.stats 
    : await getSiteStats()

  // Fetch dynamic content from database with graceful fallback handling
  const [programmesRes, publicationsRes, newsRes, partnersRes] =
    await Promise.all([
      supabase
        .from('programmes')
        .select('*')
        .eq('status', 'published')
        .order('order_index', { ascending: true })
        .limit(4),
      supabase
        .from('publications')
        .select('*, publication_categories(name)')
        .eq('status', 'published')
        .order('published_on', { ascending: false })
        .limit(3),
      supabase
        .from('news_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3),
      supabase
        .from('partners')
        .select('*')
        .eq('is_visible', true)
        .eq('show_on_home', true)
        .order('order_index', { ascending: true }),
    ])

  const programmes = (programmesRes.data || []) as any[]
  const publications = (publicationsRes.data || []) as any[]
  const newsList = (newsRes.data || []) as any[]
  const partners = (partnersRes.data || []) as any[]

  const DEFAULT_NEWS_IMAGES = [
    '/photos/fosta-stakeholders-dialogue.jpg',
    '/photos/agricultural-budget-analysis.jpg',
    '/photos/beef-report-workshop.jpg',
  ]

  const FALLBACK_NEWS = [
    {
      slug: 'national-consultative-dialogue-food-security-2026',
      title: 'ACF Convenes National Stakeholder Dialogue on Sustainable Food Security',
      category: 'Policy Dialogue',
      published_at: '2026-03-01T09:00:00Z',
      featured_image: '/photos/fosta-stakeholders-dialogue.jpg',
      excerpt:
        'Key stakeholders from government ministries, farmer federations, and agribusiness gathered in Lusaka to review post-drought recovery mechanisms.',
    },
    {
      slug: 'evidence-based-review-fisp-reforms',
      title: 'Stakeholder Submission on Agricultural Input Programme Modernisation',
      category: 'Sector News',
      published_at: '2026-02-18T10:30:00Z',
      featured_image: '/photos/agricultural-budget-analysis.jpg',
      excerpt:
        'ACF presents its comprehensive policy review on input distribution efficiency and transparent electronic vouchers for rural smallholders.',
    },
    {
      slug: 'beef-value-chain-workshop-2026',
      title: 'Livestock & Beef Value Chain Dissemination Workshop',
      category: 'Research & Evidence',
      published_at: '2026-01-25T08:30:00Z',
      featured_image: '/photos/beef-report-workshop.jpg',
      excerpt:
        'Dissemination of empirical findings on livestock productivity, animal health systems, and commercial cattle marketing channels across Zambia.',
    },
  ]

  const displayNews =
    newsList.length >= 3
      ? newsList.slice(0, 3)
      : [...newsList, ...FALLBACK_NEWS.slice(newsList.length, 3)]

  const PARTNER_LOGOS: Record<string, string> = {
    'Ministry of Agriculture': '/partners/ministry-of-agriculture.svg',
    'Ministry of Agriculture - Zambia': '/partners/ministry-of-agriculture.svg',
    'Zambia National Farmers Union (ZNFU)': '/partners/znfu.svg',
    'Indaba Agricultural Policy Research Institute (IAPRI)': '/partners/iapri.svg',
    'International Land Coalition (ILC)': '/partners/ilc.svg',
    'Grain Traders Association of Zambia': '/partners/gtaz.svg',
    'Food and Agriculture Organization (FAO)': '/partners/fao.svg',
  }

  // Feedback 1.2: Temporarily hide homepage statistics strip below hero.
  // Preserved for 1-step restoration: flip to true when requested by client.
  const SHOW_HOMEPAGE_STATS = false

  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION WITH PHOTO SLIDER & SOLID FADING OVERLAY */}
      <HeroSlider slides={heroSlides} />

      {/* 2. STATS HIGHLIGHTS STRIP (Temporarily hidden per client feedback - 1-step reversible) */}
      {SHOW_HOMEPAGE_STATS && stats && stats.length > 0 && (
        <section className="relative z-10 -mt-10 container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-[#dbe6de] p-6 lg:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[#dbe6de]">
            {stats.map((item, index) => (
              <div
                key={item.label}
                className={`flex flex-col items-center text-center ${
                  index > 0 ? 'pt-4 lg:pt-0 lg:pl-6' : ''
                }`}
              >
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1e7e48] tracking-tight">
                  {item.value}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#526658] mt-1 uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. ABOUT ACF SNIPPET (Shortened & streamlined per Feedback 1.1) */}
      <section className="py-14 lg:py-18 bg-[#fdfdfd]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-black uppercase tracking-widest text-[#1e7e48] bg-[#eef6f1] px-3 py-1 rounded-md">
                {pageContent?.about_snippet?.badge || 'About The Forum'}
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#122419] tracking-tight">
                {pageContent?.about_snippet?.title || 'A Neutral Platform for Agricultural Policy Reform'}
              </h2>

              <p className="text-[#3b4d41] text-base leading-relaxed">
                {pageContent?.about_snippet?.description ||
                  "The Agricultural Consultative Forum (ACF) unites government ministries, agribusiness enterprises, research bodies, and smallholder farmer groups to advance evidence-based policy reform and sustainable agriculture across Zambia."}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={pageContent?.about_snippet?.primary_btn_url || '/about'}
                  className="px-5 py-2.5 bg-[#1e7e48] hover:bg-[#166538] text-white font-bold text-sm rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>{pageContent?.about_snippet?.primary_btn_text || 'About ACF'}</span>
                  <ChevronRight size={15} />
                </Link>
                <Link
                  href={pageContent?.about_snippet?.secondary_btn_url || '/about/management'}
                  className="px-5 py-2.5 border border-[#1e7e48] text-[#1e7e48] hover:bg-[#eef6f1] font-bold text-sm rounded-full transition-colors"
                >
                  {pageContent?.about_snippet?.secondary_btn_text || 'Leadership & Team'}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-xl border border-[#dbe6de] group bg-neutral-100">
                <ContentImage
                  src={
                    (pageContent?.about_snippet as any)?.image_url ||
                    '/photos/fosta-stakeholders-dialogue.jpg'
                  }
                  alt={
                    pageContent?.about_snippet?.title ||
                    'Agricultural Consultative Forum Stakeholder Dialogue in Lusaka'
                  }
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-auto bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#dbe6de] shadow-md flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#2e9e5b] shrink-0" />
                  <span className="text-xs font-bold text-[#122419]">
                    Multi-Stakeholder Policy Dialogue • Lusaka
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THEMATIC PROGRAMMES (OUR WORK) */}
      <section className="py-14 lg:py-18 bg-[#f4f8f5] border-y border-[#dbe6de]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#1e7e48] bg-[#dbe6de] px-3 py-1 rounded-md">
                {pageContent?.programmes_section?.badge || 'Our Work'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#122419] tracking-tight mt-1.5">
                {pageContent?.programmes_section?.title || 'Core Thematic Programmes'}
              </h2>
              <p className="text-[#526658] text-xs sm:text-sm mt-1 max-w-xl">
                {pageContent?.programmes_section?.description ||
                  'Dedicated programmes addressing systemic challenges in agricultural productivity, trade policy, and environmental sustainability.'}
              </p>
            </div>

            <Link
              href="/our-work"
              className="text-[#1e7e48] font-bold text-xs sm:text-sm hover:underline flex items-center gap-1.5 shrink-0"
            >
              <span>{pageContent?.programmes_section?.view_all_text || 'View All Programmes'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {programmes.map((prog) => (
              <div
                key={prog.slug}
                className="bg-white rounded-2xl p-5 border border-[#dbe6de] shadow-xs hover:shadow-lg hover:border-[#2e9e5b]/50 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#eef6f1] text-[#1e7e48] group-hover:bg-[#1e7e48] group-hover:text-white transition-colors flex items-center justify-center mb-4">
                    <Scale size={20} />
                  </div>
                  <h3 className="text-base font-bold text-[#122419] group-hover:text-[#1e7e48] transition-colors mb-1.5">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-[#526658] leading-relaxed line-clamp-2">
                    {prog.summary}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-[#f4f8f5]">
                  <Link
                    href={`/our-work/${prog.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1e7e48] group-hover:text-[#2e9e5b]"
                  >
                    <span>Read Details</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECTOR NEWS & UPDATES (Full-row 3-post grid with pictures properly displayed) */}
      <section className="py-14 lg:py-18 bg-[#f4f8f5] border-b border-[#dbe6de]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#1e7e48] bg-[#dbe6de] px-3 py-1 rounded-md">
                {pageContent?.news_events_section?.news_badge || 'Sector Updates'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#122419] tracking-tight mt-1.5">
                {pageContent?.news_events_section?.news_title || 'Sector News & Articles'}
              </h2>
              <p className="text-[#526658] text-xs sm:text-sm mt-1 max-w-xl">
                Recent policy consultations, agricultural developments, and stakeholder dialogue releases from ACF and partners.
              </p>
            </div>

            <Link
              href="/news"
              className="text-[#1e7e48] font-bold text-xs sm:text-sm hover:underline flex items-center gap-1.5 shrink-0"
            >
              <span>View All News</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayNews.map((news: any, idx: number) => {
              const newsImg =
                news.image_url ||
                news.featured_image ||
                DEFAULT_NEWS_IMAGES[idx % DEFAULT_NEWS_IMAGES.length]

              return (
                <article
                  key={news.slug || idx}
                  className="bg-white rounded-3xl border border-[#dbe6de] overflow-hidden shadow-xs hover:shadow-lg hover:border-[#2e9e5b]/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Article Feature Image with responsive aspect ratio */}
                    <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
                      <ContentImage
                        src={newsImg}
                        alt={news.title}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#1e7e48] font-bold text-xs shadow-xs">
                          {news.category || 'Sector News'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-[#526658] mb-2.5">
                        <Calendar size={13} className="text-[#1e7e48] shrink-0" />
                        <span>{formatDate(news.published_at)}</span>
                      </div>

                      <h3 className="text-base font-bold text-[#122419] group-hover:text-[#1e7e48] transition-colors leading-snug mb-2 line-clamp-2">
                        <Link href={`/news/${news.slug}`}>{news.title}</Link>
                      </h3>

                      <p className="text-xs text-[#526658] leading-relaxed line-clamp-3">
                        {news.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-[#f4f8f5] flex justify-end">
                    <Link
                      href={`/news/${news.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e7e48] group-hover:text-[#2e9e5b]"
                    >
                      <span>Read Story</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* 6. FEATURED PUBLICATIONS REPOSITORY */}
      <section className="py-14 lg:py-18 bg-white border-t border-[#dbe6de]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#1e7e48] bg-[#eef6f1] px-3 py-1 rounded-md">
                {pageContent?.publications_section?.badge || 'Knowledge Hub'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#122419] tracking-tight mt-1.5">
                {pageContent?.publications_section?.title || 'Recent Publications & Policy Briefs'}
              </h2>
              <p className="text-[#526658] text-xs sm:text-sm mt-1 max-w-xl">
                {pageContent?.publications_section?.description ||
                  'Independent policy briefs, analytical research reports, and technical guides authored or published by ACF.'}
              </p>
            </div>

            <Link
              href="/publications"
              className="text-[#1e7e48] font-bold text-xs sm:text-sm hover:underline flex items-center gap-1.5 shrink-0"
            >
              <span>{pageContent?.publications_section?.view_all_text || 'Browse All Publications'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publications.map((pub) => (
              <div
                key={pub.slug}
                className="bg-white rounded-2xl border border-[#dbe6de] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#526658] mb-2.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#eef6f1] text-[#1e7e48] font-bold">
                      {(pub.publication_categories as any)?.name || 'Policy Brief'}
                    </span>
                    <span>{formatDate(pub.published_on)}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#122419] leading-snug mb-2 hover:text-[#1e7e48] transition-colors">
                    <Link href={`/publications/${pub.slug}`}>{pub.title}</Link>
                  </h3>

                  <p className="text-xs text-[#526658] leading-relaxed line-clamp-2">
                    {pub.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#dbe6de] mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-[#526658]">
                    {pub.download_count} Downloads
                  </span>
                  <Link
                    href={`/publications/${pub.slug}`}
                    className="flex items-center gap-1 text-xs font-bold text-[#1e7e48] hover:text-[#2e9e5b]"
                  >
                    <Download size={13} />
                    <span>Download PDF</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MEMBERSHIP CALL TO ACTION (Lightened background & improved contrast) */}
      <section className="py-14 lg:py-18 bg-[#153e28] text-white">
        <div className="container mx-auto px-4 text-center max-w-2xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white bg-white/15 px-3 py-1 rounded-full border border-white/20">
            {pageContent?.membership_cta?.badge || 'Stakeholder Engagement'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {pageContent?.membership_cta?.title || 'Join the Agricultural Consultative Forum'}
          </h2>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            {pageContent?.membership_cta?.description ||
              'Connect with agricultural producers, agribusiness leaders, and policymakers across Zambia. Join ACF to participate in national policy dialogues and research initiatives.'}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href={pageContent?.membership_cta?.primary_btn_url || '/membership/apply'}
              className="px-6 py-3 bg-[#2e9e5b] hover:bg-[#258249] text-white font-extrabold text-sm rounded-full transition-all shadow-lg shadow-[#2e9e5b]/25"
            >
              {pageContent?.membership_cta?.primary_btn_text || 'Apply for Membership'}
            </Link>
            <Link
              href={pageContent?.membership_cta?.secondary_btn_url || '/membership'}
              className="px-6 py-3 border border-white/30 hover:bg-white/10 text-white font-bold text-sm rounded-full transition-all"
            >
              {pageContent?.membership_cta?.secondary_btn_text || 'Categories & Benefits'}
            </Link>
          </div>
        </div>
      </section>

      {/* 8. PARTNER HIGHLIGHTS LOGO STRIP (ANIMATED MARQUEE - Large cards & corner-shaped edges) */}
      {partners && partners.length > 0 && (
        <section className="py-14 sm:py-16 bg-[#fdfdfd] border-b border-[#dbe6de] overflow-hidden" aria-label="Collaborating Partners">
          <div className="container mx-auto px-4 mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1e7e48] bg-[#eef6f1] px-3.5 py-1.5 rounded-md inline-block">
              {pageContent?.partners_section?.title || 'Our Collaborating Institutions & Partners'}
            </span>
          </div>

          <div className="relative w-full overflow-hidden">
            {/* Left & Right gradient masks for smooth fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#fdfdfd] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#fdfdfd] to-transparent z-10" />

            {/* Scrolling track */}
            <div className="animate-marquee flex items-center gap-6 sm:gap-8 py-3">
              {[...partners, ...partners, ...partners].map((partner, idx) => {
                const logoSrc = partner.logo_url || PARTNER_LOGOS[partner.name] || '/photos/logo.png'
                return (
                  <div
                    key={`${partner.id}-${idx}`}
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-[#dbe6de] hover:border-[#2e9e5b] shadow-xs hover:shadow-md transition-all shrink-0 cursor-default"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#f4f8f5] border border-[#dbe6de] p-2.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logoSrc}
                        alt={`${partner.name} logo`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm sm:text-base text-[#122419] max-w-[210px] leading-snug">
                        {partner.name}
                      </h4>
                      {partner.type && (
                        <span className="text-[11px] font-semibold text-[#1e7e48] uppercase tracking-wider block">
                          {partner.type}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
