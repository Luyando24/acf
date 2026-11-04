import Link from 'next/link'
import { Calendar, ArrowRight, Mail, Shield, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/formatters'
import { constructMetadata } from '@/lib/utils/seo'
import ContentImage from '@/components/ui/ContentImage'
import { FacebookIcon } from '@/components/ui/SocialIcons'

export const metadata = constructMetadata({
  title: 'News & Updates | Media & Sector Updates',
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

  const rawArticles = (newsData || []) as any[]

  const fallbackArticles = [
    {
      slug: 'q3-performance-metrics-released-acf',
      title: 'Q3 Performance Metrics Released by Agricultural Consultative Forum',
      category: 'Sector News',
      published_at: '2026-11-01T10:00:00Z',
      featured_image: '/photos/agricultural-budget-analysis.jpg',
      excerpt:
        'Comprehensive quarterly report tracking policy dialogue outcomes, research citations, and smallholder outreach across Zambia.',
    },
    {
      slug: 'inter-ministerial-memorandum-water-security',
      title: 'Summary of November Inter-Ministerial Memorandum on Water Security and Extension Services',
      category: 'Policy Briefing',
      published_at: '2026-11-02T11:30:00Z',
      featured_image: '/photos/fosta-stakeholders-dialogue.jpg',
      excerpt:
        'Key policy recommendations on sustainable irrigation, dam management, and modernized agricultural extension delivery.',
    },
    {
      slug: 'stakeholder-mobilization-climate-smart-framework',
      title: 'Stakeholder Mobilization Highlights for National Climate-Smart Agriculture Framework',
      category: 'Dialogue Highlight',
      published_at: '2026-11-03T14:00:00Z',
      featured_image: '/photos/beef-report-workshop.jpg',
      excerpt:
        'Multi-stakeholder coalition reviews grassroots adoption of agro-ecological practices and drought-tolerant seed varieties.',
    },
  ]

  const articles =
    rawArticles.length >= 3
      ? rawArticles
      : [...rawArticles, ...fallbackArticles.slice(rawArticles.length)]

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#153e28] text-white py-16 lg:py-20 border-b border-[#1e4a32]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white bg-white/15 px-3.5 py-1.5 rounded-full border border-white/20 inline-block">
            ACF Communications
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Media &amp; Sector Updates
          </h1>
          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Official announcements, policy submissions, consultative dialogues, and agricultural developments from ACF and partners.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-5xl pt-16 space-y-16">
        {/* Latest Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((item) => {
            const itemData = item as any
            const articleImg =
              itemData.image_url ||
              itemData.featured_image ||
              '/photos/fosta-stakeholders-dialogue.jpg'
            return (
              <article
                key={item.slug}
                className="bg-white rounded-3xl border border-[#dbe6de] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
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
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#1e7e48] font-bold text-xs shadow-xs">
                        {item.category || 'Sector News'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-[#526658] mb-3">
                      <Calendar size={13} className="text-[#1e7e48]" />
                      <span>{formatDate(item.published_at)}</span>
                    </div>

                    <h2 className="text-lg font-bold text-[#122419] group-hover:text-[#1e7e48] transition-colors leading-snug mb-3 line-clamp-2">
                      <Link href={`/news/${item.slug}`}>{item.title}</Link>
                    </h2>

                    <p className="text-xs text-[#526658] leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex justify-end">
                  <Link
                    href={`/news/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e7e48] group-hover:text-[#166538]"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        {/* Newsletter Signup & Social Live Stream Card */}
        <section className="bg-gradient-to-br from-[#153e28] to-[#1e5c3a] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#256c45] space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#a3e6be] bg-white/10 px-3 py-1 rounded-full border border-white/15 inline-block">
              Communications Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Stay Informed on Zambian Agriculture
            </h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Get timely empirical briefings, policy notifications, and invitations to national consultation roundtables.
            </p>
          </div>

          <form action="/api/newsletter" method="POST" className="max-w-xl space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your official email address"
                className="flex-grow px-5 py-3.5 rounded-full bg-white text-[#122419] text-xs sm:text-sm placeholder:text-[#526658] focus:outline-none focus:ring-2 focus:ring-[#a3e6be] shadow-inner"
              />
              <button
                type="submit"
                className="px-7 py-3.5 bg-[#2e9e5b] hover:bg-[#258249] text-white font-extrabold text-xs sm:text-sm rounded-full transition-all shadow-md shrink-0 cursor-pointer"
              >
                Subscribe
              </button>
            </div>
            <p className="text-[11px] text-emerald-100/80">
              By subscribing, you agree to receive agricultural policy communications pursuant to the Data Protection Act.
            </p>
          </form>

          <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-100/90">
            <div className="flex items-center gap-2">
              <FacebookIcon size={18} className="text-[#a3e6be]" />
              <span>Follow our updates live via the{' '}
                <a
                  href="https://facebook.com/ACFZambia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-white hover:text-[#a3e6be] transition-colors"
                >
                  Agricultural Consultative Forum Facebook Page
                </a>.
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
