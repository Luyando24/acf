import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Calendar, FileText, Scale, ArrowRight, Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/formatters'
import { constructMetadata } from '@/lib/utils/seo'
import { renderRichText } from '@/lib/content/richText'

interface ProgrammePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProgrammePageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: prog } = await supabase
    .from('programmes')
    .select('title, summary')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  const progItem = prog as any
  if (!progItem) {
    return constructMetadata({ title: 'Programme Detail' })
  }

  return constructMetadata({
    title: `${progItem.title} | Our Work`,
    description: progItem.summary,
    pathname: `/our-work/${slug}`,
  })
}

export default async function ProgrammeDetailPage({ params }: ProgrammePageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: progData } = await supabase
    .from('programmes')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!progData) {
    notFound()
  }

  const prog = progData as any

  // Fetch related publications
  const { data: relatedPubsData } = await supabase
    .from('publications')
    .select('*, publication_categories(name)')
    .eq('status', 'published')
    .limit(3)
  const relatedPubs = (relatedPubsData || []) as any[]

  // Fetch related news
  const { data: relatedNewsData } = await supabase
    .from('news_posts')
    .select('*')
    .eq('status', 'published')
    .limit(2)
  const relatedNews = (relatedNewsData || []) as any[]

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#0f1d14] text-white py-16 lg:py-20 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl space-y-4">
          <Link
            href="/our-work"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Programmes</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {prog.title}
          </h1>

          <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed max-w-2xl">
            {prog.summary}
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-5xl pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Body */}
          <div className="lg:col-span-8 space-y-12">
            <div
              className="prose-acf text-base sm:text-lg leading-relaxed text-[#3b4d41] space-y-6"
              dangerouslySetInnerHTML={{ __html: renderRichText(prog.body || prog.summary || '') }}
            />

            {/* Contextual CTA */}
            <div className="p-8 rounded-3xl bg-[#f0f6f1] border border-[#d2e3d6] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-[#0f1d14]">Engage on this Programme</h3>
                <p className="text-xs text-[#5c6f62] mt-1 max-w-md">
                  Participate in our multi-stakeholder consultations or access research briefs on this thematic area.
                </p>
              </div>
              <Link
                href="/membership/apply"
                className="px-6 py-3 bg-[#175432] hover:bg-[#114227] text-white text-xs font-bold rounded-full transition-colors whitespace-nowrap shadow-md shadow-[#175432]/20"
              >
                Join Working Group
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Related Publications */}
            {relatedPubs.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#e2ebe4] p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#e2ebe4] pb-3">
                  <BookOpen size={18} className="text-[#175432]" />
                  <h3 className="font-bold text-[#0f1d14] text-sm">Related Policy Briefs</h3>
                </div>

                <div className="space-y-3">
                  {relatedPubs.map((pub) => (
                    <div key={pub.slug} className="group">
                      <span className="text-[10px] font-bold text-[#175432] uppercase tracking-wider block mb-0.5">
                        {pub.publication_categories?.name || 'Publication'}
                      </span>
                      <Link
                        href={`/publications/${pub.slug}`}
                        className="text-xs font-bold text-[#0f1d14] group-hover:text-[#175432] transition-colors line-clamp-2"
                      >
                        {pub.title}
                      </Link>
                      <span className="text-[10px] text-[#5c6f62] block mt-1">
                        {formatDate(pub.published_on)}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/publications"
                  className="pt-2 text-xs font-bold text-[#175432] hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore Publications Hub</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}

            {/* Related News */}
            {relatedNews.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#e2ebe4] p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#e2ebe4] pb-3">
                  <Calendar size={18} className="text-[#175432]" />
                  <h3 className="font-bold text-[#0f1d14] text-sm">Sector News & Updates</h3>
                </div>

                <div className="space-y-3">
                  {relatedNews.map((news) => (
                    <div key={news.slug} className="group">
                      <span className="text-[10px] font-bold text-[#175432] uppercase tracking-wider block mb-0.5">
                        {news.category || 'News'}
                      </span>
                      <Link
                        href={`/news/${news.slug}`}
                        className="text-xs font-bold text-[#0f1d14] group-hover:text-[#175432] transition-colors line-clamp-2"
                      >
                        {news.title}
                      </Link>
                      <span className="text-[10px] text-[#5c6f62] block mt-1">
                        {formatDate(news.published_at)}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/news"
                  className="pt-2 text-xs font-bold text-[#175432] hover:underline inline-flex items-center gap-1"
                >
                  <span>View All News</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
