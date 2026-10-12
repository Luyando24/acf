import Link from 'next/link'
import { Briefcase, ArrowLeft, Clock, Archive } from 'lucide-react'
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

  const defaultArchive = [
    {
      id: '66666666-6666-6666-6666-666666666603',
      slug: 'consultancy-monitoring-evaluation-officer-expired',
      title: 'Monitoring & Evaluation Specialist',
      type: 'Job',
      description:
        'Full-time position to coordinate institutional monitoring and evaluation frameworks across all ACF dialogue programmes.',
      opens_on: '2026-01-01',
      closes_on: '2026-02-15',
    },
    {
      id: '66666666-6666-6666-6666-666666666604',
      slug: 'tender-it-network-infrastructure-2025',
      title: 'Tender: Secretariat IT & Server Infrastructure Upgrade',
      type: 'Tender',
      description:
        'Supply and installation of network equipment, secure firewall, and cloud backup setup for ACF Secretariat in Lusaka.',
      opens_on: '2025-10-01',
      closes_on: '2025-11-15',
    },
  ]

  const archived = oppData && oppData.length > 0 ? oppData : defaultArchive

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0f1d14] via-[#142d1f] to-[#175432] text-white py-16 border-b border-[#1b3424]">
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

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-5xl pt-12">
        <div className="space-y-4">
          {archived.map((opp) => (
            <div
              key={opp.slug}
              className="bg-white rounded-2xl border border-[#e2ebe4] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-85"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-700">
                    {opp.type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                    Closed on {formatDate(opp.closes_on)}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#0f1d14]">
                  <Link href={`/opportunities/${opp.slug}`} className="hover:text-[#175432]">
                    {opp.title}
                  </Link>
                </h2>
                <p className="text-xs text-[#5c6f62] line-clamp-1">{opp.description}</p>
              </div>

              <Link
                href={`/opportunities/${opp.slug}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#0f1d14] rounded-lg text-xs font-bold shrink-0 transition-colors"
              >
                View Notice
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
