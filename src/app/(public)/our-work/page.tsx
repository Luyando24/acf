import Link from 'next/link'
import { ArrowRight, Scale } from 'lucide-react'
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

  const programmes = (progData || []) as any[]

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#153e28] text-white py-16 lg:py-20 border-b border-[#1e4a32]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white bg-white/15 px-3.5 py-1.5 rounded-full border border-white/20 inline-block">
            Thematic Areas
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Our Programmes & Work
          </h1>
          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Addressing critical priorities across policy formulation, smallholder productivity, grain marketing, climate resilience, and customary land rights.
          </p>
        </div>
      </section>

      {/* Programmes Grid */}
      <div className="container mx-auto px-4 max-w-5xl pt-16">
        {programmes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programmes.map((prog, index) => (
              <div
                key={prog.slug}
                className="bg-white rounded-3xl p-8 border border-[#dbe6de] shadow-xs hover:shadow-xl hover:border-[#1e7e48]/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#eef6f1] text-[#1e7e48] group-hover:bg-[#1e7e48] group-hover:text-white transition-colors flex items-center justify-center mb-6">
                    <Scale size={28} />
                  </div>
                  <h2 className="text-2xl font-bold text-[#122419] group-hover:text-[#1e7e48] transition-colors mb-3">
                    {prog.title}
                  </h2>
                  <p className="text-sm text-[#526658] leading-relaxed">
                    {prog.summary}
                  </p>
                </div>

                <div className="pt-8 mt-6 border-t border-[#dbe6de] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#526658] uppercase tracking-wider">
                    Thematic Focus {index + 1}
                  </span>
                  <Link
                    href={`/our-work/${prog.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1e7e48] group-hover:text-[#166538]"
                  >
                    <span>Explore Programme</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#dbe6de] p-8 max-w-md mx-auto">
            <p className="text-base font-semibold text-[#122419]">No programmes currently listed</p>
            <p className="text-xs text-[#526658] mt-1">Published programmes will appear here once configured in the CMS.</p>
          </div>
        )}
      </div>
    </div>
  )
}
