import Link from 'next/link'
import { ArrowRight, BookOpen, Scale, Sprout, Users, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { constructMetadata } from '@/lib/utils/seo'

export const metadata = constructMetadata({
  title: 'Our Work | Programmes & Thematic Areas',
  description:
    'Explore the core thematic programmes of the Agricultural Consultative Forum: agricultural policy advocacy, research & evidence, dialogue platforms, and climate resilience in Zambia.',
  pathname: '/our-work',
})

export default async function OurWorkPage() {
  const supabase = await createClient()
  const { data: progData } = await supabase
    .from('programmes')
    .select('*')
    .eq('status', 'published')
    .order('order_index', { ascending: true })

  const programmes =
    progData && progData.length > 0
      ? progData
      : [
          {
            id: '1',
            slug: 'policy-advocacy',
            title: 'Agricultural Policy Advocacy',
            summary:
              'Mobilising multi-stakeholder consultations and evidence to influence national agricultural policy formulation and implementation in Zambia.',
          },
          {
            id: '2',
            slug: 'research-and-evidence',
            title: 'Research & Evidence Generation',
            summary:
              'Generating credible empirical data, analytical briefs, and sector performance reviews to guide agricultural investments.',
          },
          {
            id: '3',
            slug: 'multi-stakeholder-dialogue',
            title: 'Multi-Stakeholder Dialogue',
            summary:
              'Providing a neutral, inclusive convening platform where government, agribusiness, donors, and smallholder farmer groups collaborate.',
          },
          {
            id: '4',
            slug: 'climate-resilience',
            title: 'Climate Resilience & Sustainable Systems',
            summary:
              'Advocating for climate-smart agriculture, soil health conservation, and resilient rural farming systems in Zambia.',
          },
          {
            id: '5',
            slug: 'land-rights-tenure',
            title: "Land Tenure & Women's Rights",
            summary:
              'Advocating for secure customary land tenure and equal rights for women and small-scale farming households.',
          },
        ]

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0f1d14] via-[#142d1f] to-[#175432] text-white py-16 lg:py-20 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#a3e635] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 inline-block">
            Thematic Areas
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Our Programmes & Work
          </h1>
          <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Addressing critical priorities across policy formulation, smallholder productivity, grain marketing, climate resilience, and customary land rights.
          </p>
        </div>
      </section>

      {/* Programmes Grid */}
      <div className="container mx-auto px-4 max-w-5xl pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programmes.map((prog, index) => (
            <div
              key={prog.slug}
              className="bg-white rounded-3xl p-8 border border-[#e2ebe4] shadow-xs hover:shadow-xl hover:border-[#2da44e]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#f0f6f1] text-[#175432] group-hover:bg-[#175432] group-hover:text-[#a3e635] transition-colors flex items-center justify-center mb-6">
                  <Scale size={28} />
                </div>
                <h2 className="text-2xl font-bold text-[#0f1d14] group-hover:text-[#175432] transition-colors mb-3">
                  {prog.title}
                </h2>
                <p className="text-sm text-[#5c6f62] leading-relaxed">
                  {prog.summary}
                </p>
              </div>

              <div className="pt-8 mt-6 border-t border-[#e2ebe4]/70 flex items-center justify-between">
                <span className="text-xs font-bold text-[#5c6f62] uppercase tracking-wider">
                  Thematic Focus {index + 1}
                </span>
                <Link
                  href={`/our-work/${prog.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#175432] group-hover:text-[#2da44e]"
                >
                  <span>Explore Programme</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
