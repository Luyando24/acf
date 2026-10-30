import Link from 'next/link'
import { CheckCircle2, Target, Eye, History, Shield, Users, ArrowRight } from 'lucide-react'
import { constructMetadata } from '@/lib/utils/seo'
import { getPageContent, AboutPageContent, DEFAULT_ABOUT_PAGE_CONTENT } from '@/lib/supabase/pageContent'
import ContentImage from '@/components/ui/ContentImage'

export const metadata = constructMetadata({
  title: 'About Us | Mandate, History, Vision & Mission',
  description:
    'Learn about the Agricultural Consultative Forum (ACF), its historical evolution, vision, mission, and multi-stakeholder governance structure in Zambia.',
  pathname: '/about',
})

export default async function AboutPage() {
  const content = await getPageContent<AboutPageContent>('about')

  const header = content?.header || DEFAULT_ABOUT_PAGE_CONTENT.header
  const vision = content?.vision || DEFAULT_ABOUT_PAGE_CONTENT.vision
  const mission = content?.mission || DEFAULT_ABOUT_PAGE_CONTENT.mission
  const history = content?.history || DEFAULT_ABOUT_PAGE_CONTENT.history
  const objectives = content?.objectives || DEFAULT_ABOUT_PAGE_CONTENT.objectives
  const governance = content?.governance_cta || DEFAULT_ABOUT_PAGE_CONTENT.governance_cta

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#153e28] text-white py-16 lg:py-20 border-b border-[#1f5638]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white bg-white/15 px-3.5 py-1.5 rounded-full border border-white/20 inline-block">
            {header.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            {header.title}
          </h1>
          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {header.description}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-5xl pt-16 space-y-16">
        {/* Vision & Mission Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#dbe6de] shadow-xs relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-[#eef6f1] text-[#1e7e48] flex items-center justify-center mb-6">
              <Eye size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[#122419] mb-4">{vision.title}</h2>
            <p className="text-[#2d3f33] text-base leading-relaxed">
              {vision.description}
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#dbe6de] shadow-xs relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-[#eef6f1] text-[#1e7e48] flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[#122419] mb-4">{mission.title}</h2>
            <p className="text-[#2d3f33] text-base leading-relaxed">
              {mission.description}
            </p>
          </div>
        </section>

        {/* History & Background with Featured Photo */}
        <section className="bg-white p-8 sm:p-12 rounded-3xl border border-[#dbe6de] shadow-xs space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#eef6f1] text-[#1e7e48]">
              <History size={22} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#122419]">
              {history.title}
            </h2>
          </div>

          {/* Featured Picture */}
          <div className="relative rounded-2xl overflow-hidden border border-[#dbe6de] shadow-md group">
            <div className="aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-neutral-900">
              <ContentImage
                src={history.image_url || '/photos/fosta-stakeholders-dialogue.jpg'}
                alt={history.image_alt || 'ACF Stakeholders Policy Dialogue in Lusaka'}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
              <span className="text-xs font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-xs px-3 py-1 rounded-md inline-block w-fit mb-2 border border-white/20">
                {history.banner_badge}
              </span>
              <p className="text-white text-sm sm:text-base font-semibold max-w-2xl leading-relaxed drop-shadow-sm">
                {history.banner_text}
              </p>
            </div>
          </div>

          <div className="prose-acf text-base sm:text-lg leading-relaxed text-[#2d3f33] space-y-4">
            {history.paragraphs && history.paragraphs.length > 0 ? (
              history.paragraphs.map((para, index) => (
                <p key={index}>{para}</p>
              ))
            ) : (
              DEFAULT_ABOUT_PAGE_CONTENT.history.paragraphs.map((para, index) => (
                <p key={index}>{para}</p>
              ))
            )}
          </div>
        </section>

        {/* Strategic Objectives */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-[#122419]">{objectives.title}</h2>
            <p className="text-[#526658] text-sm mt-2">
              {objectives.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(objectives.items && objectives.items.length > 0
              ? objectives.items
              : DEFAULT_ABOUT_PAGE_CONTENT.objectives.items
            ).map((obj) => (
              <div
                key={obj.num}
                className="bg-white p-6 rounded-2xl border border-[#dbe6de] shadow-xs flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1e7e48] text-white flex items-center justify-center font-black text-sm shrink-0 border border-[#2e9e5b]/30">
                  {obj.num}
                </div>
                <div>
                  <h3 className="font-bold text-[#122419] text-base mb-1.5">{obj.title}</h3>
                  <p className="text-xs text-[#526658] leading-relaxed">{obj.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Governance Navigation Strip */}
        <section className="p-8 rounded-3xl bg-[#f4f8f5] border border-[#dbe6de] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-[#122419]">{governance.title}</h3>
            <p className="text-xs text-[#526658] mt-1">
              {governance.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/about/board"
              className="px-5 py-2.5 bg-white border border-[#dbe6de] hover:border-[#1e7e48] text-xs font-bold text-[#122419] rounded-full transition-colors"
            >
              Board of Directors
            </Link>
            <Link
              href="/about/management"
              className="px-5 py-2.5 bg-white border border-[#dbe6de] hover:border-[#1e7e48] text-xs font-bold text-[#122419] rounded-full transition-colors"
            >
              Management Team
            </Link>
            <Link
              href="/about/staff"
              className="px-5 py-2.5 bg-[#1e7e48] hover:bg-[#166538] text-white text-xs font-bold rounded-full transition-colors"
            >
              Staff Profiles
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
