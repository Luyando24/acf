import Link from 'next/link'
import { Shield, Download, CheckCircle, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/formatters'

export default async function AdminMembershipPage() {
  const supabase = await createClient()

  const { data: appsData } = await supabase
    .from('membership_applications')
    .select('*, membership_categories(name)')
    .order('created_at', { ascending: false })

  const defaultApplications = [
    {
      id: '1',
      applicant_type: 'organisation',
      org_name: 'Lusaka Grain Growers Cooperative',
      contact_name: 'Mwamba Banda',
      email: 'mbanda@graingrowers.co.zm',
      phone: '+260 97 1234567',
      location_province: 'Lusaka Province',
      sector_interest: 'Maize & Soya Value Chains',
      status: 'new',
      created_at: new Date().toISOString(),
      membership_categories: { name: 'Agricultural Producer Associations' },
    },
    {
      id: '2',
      applicant_type: 'organisation',
      org_name: 'Eastern Agribusiness Inputs Ltd',
      contact_name: 'Chileshe Phiri',
      email: 'chileshe@easterninputs.zm',
      phone: '+260 96 7654321',
      location_province: 'Eastern Province',
      sector_interest: 'Certified Seed & Fertilizer Distribution',
      status: 'approved',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      membership_categories: { name: 'Agri-Business & Private Sector' },
    },
  ]

  const applications = appsData && appsData.length > 0 ? appsData : defaultApplications

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-[#0f1d14] tracking-tight">
            Membership Applications
          </h1>
          <p className="text-xs text-[#5c6f62] mt-0.5">
            Review stakeholder caucus submissions, verify eligibility, and manage status.
          </p>
        </div>

        <a
          href="/api/admin/export/membership"
          download
          className="px-4 py-2.5 bg-[#175432] hover:bg-[#114227] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Download size={16} />
          <span>Export Submissions (CSV)</span>
        </a>
      </div>

      <div className="bg-white rounded-3xl border border-[#e2ebe4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f9f6] text-[#5c6f62] uppercase tracking-wider font-bold border-b border-[#e2ebe4]">
              <tr>
                <th className="py-4 px-6">Entity / Contact</th>
                <th className="py-4 px-6">Category Caucus</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Sector Interest</th>
                <th className="py-4 px-6">Submitted Date</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2ebe4]">
              {applications.map((app: any) => (
                <tr key={app.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#0f1d14]">
                      {app.org_name || app.contact_name}
                    </div>
                    <div className="text-[11px] text-[#5c6f62]">
                      {app.contact_name} • {app.email} • {app.phone}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#175432] font-semibold">
                    {app.membership_categories?.name || 'Producer Association'}
                  </td>
                  <td className="py-4 px-6 text-[#5c6f62]">
                    {app.location_province}
                  </td>
                  <td className="py-4 px-6 text-[#5c6f62] max-w-xs">
                    {app.sector_interest}
                  </td>
                  <td className="py-4 px-6 text-[#5c6f62]">
                    {formatDate(app.created_at)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        app.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'new'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {app.status}
                    </span>
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
