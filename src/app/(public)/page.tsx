import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Download,
  FileText,
  MapPin,
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
import SocialHighlights from '@/components/home/SocialHighlights'

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
  const [programmesRes, publicationsRes, newsRes, eventsRes, partnersRes] =
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
        .from('events')
        .select('*')
        .eq('status', 'published')
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true })
        .limit(2),
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
  const upcomingEvents = (eventsRes.data || []) as any[]
  const partners = (partnersRes.data || []) as any[]

  const PARTNER_LOGOS: Record<string, string> = {
    'Ministry of Agriculture': '/partners/ministry-of-agriculture.svg',
    'Ministry of Agriculture - Zambia': '/partners/ministry-of-agriculture.svg',
    'Zambia National Farmers Union (ZNFU)': '/partners/znfu.svg',
    'Indaba Agricultural Policy Research Institute (IAPRI)': '/partners/iapri.svg',
    'International Land Coalition (ILC)': '/partners/ilc.svg',
    'Grain Traders Association of Zambia': '/partners/gtaz.svg',
    'Food and Agriculture Organization (FAO)': '/partners/fao.svg',
  }

  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION WITH PHOTO SLIDER & SOLID FADING OVERLAY */}
      <HeroSlider slides={heroSlides} />

      {/* 2. STATS HIGHLIGHTS STRIP */}
      {stats && stats.length > 0 && (
        <section className="relative z-10 -mt-10 container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-[#e2ebe4] p-6 lg:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[#e2ebe4]">
            {stats.map((item, index) => (
              <div
                key={item.label}
                className={`flex flex-col items-center text-center ${
                  index > 0 ? 'pt-4 lg:pt-0 lg:pl-6' : ''
                }`}
              >
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#175432] tracking-tight">
                  {item.value}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#5c6f62] mt-1 uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. ABOUT ACF SNIPPET */}
      <section className="py-20 lg:py-28 bg-[#fdfdfd]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-[#175432] bg-[#f0f6f1] px-3 py-1 rounded-md">
                {pageContent?.about_snippet?.badge || 'About The Forum'}
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f1d14] tracking-tight">
                {pageContent?.about_snippet?.title || 'A Credible, Neutral Platform for Agricultural Policy Reform'}
              </h2>

              <p className="text-[#3b4d41] text-base sm:text-lg leading-relaxed">
                {pageContent?.about_snippet?.description ||
                  "Established in Lusaka, the Agricultural Consultative Forum (ACF) bridges key players across Zambia's agricultural sector. We bring together public ministries, agricultural enterprises, academic research bodies, and grassroots farmer groups to address pressing policy bottlenecks."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-[#e2ebe4] shadow-xs">
                  <h3 className="font-bold text-[#0f1d14] text-base mb-1 flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#2da44e]" />
                    {pageContent?.about_snippet?.feature_1?.title || 'Evidence-Based Decisions'}
                  </h3>
                  <p className="text-xs text-[#5c6f62] leading-relaxed">
                    {pageContent?.about_snippet?.feature_1?.description ||
                      'Empirical performance data to guide timely agricultural policy actions.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#e2ebe4] shadow-xs">
                  <h3 className="font-bold text-[#0f1d14] text-base mb-1 flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#2da44e]" />
                    {pageContent?.about_snippet?.feature_2?.title || 'Inclusive Tenure Rights'}
                  </h3>
                  <p className="text-xs text-[#5c6f62] leading-relaxed">
                    {pageContent?.about_snippet?.feature_2?.description ||
                      'Advocating for secure customary land tenure and equal rights for women.'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  href={pageContent?.about_snippet?.primary_btn_url || '/about'}
                  className="px-6 py-3 bg-[#175432] hover:bg-[#114227] text-white font-bold text-sm rounded-full transition-colors flex items-center gap-2 shadow-md"
                >
                  <span>{pageContent?.about_snippet?.primary_btn_text || 'Learn More About ACF'}</span>
                  <ChevronRight size={16} />
                </Link>
                <Link
                  href={pageContent?.about_snippet?.secondary_btn_url || '/about/management'}
                  className="px-6 py-3 border border-[#175432] text-[#175432] hover:bg-[#f0f6f1] font-bold text-sm rounded-full transition-colors"
                >
                  {pageContent?.about_snippet?.secondary_btn_text || 'Leadership & Team'}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl bg-[#175432] p-8 text-white shadow-2xl border border-[#2da44e]/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
                <h3 className="text-2xl font-bold mb-4 text-[#a3e635]">
                  {pageContent?.strategic_objectives?.title || 'ACF Strategic Objectives'}
                </h3>
                <ul className="space-y-4 text-sm text-emerald-100/90 leading-relaxed">
                  {(pageContent?.strategic_objectives?.objectives && pageContent.strategic_objectives.objectives.length > 0
                    ? pageContent.strategic_objectives.objectives
                    : [
                        {
                          num: 1,
                          title: 'Stakeholder Mobilisation',
                          description: 'Engage actors at national and provincial levels for agricultural policy advocacy.',
                        },
                        {
                          num: 2,
                          title: 'Credible Evidence Generation',
                          description: 'Deliver empirical assessments on agricultural budgets, inputs, and food markets.',
                        },
                        {
                          num: 3,
                          title: 'Knowledge Management',
                          description: 'Maintain a trusted central repository of Zambian agricultural research and publications.',
                        },
                        {
                          num: 4,
                          title: 'Tenure & Gender Equity',
                          description: 'Strengthen small-scale farming systems and ensure equal land rights for women farmers.',
                        },
                      ]
                  ).map((obj) => (
                    <li key={obj.num} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2da44e] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {obj.num}
                      </div>
                      <span>
                        <strong>{obj.title}:</strong> {obj.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THEMATIC PROGRAMMES (OUR WORK) */}
      <section className="py-20 bg-[#f6f9f6] border-y border-[#e2ebe4]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#175432] bg-[#e2ebe4] px-3 py-1 rounded-md">
                {pageContent?.programmes_section?.badge || 'Our Work'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f1d14] tracking-tight mt-2">
                {pageContent?.programmes_section?.title || 'Core Thematic Programmes'}
              </h2>
              <p className="text-[#5c6f62] text-sm sm:text-base mt-1 max-w-xl">
                {pageContent?.programmes_section?.description ||
                  'Dedicated programmes addressing systemic challenges in agricultural productivity, trade policy, and environmental sustainability.'}
              </p>
            </div>

            <Link
              href="/our-work"
              className="text-[#175432] font-bold text-sm hover:underline flex items-center gap-1.5 shrink-0"
            >
              <span>{pageContent?.programmes_section?.view_all_text || 'View All Programmes'}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programmes.map((prog) => (
              <div
                key={prog.slug}
                className="bg-white rounded-2xl p-6 border border-[#e2ebe4] shadow-xs hover:shadow-xl hover:border-[#2da44e]/50 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#f0f6f1] text-[#175432] group-hover:bg-[#175432] group-hover:text-white transition-colors flex items-center justify-center mb-5">
                    <Scale size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0f1d14] group-hover:text-[#175432] transition-colors mb-2">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-[#5c6f62] leading-relaxed line-clamp-3">
                    {prog.summary}
                  </p>
                </div>

                <div className="pt-6">
                  <Link
                    href={`/our-work/${prog.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#175432] group-hover:text-[#2da44e]"
                  >
                    <span>Read Details</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SOCIAL MEDIA HIGHLIGHTS (LIVE FEED) */}
      <SocialHighlights facebookUrl={settings.facebook_url} />

      {/* 6. NEWS & EVENTS SPLIT SECTION */}
      <section className="py-20 bg-[#f6f9f6] border-t border-[#e2ebe4]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* News Updates (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#175432]">
                    {pageContent?.news_events_section?.news_badge || 'Updates'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1d14]">
                    {pageContent?.news_events_section?.news_title || 'Sector News & Articles'}
                  </h2>
                </div>
                <Link
                  href="/news"
                  className="text-xs font-bold text-[#175432] hover:underline flex items-center gap-1"
                >
                  <span>All News</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="space-y-4">
                {newsList.map((news) => (
                  <article
                    key={news.slug}
                    className="bg-white p-5 rounded-2xl border border-[#e2ebe4] shadow-xs hover:border-[#175432] transition-colors"
                  >
                    <div className="flex items-center gap-3 text-xs text-[#5c6f62] mb-2">
                      <span className="font-bold text-[#175432] bg-[#f0f6f1] px-2 py-0.5 rounded">
                        {news.category}
                      </span>
                      <span>•</span>
                      <span>{formatDate(news.published_at)}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#0f1d14] hover:text-[#175432] transition-colors">
                      <Link href={`/news/${news.slug}`}>{news.title}</Link>
                    </h3>
                    <p className="text-xs text-[#5c6f62] mt-1 line-clamp-2">
                      {news.excerpt}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            {/* Upcoming Dialogue Events (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#175432]">
                    {pageContent?.news_events_section?.events_badge || 'Dialogues'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1d14]">
                    {pageContent?.news_events_section?.events_title || 'Upcoming Events'}
                  </h2>
                </div>
                <Link
                  href="/events"
                  className="text-xs font-bold text-[#175432] hover:underline flex items-center gap-1"
                >
                  <span>All Events</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((evt) => (
                    <div
                      key={evt.slug}
                      className="bg-white p-5 rounded-2xl border border-[#e2ebe4] shadow-xs flex items-start gap-4"
                    >
                      <div className="w-14 h-14 rounded-xl bg-[#0f1d14] text-[#a3e635] flex flex-col items-center justify-center shrink-0 border border-[#2da44e]/40">
                        <Calendar size={18} />
                        <span className="text-[10px] font-black uppercase mt-0.5">Forum</span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-[#0f1d14] hover:text-[#175432] transition-colors">
                          <Link href={`/events/${evt.slug}`}>{evt.title}</Link>
                        </h3>
                        <p className="text-xs text-[#5c6f62] line-clamp-2">
                          {evt.description}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-[#175432] font-semibold pt-1">
                          <MapPin size={12} />
                          <span>{evt.venue}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-6 rounded-2xl border border-[#e2ebe4] text-center text-xs text-[#5c6f62]">
                    No upcoming events scheduled at this time.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FEATURED PUBLICATIONS REPOSITORY */}
      <section className="py-20 bg-white border-t border-[#e2ebe4]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#175432] bg-[#f0f6f1] px-3 py-1 rounded-md">
                {pageContent?.publications_section?.badge || 'Knowledge Hub'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f1d14] tracking-tight mt-2">
                {pageContent?.publications_section?.title || 'Recent Publications & Policy Briefs'}
              </h2>
              <p className="text-[#5c6f62] text-sm sm:text-base mt-1 max-w-xl">
                {pageContent?.publications_section?.description ||
                  'Independent policy briefs, analytical research reports, and technical guides authored or published by ACF.'}
              </p>
            </div>

            <Link
              href="/publications"
              className="text-[#175432] font-bold text-sm hover:underline flex items-center gap-1.5 shrink-0"
            >
              <span>{pageContent?.publications_section?.view_all_text || 'Browse All Publications'}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publications.map((pub) => (
              <div
                key={pub.slug}
                className="bg-white rounded-2xl border border-[#e2ebe4] p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#5c6f62] mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-[#f0f6f1] text-[#175432] font-bold">
                      {(pub.publication_categories as any)?.name || 'Policy Brief'}
                    </span>
                    <span>{formatDate(pub.published_on)}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0f1d14] leading-snug mb-3 hover:text-[#175432] transition-colors">
                    <Link href={`/publications/${pub.slug}`}>{pub.title}</Link>
                  </h3>

                  <p className="text-xs text-[#5c6f62] leading-relaxed line-clamp-3">
                    {pub.summary}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#e2ebe4] mt-6 flex items-center justify-between">
                  <span className="text-[11px] text-[#5c6f62]">
                    {pub.download_count} Downloads
                  </span>
                  <Link
                    href={`/publications/${pub.slug}`}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#175432] hover:text-[#2da44e]"
                  >
                    <Download size={14} />
                    <span>Download PDF</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. MEMBERSHIP CALL TO ACTION */}
      <section className="py-20 bg-[#175432] text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#a3e635] bg-white/10 px-3 py-1 rounded-full border border-white/15">
            {pageContent?.membership_cta?.badge || 'Stakeholder Engagement'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {pageContent?.membership_cta?.title || 'Join the Agricultural Consultative Forum'}
          </h2>
          <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed">
            {pageContent?.membership_cta?.description ||
              'Whether you represent a smallholder farmer cooperative, an agricultural enterprise, or a research institution, membership gives you a voice in national policy dialogue roundtables.'}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href={pageContent?.membership_cta?.primary_btn_url || '/membership/apply'}
              className="px-8 py-3.5 bg-[#2da44e] hover:bg-[#34a853] text-[#0a140e] font-extrabold rounded-full transition-all shadow-xl shadow-[#2da44e]/20"
            >
              {pageContent?.membership_cta?.primary_btn_text || 'Apply for Membership'}
            </Link>
            <Link
              href={pageContent?.membership_cta?.secondary_btn_url || '/membership'}
              className="px-7 py-3.5 border border-white/20 hover:bg-white/10 text-white font-bold rounded-full transition-all"
            >
              {pageContent?.membership_cta?.secondary_btn_text || 'Membership Categories & Benefits'}
            </Link>
          </div>
        </div>
      </section>

      {/* 9. PARTNER HIGHLIGHTS LOGO STRIP (ANIMATED MARQUEE) */}
      {partners && partners.length > 0 && (
        <section className="py-12 bg-white border-b border-[#e2ebe4] overflow-hidden" aria-label="Collaborating Partners">
          <div className="container mx-auto px-4 mb-6 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5c6f62]">
              {pageContent?.partners_section?.title || 'Our Collaborating Institutions & Partners'}
            </span>
          </div>

          <div className="relative w-full overflow-hidden">
            {/* Left & Right gradient masks for smooth fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

            {/* Scrolling track */}
            <div className="animate-marquee flex items-center gap-8 sm:gap-10 py-2">
              {[...partners, ...partners, ...partners].map((partner, idx) => {
                const logoSrc = partner.logo_url || PARTNER_LOGOS[partner.name] || '/photos/logo.png'
                return (
                  <div
                    key={`${partner.id}-${idx}`}
                    className="flex items-center gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#f6f9f6] border border-[#e2ebe4] font-bold text-sm text-[#3b4d41] hover:text-[#175432] hover:border-[#175432] hover:bg-white transition-all shadow-2xs shrink-0 cursor-default"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-[#e2ebe4] p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logoSrc}
                        alt={`${partner.name} logo`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <span>{partner.name}</span>
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
