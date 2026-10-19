import Link from 'next/link'
import { Briefcase, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/formatters'
import { constructMetadata } from '@/lib/utils/seo'

export const metadata = constructMetadata({
  title: 'Opportunities Archive | Closed Vacancies & Expired Tenders',
  description:
    'Archived listings of concluded jobs, consultancies, and procurement calls at the Agricultural Consultative Forum.',
  pathname: '/opportunities/archive',
})

export default async function OpportunitiesArchivePage() {
  const supabase = await createClient()

  const todayLusaka = new Date().toISOString().split('T')[0]

  const { data: oppData } = await supabase
    .from('opportunities')
    .select('*')
    .lt('closes_on', todayLusaka)
    .order('closes_on', { ascending: false })

  const archived = (oppData || []) as any[]

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#0f1d14] text-white py-16 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl space-y-4">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Active Opportunities</span>
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Opportunities Archive
          </h1>
          <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl">
            Historical repository of closed vacancies, concluded consultancies, and past tenders. Applications are no longer accepted for these positions.
          </p>
        </div>
      </section>

      {/* Archive Listings */}
      <div className="container mx-auto px-4 max-w-5xl pt-12 space-y-4">
        {archived.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#e2ebe4] p-8 space-y-3">
            <Briefcase size={36} className="mx-auto text-[#5c6f62]" />
            <h2 className="text-lg font-bold text-[#0f1d14]">No archived opportunities</h2>
            <p className="text-xs text-[#5c6f62]">Concluded vacancies and past tenders will be archived here.</p>
          </div>
        ) : (
          archived.map((opp) => (
            <div
              key={opp.slug}
              className="bg-white rounded-2xl border border-[#e2ebe4] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-75 hover:opacity-100 transition-opacity"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#5c6f62]">
                  <span className="px-2 py-0.5 rounded bg-gray-100 font-semibold text-gray-700">
                    {opp.type}
                  </span>
                  <span>•</span>
                  <span>Closed on {formatDate(opp.closes_on)}</span>
                </div>
                <h3 className="text-base font-bold text-[#0f1d14]">
                  <Link href={`/opportunities/${opp.slug}`} className="hover:text-[#175432]">
                    {opp.title}
                  </Link>
                </h3>
                <p className="text-xs text-[#5c6f62] line-clamp-1">{opp.description}</p>
              </div>

              <Link
                href={`/opportunities/${opp.slug}`}
                className="px-4 py-2 border border-[#e2ebe4] hover:border-[#175432] text-xs font-bold text-[#0f1d14] rounded-lg transition-colors shrink-0"
              >
                View Notice
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
