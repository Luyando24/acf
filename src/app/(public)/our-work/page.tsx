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
  CheckCircle2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { constructMetadata } from '@/lib/utils/seo'

export const metadata = constructMetadata({
  title: "Our Work | Advancing Zambia's Agricultural Agenda",
  description:
    "The distinctive competence of the Forum lies in our absolute neutrality, high-level convening power, and trusted relationships across the entire agricultural landscape in Zambia.",
  pathname: '/our-work',
})

export default async function OurWorkPage() {
  const supabase = await createClient()
  const { data: progData } = await supabase
    .from('programmes')
    .select('*')
    .eq('status', 'published')
    .order('order_index', { ascending: true })

  const programmes = (progData || []) as any[]

  const corePillars = [
    {
      num: '01',
      title: 'Policy Advocacy and Reform',
      description:
        'We identify policy bottlenecks, analyze legislative impacts, and advocate for regulatory reforms that improve the agricultural business environment.',
      icon: Scale,
      href: '/our-work/policy-advocacy-reform',
    },
    {
      num: '02',
      title: 'Multi-Stakeholder Dialogue',
      description:
        'We convene national and regional forums, workshops, and roundtables to build consensus on critical agricultural issues.',
      icon: Users,
      href: '/events',
    },
    {
      num: '03',
      title: 'Evidence-Based Policy Analysis',
      description:
        'We generate data-driven insights and policy briefs to guide government decision-making and private sector investments.',
      icon: BookOpen,
      href: '/publications',
    },
    {
      num: '04',
      title: 'Capacity Building',
      description:
        'We strengthen the analytical and advocacy capacities of farmer organizations, civil society groups, and local value-chain actors.',
      icon: GraduationCap,
      href: '/our-work/capacity-building',
    },
  ]

  const completedProjects = [
    {
      acronym: 'GCRF AFRICAP',
      title: 'Agricultural and Food-system Resilience: Increasing Capacity and Advisories',
      description:
        'Conducted comprehensive climate modeling, policy stress-testing, and scenario planning for resilient Zambian agricultural livelihoods.',
      icon: ShieldCheck,
      slug: 'gcrf-africap',
    },
    {
      acronym: 'CliMBER',
      title: 'Building Systemic Resilience against Climate Variability',
      description:
        'Supported smallholder adaptation pathways, hydro-meteorological early-warning advisories, and climate-smart agronomic interventions.',
      icon: Sprout,
      slug: 'climber',
    },
    {
      acronym: 'FoSTA',
      title: 'Food Systems Transformation in Africa',
      description:
        'Convened multi-stakeholder health, nutrition, and agricultural policy dialogues to transform national food supply chains.',
      icon: Layers,
      slug: 'fosta',
    },
  ]

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#153e28] text-white py-16 lg:py-20 border-b border-[#1e4a32]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white bg-white/15 px-3.5 py-1.5 rounded-full border border-white/20 inline-block">
            Our Mandate &amp; Practice
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Advancing Zambia&apos;s Agricultural Agenda
          </h1>
          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            The distinctive competence of the Forum lies in our absolute neutrality, high-level convening power, and trusted relationships across the entire agricultural landscape. Unlike individual interest groups, we do not lobby for a single agenda; instead, we build national consensus. Our unique ability to bring agricultural stakeholders (private sector, public sector, agribusiness farmer representatives, private public sector partnerships) and international donors ensures that the policies we influence are both practical on the ground and viable at the macroeconomic level.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-5xl pt-16 space-y-20">
        {/* Core Advocacy Pillars */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#1e7e48] bg-[#eef6f1] px-3.5 py-1.5 rounded-full border border-[#1e7e48]/20 inline-block">
              Core Pillars
            </span>
            <h2 className="text-3xl font-extrabold text-[#122419]">
              Core Advocacy Pillars
            </h2>
            <p className="text-[#526658] text-sm">
              The four strategic anchors steering all ACF consultations, policy submissions, and stakeholder mobilisation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {corePillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="bg-white rounded-3xl p-7 sm:p-8 border border-[#dbe6de] shadow-xs hover:border-[#1e7e48]/50 hover:shadow-md transition-all flex flex-col justify-between group"
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

                  <div className="pt-6 mt-6 border-t border-[#f4f8f5]">
                    <Link
                      href={pillar.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e7e48] group-hover:text-[#166538]"
                    >
                      <span>Explore Pillar</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Featured Completed Projects */}
        <section className="space-y-8 bg-[#f4f8f5] p-8 sm:p-12 rounded-3xl border border-[#dbe6de]">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#1e7e48] bg-white px-3.5 py-1.5 rounded-full border border-[#dbe6de] inline-block shadow-2xs">
              Project Archive
            </span>
            <h2 className="text-3xl font-extrabold text-[#122419]">
              Featured Completed Projects
            </h2>
            <p className="text-[#526658] text-sm">
              Major collaborative research initiatives and multi-country frameworks facilitated by the Agricultural Consultative Forum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {completedProjects.map((proj) => {
              const Icon = proj.icon
              return (
                <div
                  key={proj.acronym}
                  className="bg-white rounded-2xl p-6 border border-[#dbe6de] shadow-xs hover:border-[#1e7e48]/40 hover:shadow-md transition-all flex flex-col justify-between group"
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

                    <p className="text-xs text-[#526658] leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#f4f8f5]">
                    <Link
                      href={`/our-work/${proj.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1e7e48] group-hover:text-[#166538]"
                    >
                      <span>Read Documentation</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* All Published Programmes from CMS */}
        {programmes.length > 0 && (
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#dbe6de] pb-4">
              <div>
                <h2 className="text-2xl font-bold text-[#122419]">
                  All Thematic Work Areas &amp; Initiatives
                </h2>
                <p className="text-xs text-[#526658] mt-1">
                  Active policy dossiers and ongoing consultation working groups.
                </p>
              </div>
              <span className="text-xs font-bold text-[#1e7e48] bg-[#eef6f1] px-3 py-1 rounded-full border border-[#dbe6de]">
                {programmes.length} Active Dossiers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programmes.map((prog) => (
                <div
                  key={prog.slug}
                  className="bg-white rounded-2xl p-6 border border-[#dbe6de] shadow-xs hover:border-[#1e7e48]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-bold text-[#122419] mb-2 hover:text-[#1e7e48] transition-colors">
                      <Link href={`/our-work/${prog.slug}`}>{prog.title}</Link>
                    </h3>
                    <p className="text-xs text-[#526658] leading-relaxed line-clamp-3">
                      {prog.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#f4f8f5] flex justify-end">
                    <Link
                      href={`/our-work/${prog.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1e7e48] hover:underline"
                    >
                      <span>View Dossier</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
