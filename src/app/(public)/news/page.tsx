import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/formatters'
import { constructMetadata } from '@/lib/utils/seo'
import ContentImage from '@/components/ui/ContentImage'

export const metadata = constructMetadata({
  title: 'News & Updates | Sector Developments & Press Releases',
  description:
    'Read the latest news, consultative forum updates, and agricultural sector analysis from the Agricultural Consultative Forum (ACF) in Lusaka.',
  pathname: '/news',
})

export default async function NewsPage() {
  const supabase = await createClient()

  const { data: newsData } = await supabase
    .from('news_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const articles = (newsData || []) as any[]

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#0f1d14] text-white py-16 lg:py-20 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#a3e635] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 inline-block">
            ACF Media & Communications
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            News & Sector Updates
          </h1>
          <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Official announcements, policy submissions, consultative dialogues, and agricultural developments from ACF and partners.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-5xl pt-16">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((item) => {
              const itemData = item as any
              const articleImg = itemData.image_url || itemData.featured_image || '/photos/fosta-stakeholders-dialogue.jpg'
              return (
                <article
                  key={item.slug}
                  className="bg-white rounded-3xl border border-[#e2ebe4] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Article Feature Image */}
                    <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
                      <ContentImage
                        src={articleImg}
                        alt={item.title}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#175432] font-bold text-xs shadow-xs">
                          {item.category || 'Sector News'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-[#5c6f62] mb-3">
                        <Calendar size={13} className="text-[#175432]" />
                        <span>{formatDate(item.published_at)}</span>
                      </div>

                      <h2 className="text-lg font-bold text-[#0f1d14] group-hover:text-[#175432] transition-colors leading-snug mb-3 line-clamp-2">
                        <Link href={`/news/${item.slug}`}>{item.title}</Link>
                      </h2>

                      <p className="text-xs text-[#5c6f62] leading-relaxed line-clamp-3">
                        {item.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex justify-end">
                    <Link
                      href={`/news/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#175432] group-hover:text-[#2da44e]"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e2ebe4] p-8 max-w-md mx-auto">
            <p className="text-base font-semibold text-[#0f1d14]">No news articles currently published</p>
            <p className="text-xs text-[#5c6f62] mt-1">Articles published via the admin portal will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
