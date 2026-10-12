import Link from 'next/link'
import { Plus, FileText, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/formatters'

export default async function AdminNewsPage() {
  const supabase = await createClient()

  const { data: newsData } = await supabase
    .from('news_posts')
    .select('*')
    .order('published_at', { ascending: false })

  const defaultNews = [
    {
      id: '44444444-4444-4444-4444-444444444401',
      slug: 'national-consultative-dialogue-food-security-2026',
      title: 'ACF Convenes National Stakeholder Dialogue on Sustainable Food Security',
      category: 'Policy Dialogue',
      published_at: '2026-03-01T07:00:00Z',
      status: 'published',
    },
    {
      id: '44444444-4444-4444-4444-444444444402',
      slug: 'evidence-based-review-fisp-reforms',
      title: 'Stakeholder Submission on Agricultural Input Programme Modernisation',
      category: 'Sector News',
      published_at: '2026-02-18T08:30:00Z',
      status: 'published',
    },
  ]

  const articles = newsData && newsData.length > 0 ? newsData : defaultNews

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-[#0f1d14] tracking-tight">
            News & Press Releases
          </h1>
          <p className="text-xs text-[#5c6f62] mt-0.5">
            Publish institutional press releases, sector updates, and policy dialogues.
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2.5 bg-[#175432] hover:bg-[#114227] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Write New Article</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#e2ebe4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f9f6] text-[#5c6f62] uppercase tracking-wider font-bold border-b border-[#e2ebe4]">
              <tr>
                <th className="py-4 px-6">Article Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Published Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2ebe4]">
              {articles.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#0f1d14] max-w-md">
                    {item.title}
                  </td>
                  <td className="py-4 px-6 text-[#175432] font-semibold">
                    {item.category || 'Sector News'}
                  </td>
                  <td className="py-4 px-6 text-[#5c6f62]">
                    {formatDate(item.published_at)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f0f6f1] text-[#175432] uppercase">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <Link
                      href={`/news/${item.slug}`}
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
