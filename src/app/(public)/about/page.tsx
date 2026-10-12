import Link from 'next/link'
import { CheckCircle2, Target, Eye, History, Shield, Users, ArrowRight } from 'lucide-react'
import { constructMetadata } from '@/lib/utils/seo'

export const metadata = constructMetadata({
  title: 'About Us | Mandate, History, Vision & Mission',
  description:
    'Learn about the Agricultural Consultative Forum (ACF), its historical evolution, vision, mission, and multi-stakeholder governance structure in Zambia.',
  pathname: '/about',
})

export default function AboutPage() {
  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0f1d14] via-[#142d1f] to-[#175432] text-white py-16 lg:py-20 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#a3e635] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 inline-block">
            Institutional Mandate
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            About the Agricultural Consultative Forum
          </h1>
          <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            A trusted multi-stakeholder platform fostering collaborative dialogue, evidence-based policy formulation, and sustainable agricultural progress in Zambia.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-5xl pt-16 space-y-16">
        {/* Vision & Mission Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#e2ebe4] shadow-xs relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-[#f0f6f1] text-[#175432] flex items-center justify-center mb-6">
              <Eye size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[#0f1d14] mb-4">Our Vision</h2>
            <p className="text-[#3b4d41] text-base leading-relaxed">
              A viable, equitable, and climate-resilient agricultural sector in Zambia where smallholder farmers, agribusinesses, and rural communities flourish through transparent, evidence-based policy frameworks.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#e2ebe4] shadow-xs relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-[#f0f6f1] text-[#175432] flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[#0f1d14] mb-4">Our Mission</h2>
            <p className="text-[#3b4d41] text-base leading-relaxed">
              To contribute to a responsive agricultural sector through evidence-based policy analysis, knowledge management, multi-stakeholder dialogue, and strategic advocacy for sustainable agricultural development.
            </p>
          </div>
        </section>

        {/* History & Background */}
        <section className="bg-white p-8 sm:p-12 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#f0f6f1] text-[#175432]">
              <History size={22} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1d14]">
              Background & History
            </h2>
          </div>

          <div className="prose-acf text-base sm:text-lg leading-relaxed text-[#3b4d41] space-y-4">
            <p>
              The Agricultural Consultative Forum (ACF) was created out of a recognised need for a neutral, inclusive, and evidence-driven forum where all stakeholders in Zambia&apos;s agricultural sector could converge to discuss policy hurdles and build national consensus.
            </p>
            <p>
              For decades, agricultural policy debates in Zambia were often fragmented across isolated public consultations, commercial farming demands, and donor programmes. ACF bridged this divide by institutionalising structured dialogues between the Ministry of Agriculture, research institutes, farmer federations, and agro-enterprises.
            </p>
            <p>
              Today, ACF serves as a premier knowledge and advocacy hub, actively participating in parliamentary submissions, national agricultural investment plans, and grassroots smallholder empowerment programmes across Zambia.
            </p>
          </div>
        </section>

        {/* Strategic Objectives */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-[#0f1d14]">Key Strategic Objectives</h2>
            <p className="text-[#5c6f62] text-sm mt-2">
              ACF operates under four core pillars established to serve Zambia&apos;s agricultural constituents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                num: '01',
                title: 'Multi-Stakeholder Mobilisation & Advocacy',
                desc: 'Mobilising stakeholders across all provinces for policy dialogue, review of legislation, and formulation of inclusive agricultural investment plans.',
              },
              {
                num: '02',
                title: 'Empirical Research & Credible Evidence',
                desc: 'Generating unbiased analytical studies, performance assessments of input subsidies, and commodity trade reviews to back timely policy decisions.',
              },
              {
                num: '03',
                title: 'Sector Knowledge Hub & Dissemination',
                desc: 'Providing an open repository of publications, policy briefs, and advisory notes accessible to farmers, students, researchers, and government leaders.',
              },
              {
                num: '04',
                title: 'Tenure Security & Gender Equality',
                desc: 'Advocating for secure customary land rights, transparent land allocation, and equitable economic empowerment for women and youth farmers.',
              },
            ].map((obj) => (
              <div
                key={obj.num}
                className="bg-white p-6 rounded-2xl border border-[#e2ebe4] shadow-xs flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0f1d14] text-[#a3e635] flex items-center justify-center font-black text-sm shrink-0 border border-[#2da44e]/30">
                  {obj.num}
                </div>
                <div>
                  <h3 className="font-bold text-[#0f1d14] text-base mb-1.5">{obj.title}</h3>
                  <p className="text-xs text-[#5c6f62] leading-relaxed">{obj.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Governance Navigation Strip */}
        <section className="p-8 rounded-3xl bg-[#f6f9f6] border border-[#e2ebe4] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-[#0f1d14]">Explore ACF Governance & People</h3>
            <p className="text-xs text-[#5c6f62] mt-1">
              Meet our Board of Directors, Management Team, and dedicated Secretariat Staff.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/about/board"
              className="px-5 py-2.5 bg-white border border-[#e2ebe4] hover:border-[#175432] text-xs font-bold text-[#0f1d14] rounded-full transition-colors"
            >
              Board of Directors
            </Link>
            <Link
              href="/about/management"
              className="px-5 py-2.5 bg-white border border-[#e2ebe4] hover:border-[#175432] text-xs font-bold text-[#0f1d14] rounded-full transition-colors"
            >
              Management Team
            </Link>
            <Link
              href="/about/staff"
              className="px-5 py-2.5 bg-[#175432] hover:bg-[#114227] text-white text-xs font-bold rounded-full transition-colors"
            >
              Staff Profiles
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
