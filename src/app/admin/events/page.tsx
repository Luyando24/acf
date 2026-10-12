import Link from 'next/link'
import { Plus, Calendar, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDateTime } from '@/lib/utils/formatters'

export default async function AdminEventsPage() {
  const supabase = await createClient()

  const { data: eventsData } = await supabase
    .from('events')
    .select('*')
    .order('starts_at', { ascending: false })

  const defaultEvents = [
    {
      id: '55555555-5555-5555-5555-555555555501',
      slug: 'annual-agricultural-policy-symposium-2026',
      title: 'Annual Zambia Agricultural Policy Symposium 2026',
      starts_at: '2026-11-18T06:30:00Z',
      venue: 'Mulungushi International Conference Centre, Lusaka',
      status: 'published',
    },
    {
      id: '55555555-5555-5555-5555-555555555502',
      slug: 'workshop-land-tenure-governance-2026',
      title: 'Multi-Stakeholder Workshop on Customary Land Tenure',
      starts_at: '2026-10-28T07:00:00Z',
      venue: 'Golden Peacock Hotel, Lusaka',
      status: 'published',
    },
  ]

  const events = eventsData && eventsData.length > 0 ? eventsData : defaultEvents

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-[#0f1d14] tracking-tight">
            Dialogue Events & Forums
          </h1>
          <p className="text-xs text-[#5c6f62] mt-0.5">
            Schedule policy roundtables, technical workshops, and national symposiums.
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2.5 bg-[#175432] hover:bg-[#114227] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Schedule New Event</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#e2ebe4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f9f6] text-[#5c6f62] uppercase tracking-wider font-bold border-b border-[#e2ebe4]">
              <tr>
                <th className="py-4 px-6">Event Title</th>
                <th className="py-4 px-6">Date & Time</th>
                <th className="py-4 px-6">Venue</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2ebe4]">
              {events.map((evt: any) => (
                <tr key={evt.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#0f1d14] max-w-md">
                    {evt.title}
                  </td>
                  <td className="py-4 px-6 text-[#175432] font-semibold">
                    {formatDateTime(evt.starts_at)}
                  </td>
                  <td className="py-4 px-6 text-[#5c6f62]">
                    {evt.venue}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f0f6f1] text-[#175432] uppercase">
                      {evt.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <Link
                      href={`/events/${evt.slug}`}
                      target="_blank"
                      className="text-xs font-bold text-[#175432] hover:underline"
                    >
                      View Live
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
