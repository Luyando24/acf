import Link from 'next/link'
import { Briefcase, Clock, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/formatters'
import { constructMetadata } from '@/lib/utils/seo'

export const metadata = constructMetadata({
  title: 'Opportunities & Tenders | Jobs, Consultancies & Procurement',
  description:
    'Current job vacancies, consultancies, tenders, and calls for proposals at the Agricultural Consultative Forum (ACF) in Lusaka, Zambia.',
  pathname: '/opportunities',
})

interface OpportunitiesPageProps {
  searchParams: Promise<{ type?: string }>
}

export default async function OpportunitiesPage({ searchParams }: OpportunitiesPageProps) {
  const { type } = await searchParams
  const supabase = await createClient()

  // Query ACTIVE opportunities: closes_on >= CURRENT_DATE in Africa/Lusaka
  const todayLusaka = new Date().toISOString().split('T')[0]

  let query = supabase
    .from('opportunities')
    .select('*')
    .eq('status', 'published')
    .gte('closes_on', todayLusaka)
    .order('closes_on', { ascending: true })

  if (type) {
    query = query.eq('type', type as any)
  }

  const { data: oppData } = await query
  const activeOpportunities = (oppData || []) as any[]

  const types = ['All', 'Job', 'Consultancy', 'Tender', 'Procurement', 'Call for Proposals']

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#153e28] text-white py-16 lg:py-20 border-b border-[#1e4a32]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white bg-white/15 px-3.5 py-1.5 rounded-full border border-white/20 inline-block">
            ACF Network & Procurement
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Opportunities & Tenders
          </h1>
          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Current job vacancies, consultancy expressions of interest, procurement notices, and calls for proposals.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-5xl pt-12">
        {/* Navigation / Filter Strip */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b border-[#dbe6de]">
          <div className="flex flex-wrap items-center gap-2">
            {types.map((t) => {
              const isSelected = (!type && t === 'All') || type === t
              const href = t === 'All' ? '/opportunities' : `/opportunities?type=${encodeURIComponent(t)}`
              return (
                <Link
                  key={t}
                  href={href}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-[#1e7e48] text-white shadow-xs'
                      : 'bg-white border border-[#dbe6de] text-[#526658] hover:border-[#1e7e48] hover:text-[#1e7e48]'
                  }`}
                >
                  {t}
                </Link>
              )
            })}
          </div>

          <Link
            href="/opportunities/archive"
            className="text-xs font-bold text-[#1e7e48] hover:underline shrink-0"
          >
            Browse Concluded Archive &rarr;
          </Link>
        </div>

        {/* Opportunities List */}
        <div className="pt-8 space-y-6">
          {activeOpportunities.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#dbe6de] p-8 space-y-3">
              <Briefcase size={40} className="mx-auto text-[#526658]" />
              <h2 className="text-xl font-bold text-[#122419]">No active opportunities</h2>
              <p className="text-sm text-[#526658] max-w-md mx-auto">
                There are currently no active opportunities in this category. Check back soon or browse past items in the archive.
              </p>
              <Link
                href="/opportunities/archive"
                className="inline-block mt-2 px-5 py-2 text-xs font-bold bg-[#1e7e48] text-white rounded-full hover:bg-[#166538]"
              >
                View Archive
              </Link>
            </div>
          ) : (
            activeOpportunities.map((opp) => (
              <div
                key={opp.slug}
                className="bg-white rounded-3xl border border-[#dbe6de] p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
              >
                <div className="space-y-2 flex-grow">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#526658]">
                    <span className="px-3 py-1 rounded-md bg-[#eef6f1] text-[#1e7e48] font-bold">
                      {opp.type}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#1e7e48] font-semibold">
                      <Clock size={13} className="text-[#1e7e48]" />
                      Closes on {formatDate(opp.closes_on)}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#122419] group-hover:text-[#1e7e48] transition-colors leading-snug">
                    <Link href={`/opportunities/${opp.slug}`}>{opp.title}</Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-[#526658] leading-relaxed max-w-2xl line-clamp-2">
                    {opp.description}
                  </p>
                </div>

                <div className="shrink-0 w-full md:w-auto pt-2 md:pt-0">
                  <Link
                    href={`/opportunities/${opp.slug}`}
                    className="w-full md:w-auto px-5 py-3 rounded-xl bg-[#1e7e48] hover:bg-[#166538] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <span>View Details & Apply</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
