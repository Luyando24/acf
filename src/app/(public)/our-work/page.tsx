import Link from 'next/link'
import {
  ArrowRight,
  Scale,
  Users,
  BookOpen,
  GraduationCap,
  Sprout,
  ShieldCheck,
  Layers,
  Calendar,
  Download,
  Award,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import {
  getPageContent,
  OurWorkPageContent,
  DEFAULT_OUR_WORK_PAGE_CONTENT,
} from '@/lib/supabase/pageContent'
import { constructMetadata } from '@/lib/utils/seo'
import { formatDate } from '@/lib/utils/formatters'
import { renderRichText } from '@/lib/content/richText'
import ContentImage from '@/components/ui/ContentImage'

export const metadata = constructMetadata({
  title: "Our Work | Advancing Zambia's Agricultural Agenda",
  description:
    'Explore ACF core advocacy pillars, thematic programmes in policy advocacy, empirical research, and climate resilience, and featured completed projects on a single unified page.',
  pathname: '/our-work',
})

const ICON_MAP: Record<string, any> = {
  Scale,
  Users,
  BookOpen,
  GraduationCap,
  Sprout,
  ShieldCheck,
  Shield: ShieldCheck,
  Layers,
  Award,
}

function resolveIcon(name?: string | null) {
  if (!name) return Scale
  return ICON_MAP[name] || Scale
}

export default async function OurWorkPage() {
  const supabase = await createClient()

  const [pageContent, progRes, pubRes, newsRes] = await Promise.all([
    getPageContent<OurWorkPageContent>('our-work'),
    supabase
      .from('programmes')
      .select('*')
      .eq('status', 'published')
      .order('order_index', { ascending: true }),
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
  ])

  const header = pageContent?.header || DEFAULT_OUR_WORK_PAGE_CONTENT.header
  const pillarsSection =
    pageContent?.pillars_section || DEFAULT_OUR_WORK_PAGE_CONTENT.pillars_section
  const thematicSection =
    pageContent?.thematic_section ||
    DEFAULT_OUR_WORK_PAGE_CONTENT.thematic_section
  const projectsSection =
    pageContent?.projects_section ||
    DEFAULT_OUR_WORK_PAGE_CONTENT.projects_section
  const dossiersSection =
    pageContent?.dossiers_section ||
    DEFAULT_OUR_WORK_PAGE_CONTENT.dossiers_section
  const ctaSection =
    pageContent?.cta_section || DEFAULT_OUR_WORK_PAGE_CONTENT.cta_section

  const corePillars =
    pillarsSection.pillars && pillarsSection.pillars.length > 0
      ? pillarsSection.pillars
      : DEFAULT_OUR_WORK_PAGE_CONTENT.pillars_section.pillars

  const thematicItems =
    thematicSection.items && thematicSection.items.length > 0
      ? thematicSection.items
      : DEFAULT_OUR_WORK_PAGE_CONTENT.thematic_section.items

  const completedProjects =
    projectsSection.projects && projectsSection.projects.length > 0
      ? projectsSection.projects
      : DEFAULT_OUR_WORK_PAGE_CONTENT.projects_section.projects

  const dbProgrammes = (progRes.data || []) as any[]
  const relatedPubs = (pubRes.data || []) as any[]
  const relatedNews = (newsRes.data || []) as any[]

  // Exclude slugs already represented in Core Pillars, Thematic Areas, or Completed Projects
  // so there is no duplication, while still displaying any additional programmes created in Admin > Programmes
  const knownSlugs = new Set<string>([
    'policy-advocacy-reform',
    'multi-stakeholder-dialogue',
    'evidence-based-policy-analysis',
    'capacity-building',
    ...thematicItems.map((i) => i.slug),
    ...completedProjects.map((p) => p.slug),
  ])

  const additionalProgrammes = dbProgrammes.filter(
    (p) => !knownSlugs.has(p.slug)
  )

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* 1. Header Banner */}
      <section className="bg-[#153e28] text-white py-16 lg:py-20 border-b border-[#1e4a32]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white bg-white/15 px-3.5 py-1.5 rounded-full border border-white/20 inline-block">
            {header.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            {header.title}
          </h1>
          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            {header.description}
          </p>
        </div>
      </section>

      {/* In-Page Quick Navigation Bar */}
      <div className="bg-[#f4f8f5] border-b border-[#dbe6de] sticky top-20 z-20 shadow-2xs">
        <div className="container mx-auto px-4 max-w-5xl py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#526658] shrink-0 mr-1">
            Jump to:
          </span>
          <a
            href="#core-pillars"
            className="px-3 py-1.5 rounded-full bg-white hover:bg-[#eef6f1] text-[#122419] hover:text-[#1e7e48] border border-[#dbe6de] text-xs font-bold transition-colors shrink-0"
          >
            {pillarsSection.title}
          </a>
          <a
            href="#thematic-programmes"
            className="px-3 py-1.5 rounded-full bg-white hover:bg-[#eef6f1] text-[#122419] hover:text-[#1e7e48] border border-[#dbe6de] text-xs font-bold transition-colors shrink-0"
          >
            {thematicSection.title}
          </a>
          {thematicItems.map((item) => (
            <a
              key={item.slug}
              href={`#${item.slug}`}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-[#eef6f1] text-[#526658] hover:text-[#1e7e48] border border-[#dbe6de] text-xs font-semibold transition-colors shrink-0"
            >
              {item.title}
            </a>
          ))}
          <a
            href="#completed-projects"
            className="px-3 py-1.5 rounded-full bg-white hover:bg-[#eef6f1] text-[#122419] hover:text-[#1e7e48] border border-[#dbe6de] text-xs font-bold transition-colors shrink-0"
          >
            {projectsSection.title}
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-5xl pt-16 space-y-24">
        {/* 2. Core Advocacy Pillars */}
        <section id="core-pillars" className="scroll-mt-36 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#1e7e48] bg-[#eef6f1] px-3.5 py-1.5 rounded-full border border-[#1e7e48]/20 inline-block">
              {pillarsSection.badge}
            </span>
            <h2 className="text-3xl font-extrabold text-[#122419]">
              {pillarsSection.title}
            </h2>
            <p className="text-[#526658] text-sm">
              {pillarsSection.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {corePillars.map((pillar, idx) => {
              const Icon = resolveIcon(pillar.icon)
              const pillarSlug = pillar.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
              return (
                <div
                  key={pillar.title || idx}
                  id={pillarSlug}
                  className="scroll-mt-36 bg-white rounded-3xl p-7 sm:p-8 border border-[#dbe6de] shadow-xs hover:border-[#1e7e48]/50 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#eef6f1] text-[#1e7e48] group-hover:bg-[#1e7e48] group-hover:text-white transition-colors flex items-center justify-center font-bold">
                        <Icon size={24} />
                      </div>
                      <span className="text-xs font-black text-[#8a9e91] tracking-widest uppercase">
                        Pillar {pillar.num}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#122419] group-hover:text-[#1e7e48] transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-sm text-[#526658] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. Thematic Programmes & Focus Areas (Combined in-depth sections) */}
        <section id="thematic-programmes" className="scroll-mt-36 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#1e7e48] bg-[#eef6f1] px-3.5 py-1.5 rounded-full border border-[#1e7e48]/20 inline-block">
              {thematicSection.badge}
            </span>
            <h2 className="text-3xl font-extrabold text-[#122419]">
              {thematicSection.title}
            </h2>
            <p className="text-[#526658] text-sm">
              {thematicSection.description}
            </p>
          </div>

          <div className="space-y-8">
            {thematicItems.map((item, idx) => {
              const Icon = resolveIcon(item.icon)
              return (
                <article
                  key={item.slug || idx}
                  id={item.slug}
                  className="scroll-mt-36 bg-white rounded-3xl border border-[#dbe6de] shadow-xs overflow-hidden hover:border-[#1e7e48]/40 transition-all"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {item.cover_image && (
                      <div className="lg:col-span-5 relative min-h-[240px] bg-neutral-100 overflow-hidden">
                        <ContentImage
                          src={item.cover_image}
                          alt={item.title}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
                      </div>
                    )}

                    <div
                      className={`${
                        item.cover_image ? 'lg:col-span-7' : 'lg:col-span-12'
                      } p-7 sm:p-10 space-y-4 flex flex-col justify-center`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#eef6f1] text-[#1e7e48] flex items-center justify-center shrink-0">
                          <Icon size={22} />
                        </div>
                        <div>
                          {item.subtitle && (
                            <span className="text-[11px] font-black uppercase tracking-widest text-[#1e7e48] block">
                              {item.subtitle}
                            </span>
                          )}
                          <h3 className="text-2xl font-extrabold text-[#122419]">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base font-semibold text-[#2d3f33] leading-relaxed">
                        {item.summary}
                      </p>

                      {item.body && (
                        <div
                          className="prose-acf text-sm text-[#526658] leading-relaxed space-y-3 pt-2 border-t border-[#f4f8f5]"
                          dangerouslySetInnerHTML={{
                            __html: renderRichText(item.body),
                          }}
                        />
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* 4. Featured Completed Projects */}
        <section
          id="completed-projects"
          className="scroll-mt-36 space-y-8 bg-[#f4f8f5] p-8 sm:p-12 rounded-3xl border border-[#dbe6de]"
        >
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#1e7e48] bg-white px-3.5 py-1.5 rounded-full border border-[#dbe6de] inline-block shadow-2xs">
              {projectsSection.badge}
            </span>
            <h2 className="text-3xl font-extrabold text-[#122419]">
              {projectsSection.title}
            </h2>
            <p className="text-[#526658] text-sm">
              {projectsSection.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {completedProjects.map((proj, idx) => {
              const Icon = resolveIcon(proj.icon)
              return (
                <div
                  key={proj.acronym || idx}
                  id={proj.slug}
                  className="scroll-mt-36 bg-white rounded-2xl p-6 border border-[#dbe6de] shadow-xs hover:border-[#1e7e48]/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#eef6f1] text-[#1e7e48] flex items-center justify-center font-bold">
                      <Icon size={20} />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#1e7e48]">
                        {proj.acronym}
                      </span>
                      <h3 className="font-bold text-[#122419] text-base leading-snug">
                        {proj.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#2d3f33] font-medium leading-relaxed">
                      {proj.description}
                    </p>

                    {proj.details && (
                      <p className="text-xs text-[#526658] leading-relaxed pt-3 border-t border-[#f4f8f5]">
                        {proj.details}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 5. Additional Published Programme Dossiers from CMS */}
        {additionalProgrammes.length > 0 && (
          <section id="active-dossiers" className="scroll-mt-36 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#dbe6de] pb-4">
              <div>
                <h2 className="text-2xl font-bold text-[#122419]">
                  {dossiersSection.title}
                </h2>
                <p className="text-xs text-[#526658] mt-1">
                  {dossiersSection.description}
                </p>
              </div>
              <span className="text-xs font-bold text-[#1e7e48] bg-[#eef6f1] px-3 py-1 rounded-full border border-[#dbe6de]">
                {additionalProgrammes.length} Active Dossiers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {additionalProgrammes.map((prog) => {
                const Icon = resolveIcon(prog.icon)
                return (
                  <div
                    key={prog.slug}
                    id={prog.slug}
                    className="scroll-mt-36 bg-white rounded-2xl p-6 border border-[#dbe6de] shadow-xs hover:border-[#1e7e48]/40 transition-all space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#eef6f1] text-[#1e7e48] flex items-center justify-center shrink-0">
                        <Icon size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-[#122419]">
                        {prog.title}
                      </h3>
                    </div>
                    <p className="text-xs font-semibold text-[#2d3f33] leading-relaxed">
                      {prog.summary}
                    </p>
                    {prog.body && prog.body !== `<p>${prog.summary}</p>` && (
                      <div
                        className="prose-acf text-xs text-[#526658] leading-relaxed pt-2 border-t border-[#f4f8f5]"
                        dangerouslySetInnerHTML={{
                          __html: renderRichText(prog.body),
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* 6. Related Policy Briefs & Sector News */}
        {(relatedPubs.length > 0 || relatedNews.length > 0) && (
          <section
            id="publications-news"
            className="scroll-mt-36 grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Related Publications */}
            {relatedPubs.length > 0 && (
              <div className="bg-white rounded-3xl border border-[#dbe6de] p-7 sm:p-8 shadow-xs space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#dbe6de] pb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen size={20} className="text-[#1e7e48]" />
                      <h3 className="font-extrabold text-[#122419] text-lg">
                        Related Policy Briefs &amp; Research
                      </h3>
                    </div>
                    <Link
                      href="/publications"
                      className="text-xs font-bold text-[#1e7e48] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Knowledge Hub</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>

                  <div className="divide-y divide-[#f4f8f5]">
                    {relatedPubs.map((pub) => (
                      <div key={pub.slug} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center justify-between text-[11px] text-[#526658] mb-1">
                          <span className="font-bold text-[#1e7e48] uppercase tracking-wider">
                            {pub.publication_categories?.name || 'Publication'}
                          </span>
                          <span>{formatDate(pub.published_on)}</span>
                        </div>
                        <Link
                          href={`/publications/${pub.slug}`}
                          className="text-sm font-bold text-[#122419] hover:text-[#1e7e48] transition-colors line-clamp-2"
                        >
                          {pub.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#f4f8f5]">
                  <Link
                    href="/publications"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e7e48] hover:underline"
                  >
                    <Download size={13} />
                    <span>Browse All Publications &amp; Briefs</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Related News */}
            {relatedNews.length > 0 && (
              <div className="bg-white rounded-3xl border border-[#dbe6de] p-7 sm:p-8 shadow-xs space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#dbe6de] pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={20} className="text-[#1e7e48]" />
                      <h3 className="font-extrabold text-[#122419] text-lg">
                        Recent Sector News &amp; Dialogues
                      </h3>
                    </div>
                    <Link
                      href="/news"
                      className="text-xs font-bold text-[#1e7e48] hover:underline inline-flex items-center gap-1"
                    >
                      <span>All News</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>

                  <div className="divide-y divide-[#f4f8f5]">
                    {relatedNews.map((news) => (
                      <div key={news.slug} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center justify-between text-[11px] text-[#526658] mb-1">
                          <span className="font-bold text-[#1e7e48] uppercase tracking-wider">
                            {news.category || 'Sector Update'}
                          </span>
                          <span>{formatDate(news.published_at)}</span>
                        </div>
                        <Link
                          href={`/news/${news.slug}`}
                          className="text-sm font-bold text-[#122419] hover:text-[#1e7e48] transition-colors line-clamp-2"
                        >
                          {news.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#f4f8f5]">
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e7e48] hover:underline"
                  >
                    <span>View Upcoming Policy Dialogues</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            )}
          </section>
        )}

        {/* 7. Stakeholder Engagement Call-to-Action Banner */}
        <section className="p-8 sm:p-12 rounded-3xl bg-[#153e28] text-white border border-[#1e4a32] flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#a3e6be] bg-white/10 px-3 py-1 rounded-full border border-white/15 inline-block">
              {ctaSection.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {ctaSection.title}
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              {ctaSection.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href={ctaSection.primary_btn_url || '/membership/apply'}
              className="px-6 py-3.5 bg-[#2e9e5b] hover:bg-[#258249] text-white text-xs sm:text-sm font-extrabold rounded-full transition-colors whitespace-nowrap shadow-md"
            >
              {ctaSection.primary_btn_text}
            </Link>
            <Link
              href={ctaSection.secondary_btn_url || '/publications'}
              className="px-6 py-3.5 border border-white/30 hover:bg-white/10 text-white text-xs sm:text-sm font-bold rounded-full transition-colors whitespace-nowrap"
            >
              {ctaSection.secondary_btn_text}
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
