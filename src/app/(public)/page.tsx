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
import { getSiteSettings, getSiteStats } from '@/lib/supabase/settings'
import { formatDate } from '@/lib/utils/formatters'

export default async function HomePage() {
  const supabase = await createClient()
  const [settings, stats] = await Promise.all([
    getSiteSettings(),
    getSiteStats(),
  ])

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

  // Graceful fallbacks for local dev before database migrations are executed in remote DB
  const programmes = programmesRes.data && programmesRes.data.length > 0 ? programmesRes.data : [
    {
      id: '1',
      slug: 'policy-advocacy',
      title: 'Agricultural Policy Advocacy',
      summary: 'Mobilising multi-stakeholder consultations and evidence to influence national agricultural policy formulation and implementation in Zambia.',
      icon: 'Scale',
    },
    {
      id: '2',
      slug: 'research-and-evidence',
      title: 'Research & Evidence Generation',
      summary: 'Generating credible empirical data, analytical briefs, and sector performance reviews to guide agricultural investments.',
      icon: 'BookOpen',
    },
    {
      id: '3',
      slug: 'multi-stakeholder-dialogue',
      title: 'Multi-Stakeholder Dialogue',
      summary: 'Providing a neutral, inclusive convening platform where government, agribusiness, donors, and smallholder farmer groups collaborate.',
      icon: 'Users',
    },
    {
      id: '4',
      slug: 'climate-resilience',
      title: 'Climate Resilience & Sustainable Systems',
      summary: 'Advocating for climate-smart agriculture, soil health conservation, and resilient rural farming systems in Zambia.',
      icon: 'Sprout',
    },
  ]

  const publications = publicationsRes.data && publicationsRes.data.length > 0 ? publicationsRes.data : [
    {
      id: '1',
      slug: 'zambia-agricultural-policy-brief-2026',
      title: 'Zambia Agricultural Sector Policy Review 2025/2026',
      summary: 'An evidence-based assessment of agricultural performance, input support programmes, and market policies in Zambia.',
      published_on: '2026-02-15',
      publication_categories: { name: 'Policy Briefs' },
      download_count: 142,
    },
    {
      id: '2',
      slug: 'smallholder-drought-resilience-study',
      title: 'Building Climate Resilience Among Smallholder Maize Farmers',
      summary: 'Empirical study on drought mitigation strategies, crop diversification, and irrigation adoption in Southern and Eastern Provinces.',
      published_on: '2026-01-20',
      publication_categories: { name: 'Research Reports' },
      download_count: 98,
    },
    {
      id: '3',
      slug: 'customary-land-rights-brief-women',
      title: 'Securing Customary Land Rights for Women Farmers in Zambia',
      summary: 'Policy advisory note detailing practical legal mechanisms to strengthen women smallholders land tenure security.',
      published_on: '2025-11-10',
      publication_categories: { name: 'Policy Advisory Notes' },
      download_count: 76,
    },
  ]

  const newsList = newsRes.data && newsRes.data.length > 0 ? newsRes.data : [
    {
      id: '1',
      slug: 'national-consultative-dialogue-food-security-2026',
      title: 'ACF Convenes National Stakeholder Dialogue on Sustainable Food Security',
      excerpt: 'Key stakeholders from government, farmer federations, and agribusiness gathered in Lusaka to review post-drought recovery mechanisms.',
      category: 'Policy Dialogue',
      published_at: '2026-03-01T07:00:00Z',
    },
    {
      id: '2',
      slug: 'evidence-based-review-fisp-reforms',
      title: 'Stakeholder Submission on Agricultural Input Programme Modernisation',
      excerpt: 'ACF presents its comprehensive policy review on input distribution efficiency and transparent electronic vouchers.',
      category: 'Sector News',
      published_at: '2026-02-18T08:30:00Z',
    },
  ]

  const upcomingEvents = eventsRes.data && eventsRes.data.length > 0 ? eventsRes.data : [
    {
      id: '1',
      slug: 'annual-agricultural-policy-symposium-2026',
      title: 'Annual Zambia Agricultural Policy Symposium 2026',
      description: 'A two-day national symposium gathering policymakers, agricultural economists, and farmer leaders.',
      starts_at: '2026-11-18T06:30:00Z',
      venue: 'Mulungushi International Conference Centre, Lusaka',
    },
    {
      id: '2',
      slug: 'workshop-land-tenure-governance-2026',
      title: 'Multi-Stakeholder Workshop on Customary Land Tenure',
      description: 'Deliberations on equitable land allocation and tenure documentation guidelines.',
      starts_at: '2026-10-28T07:00:00Z',
      venue: 'Golden Peacock Hotel, Lusaka',
    },
  ]

  const partners = partnersRes.data && partnersRes.data.length > 0 ? partnersRes.data : [
    { id: '1', name: 'Ministry of Agriculture' },
    { id: '2', name: 'Zambia National Farmers Union (ZNFU)' },
    { id: '3', name: 'Indaba Agricultural Policy Research Institute (IAPRI)' },
    { id: '4', name: 'International Land Coalition (ILC)' },
    { id: '5', name: 'Grain Traders Association of Zambia' },
  ]

  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#0f1d14] text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#2da44e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#175432]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Evidence-Based Dialogue for Zambia&apos;s Agricultural Transformation
            </h1>

            <p className="text-lg sm:text-xl text-emerald-100/80 leading-relaxed font-normal">
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
                About The Forum
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f1d14] tracking-tight">
                A Credible, Neutral Platform for Agricultural Policy Reform
              </h2>

              <p className="text-[#3b4d41] text-base sm:text-lg leading-relaxed">
                Established in Lusaka, the Agricultural Consultative Forum (ACF) bridges key players across Zambia&apos;s agricultural sector. We bring together public ministries, agricultural enterprises, academic research bodies, and grassroots farmer groups to address pressing policy bottlenecks.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-[#e2ebe4] shadow-xs">
                  <h3 className="font-bold text-[#0f1d14] text-base mb-1 flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#2da44e]" />
                    Evidence-Based Decisions
                  </h3>
                  <p className="text-xs text-[#5c6f62] leading-relaxed">
                    Empirical performance data to guide timely agricultural policy actions.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#e2ebe4] shadow-xs">
                  <h3 className="font-bold text-[#0f1d14] text-base mb-1 flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#2da44e]" />
                    Inclusive Tenure Rights
                  </h3>
                  <p className="text-xs text-[#5c6f62] leading-relaxed">
                    Advocating for secure customary land tenure and equal rights for women.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  href="/about"
                  className="px-6 py-3 bg-[#175432] hover:bg-[#114227] text-white font-bold text-sm rounded-full transition-colors flex items-center gap-2 shadow-md"
                >
                  <span>Learn More About ACF</span>
                  <ChevronRight size={16} />
                </Link>
                <Link
                  href="/about/management"
                  className="px-6 py-3 border border-[#175432] text-[#175432] hover:bg-[#f0f6f1] font-bold text-sm rounded-full transition-colors"
                >
                  Leadership & Team
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl bg-[#175432] p-8 text-white shadow-2xl border border-[#2da44e]/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
                <h3 className="text-2xl font-bold mb-4 text-[#a3e635]">ACF Strategic Objectives</h3>
                <ul className="space-y-4 text-sm text-emerald-100/90 leading-relaxed">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#2da44e] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </div>
                    <span>
                      <strong>Stakeholder Mobilisation:</strong> Engage actors at national and provincial levels for agricultural policy advocacy.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#2da44e] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </div>
                    <span>
                      <strong>Credible Evidence Generation:</strong> Deliver empirical assessments on agricultural budgets, inputs, and food markets.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#2da44e] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </div>
                    <span>
                      <strong>Knowledge Management:</strong> Maintain a trusted central repository of Zambian agricultural research and publications.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#2da44e] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      4
                    </div>
                    <span>
                      <strong>Tenure & Gender Equity:</strong> Strengthen small-scale farming systems and ensure equal land rights for women farmers.
                    </span>
                  </li>
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
                Our Work
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f1d14] tracking-tight mt-2">
                Core Thematic Programmes
              </h2>
              <p className="text-[#5c6f62] text-sm sm:text-base mt-1 max-w-xl">
                Dedicated programmes addressing systemic challenges in agricultural productivity, trade policy, and environmental sustainability.
              </p>
            </div>

            <Link
              href="/our-work"
              className="text-[#175432] font-bold text-sm hover:underline flex items-center gap-1.5 shrink-0"
            >
              <span>View All Programmes</span>
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

      {/* 5. FEATURED PUBLICATIONS REPOSITORY */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#175432] bg-[#f0f6f1] px-3 py-1 rounded-md">
                Knowledge Hub
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f1d14] tracking-tight mt-2">
                Recent Publications & Policy Briefs
              </h2>
              <p className="text-[#5c6f62] text-sm sm:text-base mt-1 max-w-xl">
                Independent policy briefs, analytical research reports, and technical guides authored or published by ACF.
              </p>
            </div>

            <Link
              href="/publications"
              className="text-[#175432] font-bold text-sm hover:underline flex items-center gap-1.5 shrink-0"
            >
              <span>Browse All Publications</span>
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

      {/* 6. NEWS & EVENTS SPLIT SECTION */}
      <section className="py-20 bg-[#f6f9f6] border-t border-[#e2ebe4]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* News Updates (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#175432]">
                    Updates
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1d14]">
                    Sector News & Articles
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
                    Dialogues
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1d14]">
                    Upcoming Events
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
                {upcomingEvents.map((evt) => (
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MEMBERSHIP CALL TO ACTION */}
      <section className="py-20 bg-[#175432] text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#a3e635] bg-white/10 px-3 py-1 rounded-full border border-white/15">
            Stakeholder Engagement
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Join the Agricultural Consultative Forum
          </h2>
          <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed">
            Whether you represent a smallholder farmer cooperative, an agricultural enterprise, or a research institution, membership gives you a voice in national policy dialogue roundtables.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/membership/apply"
              className="px-8 py-3.5 bg-[#2da44e] hover:bg-[#34a853] text-[#0a140e] font-extrabold rounded-full transition-all shadow-xl shadow-[#2da44e]/20"
            >
              Apply for Membership
            </Link>
            <Link
              href="/membership"
              className="px-7 py-3.5 border border-white/20 hover:bg-white/10 text-white font-bold rounded-full transition-all"
            >
              Membership Categories & Benefits
            </Link>
          </div>
        </div>
      </section>

      {/* 8. PARTNER HIGHLIGHTS LOGO STRIP */}
      {partners && partners.length > 0 && (
        <section className="py-12 bg-white border-b border-[#e2ebe4]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5c6f62]">
                Our Collaborating Institutions & Partners
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-80">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="font-bold text-sm text-[#3b4d41] hover:text-[#175432] transition-colors"
                >
                  {partner.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
