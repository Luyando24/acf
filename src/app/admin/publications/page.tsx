import Link from 'next/link'
import { BookOpen, Download, Plus, FileText, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatFileSize } from '@/lib/utils/formatters'

export default async function AdminPublicationsPage() {
  const supabase = await createClient()

  const { data: pubData } = await supabase
    .from('publications')
    .select('*, publication_categories(name)')
    .order('published_on', { ascending: false })

  const defaultPubs = [
    {
      id: '33333333-3333-3333-3333-333333333301',
      slug: 'zambia-agricultural-policy-brief-2026',
      title: 'Zambia Agricultural Sector Policy Review 2025/2026',
      summary: 'An evidence-based assessment of agricultural performance, input support programmes, and market policies in Zambia.',
      published_on: '2026-02-15',
      file_size: 2450000,
      download_count: 142,
      status: 'published',
      publication_categories: { name: 'Policy Briefs' },
    },
    {
      id: '33333333-3333-3333-3333-333333333302',
      slug: 'smallholder-drought-resilience-study',
      title: 'Building Climate Resilience Among Smallholder Maize Farmers',
      summary: 'Empirical study on drought mitigation strategies, crop diversification, and irrigation adoption in Southern and Eastern Provinces.',
      published_on: '2026-01-20',
      file_size: 3820000,
      download_count: 98,
      status: 'published',
      publication_categories: { name: 'Research Reports' },
    },
    {
      id: '33333333-3333-3333-3333-333333333303',
      slug: 'customary-land-rights-brief-women',
      title: 'Securing Customary Land Rights for Women Farmers in Zambia',
      summary: 'Policy advisory note detailing practical legal mechanisms to strengthen women smallholders land tenure security.',
      published_on: '2025-11-10',
      file_size: 1850000,
      download_count: 76,
      status: 'published',
      publication_categories: { name: 'Policy Advisory Notes' },
    },
  ]

  const publications = pubData && pubData.length > 0 ? pubData : defaultPubs

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-[#0f1d14] tracking-tight">
            Publications & Knowledge Repository
          </h1>
          <p className="text-xs text-[#5c6f62] mt-0.5">
            Manage research reports, policy briefs, newsletters, and track downloads.
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2.5 bg-[#175432] hover:bg-[#114227] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Upload Publication</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#e2ebe4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f9f6] text-[#5c6f62] uppercase tracking-wider font-bold border-b border-[#e2ebe4]">
              <tr>
                <th className="py-4 px-6">Document Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Size</th>
                <th className="py-4 px-6">Downloads</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2ebe4]">
              {publications.map((pub: any) => (
                <tr key={pub.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#0f1d14] max-w-xs">
                    {pub.title}
                  </td>
                  <td className="py-4 px-6 text-[#175432] font-semibold">
                    {pub.publication_categories?.name || 'Policy Brief'}
                  </td>
                  <td className="py-4 px-6 text-[#5c6f62]">
                    {formatDate(pub.published_on)}
                  </td>
                  <td className="py-4 px-6 text-[#5c6f62]">
                    {formatFileSize(pub.file_size)}
                  </td>
                  <td className="py-4 px-6 font-bold text-[#0f1d14]">
                    {pub.download_count || 0}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f0f6f1] text-[#175432] uppercase">
                      {pub.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <Link
                      href={`/publications/${pub.slug}`}
                      target="_blank"
                      className="text-xs font-bold text-[#175432] hover:underline"
                    >
                      Preview
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
