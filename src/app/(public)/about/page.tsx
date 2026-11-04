import Link from 'next/link'
import {
  Target,
  Eye,
  History,
  Shield,
  Users,
  ArrowRight,
  Scale,
  Lightbulb,
  FileCheck2,
  Award,
  BarChart3,
  Building2,
  Download,
  Briefcase,
  Layers,
  FileSpreadsheet,
} from 'lucide-react'
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
  const coreValues = content?.core_values || DEFAULT_ABOUT_PAGE_CONTENT.core_values
  const history = content?.history || DEFAULT_ABOUT_PAGE_CONTENT.history
  const objectives = content?.objectives || DEFAULT_ABOUT_PAGE_CONTENT.objectives
  const governance = content?.governance_cta || DEFAULT_ABOUT_PAGE_CONTENT.governance_cta
  const departments = content?.departments || DEFAULT_ABOUT_PAGE_CONTENT.departments || [
    { title: 'Stakeholder Engagements', description: 'Mobilizing farmer groups, private sector networks, and cooperating partners across Zambia.' },
    { title: 'Policy Research & Studies', description: 'Conducting empirical data gathering, legislative reviews, and policy impact assessments.' },
    { title: 'Finance & Administration', description: 'Ensuring transparent governance, operational stewardship, and program accountability.' },
  ]
  const strategicPlan = content?.strategic_plan || DEFAULT_ABOUT_PAGE_CONTENT.strategic_plan || {
    title: 'Strategic Plan 2026 - 2031',
    button_text: 'Download 5-Year Strategic Plan Blueprint (PDF)',
    file_url: '/documents/acf-strategic-plan-2026-2031.pdf',
  }

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#153e28] text-white py-16 lg:py-20 border-b border-[#1f5638]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white bg-white/15 px-3.5 py-1.5 rounded-full border border-white/20 inline-block">
            {header.badge || 'Who We Are'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            {header.title || 'Who We Are'}
          </h1>
          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            {header.description}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-5xl pt-16 space-y-16">
        {/* Vision & Mission Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#dbe6de] shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#eef6f1] text-[#1e7e48] flex items-center justify-center mb-6">
                <Eye size={24} />
              </div>
              <h2 className="text-2xl font-bold text-[#122419] mb-4">{vision.title}</h2>
              <p className="text-[#2d3f33] text-base leading-relaxed">
                {vision.description}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f4f8f5] flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1e7e48]">
              <span>Advisory Excellence</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#dbe6de] shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#eef6f1] text-[#1e7e48] flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h2 className="text-2xl font-bold text-[#122419] mb-4">{mission.title}</h2>
              <p className="text-[#2d3f33] text-base leading-relaxed">
                {mission.description}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f4f8f5] flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1e7e48]">
              <span>Multi-Stakeholder Consensus</span>
            </div>
          </div>
        </section>

        {/* Governance & Structure */}
        <section className="bg-white p-8 sm:p-10 rounded-3xl border border-[#dbe6de] shadow-xs space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#1e7e48] bg-[#eef6f1] px-3.5 py-1.5 rounded-full border border-[#1e7e48]/20 inline-block mb-2">
                Structure
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#122419]">
                Governance &amp; Structure
              </h2>
              <p className="text-[#526658] text-sm mt-1 max-w-xl">
                Led by representative value-chain governance and managed by a dedicated professional Secretariat.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/about/board"
                className="px-5 py-2.5 bg-white border border-[#dbe6de] hover:border-[#1e7e48] text-xs font-bold text-[#122419] rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
              >
                <span>Board of Directors</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/about/secretariat"
                className="px-5 py-2.5 bg-[#1e7e48] hover:bg-[#166538] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
              >
                <span>Secretariat</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {departments.map((dept, idx) => {
              const icons = [Users, Briefcase, FileSpreadsheet]
              const Icon = icons[idx % icons.length]
              return (
                <div
                  key={dept.title}
                  className="bg-[#fcfdfc] p-6 rounded-2xl border border-[#dbe6de] shadow-2xs space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#eef6f1] text-[#1e7e48] flex items-center justify-center font-bold">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-[#122419] text-base">
                    {dept.title}
                  </h3>
                  <p className="text-xs text-[#526658] leading-relaxed">
                    {dept.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Strategic Plan 2026 - 2031 Blueprint Download */}
        <section className="bg-gradient-to-br from-[#153e28] to-[#1e5c3a] text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-[#256c45] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#a3e6be] bg-white/10 px-3 py-1 rounded-full border border-white/15 inline-block">
              Institutional Roadmap
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {strategicPlan.title}
            </h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Our 5-Year Blueprint establishes priority agendas for agricultural dialogue, CATSP &amp; 8NDP alignment, smallholder resilience, and private sector partnerships.
            </p>
          </div>

          <div className="shrink-0">
            <a
              href={strategicPlan.file_url}
              download
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white text-[#153e28] hover:bg-[#eef6f1] font-extrabold text-sm rounded-full shadow-md transition-all hover:scale-105"
            >
              <Download size={16} className="text-[#1e7e48]" />
              <span>{strategicPlan.button_text}</span>
            </a>
          </div>
        </section>

        {/* Core Values & Guiding Principles */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1e7e48] bg-[#eef6f1] px-3.5 py-1.5 rounded-full border border-[#1e7e48]/20 inline-block">
              {coreValues?.badge || 'Guiding Principles'}
            </span>
            <h2 className="text-3xl font-extrabold text-[#122419]">
              {coreValues?.title || 'Our Core Values & Guiding Principles'}
            </h2>
            <p className="text-[#526658] text-sm">
              {coreValues?.description ||
                "The fundamental institutional values that anchor ACF's policy consultations, research neutrality, and multi-stakeholder advocacy across Zambia."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(coreValues?.items || DEFAULT_ABOUT_PAGE_CONTENT.core_values?.items || []).map((val, idx) => {
              const icons = [Scale, Lightbulb, FileCheck2, Users, Award, BarChart3, Building2]
              const Icon = icons[idx % icons.length]
              const isLast = idx === 6
              return (
                <div
                  key={val.letter || idx}
                  className={`bg-white p-6 sm:p-7 rounded-2xl border border-[#dbe6de] shadow-xs hover:border-[#1e7e48]/40 hover:shadow-sm transition-all space-y-3 flex flex-col justify-between ${
                    isLast ? 'md:col-span-2 lg:col-span-3 bg-gradient-to-br from-white via-white to-[#f4f8f5]' : ''
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#eef6f1] text-[#1e7e48] flex items-center justify-center font-bold text-sm">
                        <Icon size={20} />
                      </div>
                      <span className="w-7 h-7 rounded-full bg-[#f4f8f5] border border-[#dbe6de] text-[#1e7e48] text-xs font-black flex items-center justify-center uppercase">
                        {val.letter}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#122419] text-base leading-snug">
                      {val.title}
                    </h3>

                    {val.description && (
                      <p className="text-xs text-[#526658] leading-relaxed">
                        {val.description}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {(objectives.items && objectives.items.length > 0
              ? objectives.items
              : DEFAULT_ABOUT_PAGE_CONTENT.objectives.items
            ).slice(0, 3).map((obj, idx) => {
              const isCenteredBottom = idx === 2
              return (
                <div
                  key={obj.num}
                  className={`bg-white p-6 sm:p-7 rounded-2xl border border-[#dbe6de] shadow-xs flex items-start gap-4 transition-all hover:border-[#1e7e48]/40 hover:shadow-sm ${
                    isCenteredBottom
                      ? 'md:col-span-2 md:col-start-2'
                      : 'md:col-span-2'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#1e7e48] text-white flex items-center justify-center font-black text-sm shrink-0 border border-[#2e9e5b]/30">
                    {obj.num}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#122419] text-base mb-1.5">{obj.title}</h3>
                    <p className="text-xs text-[#526658] leading-relaxed">{obj.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
