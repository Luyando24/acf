import Link from 'next/link'
import { Plus, Briefcase, Clock, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate, isOpportunityClosed } from '@/lib/utils/formatters'

export default async function AdminOpportunitiesPage() {
  const supabase = await createClient()

  const { data: oppData } = await supabase
    .from('opportunities')
    .select('*')
    .order('closes_on', { ascending: false })

  const defaultOpps = [
    {
      id: '66666666-6666-6666-6666-666666666601',
      slug: 'consultancy-agricultural-policy-analyst',
      title: 'Senior Agricultural Policy Consultant',
      type: 'Consultancy',
      opens_on: '2026-03-01',
      closes_on: '2026-11-30',
      status: 'published',
    },
    {
      id: '66666666-6666-6666-6666-666666666602',
      slug: 'tender-annual-audit-services-2026',
      title: 'Expression of Interest: External Audit Services',
      type: 'Tender',
      opens_on: '2026-03-05',
      closes_on: '2026-11-15',
      status: 'published',
    },
    {
      id: '66666666-6666-6666-6666-666666666603',
      slug: 'consultancy-monitoring-evaluation-officer-expired',
      title: 'Monitoring & Evaluation Specialist',
      type: 'Job',
      opens_on: '2026-01-01',
      closes_on: '2026-02-15',
      status: 'published',
    },
  ]

  const opportunities = oppData && oppData.length > 0 ? oppData : defaultOpps

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-[#0f1d14] tracking-tight">
            Opportunities, Jobs & Tenders
          </h1>
          <p className="text-xs text-[#5c6f62] mt-0.5">
            Manage vacancies and procurement notices. Past notices auto-archive automatically.
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2.5 bg-[#175432] hover:bg-[#114227] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Post New Opportunity</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#e2ebe4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f9f6] text-[#5c6f62] uppercase tracking-wider font-bold border-b border-[#e2ebe4]">
              <tr>
                <th className="py-4 px-6">Notice Title</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Opening Date</th>
                <th className="py-4 px-6">Closing Deadline</th>
                <th className="py-4 px-6">Archive Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2ebe4]">
              {opportunities.map((opp: any) => {
                const closed = isOpportunityClosed(opp.closes_on)
                return (
                  <tr key={opp.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#0f1d14] max-w-md">
                      {opp.title}
                    </td>
                    <td className="py-4 px-6 text-[#175432] font-semibold">
                      {opp.type}
                    </td>
                    <td className="py-4 px-6 text-[#5c6f62]">
                      {formatDate(opp.opens_on)}
                    </td>
                    <td className="py-4 px-6 text-[#5c6f62] font-medium">
                      {formatDate(opp.closes_on)}
                    </td>
                    <td className="py-4 px-6">
                      {closed ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                          Archived (Closed)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f0f6f1] text-[#175432] uppercase">
                          Active Notice
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        href={`/opportunities/${opp.slug}`}
                        target="_blank"
                        className="text-xs font-bold text-[#175432] hover:underline"
                      >
                        View Notice
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
