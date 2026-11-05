import Link from 'next/link'
import { Calendar, ArrowRight, FileText, Search } from 'lucide-react'
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

const DEFAULT_CATEGORIES = [
  'Sector News',
  'Policy Briefing',
  'Dialogue Highlight',
  'Policy Dialogue',
  'Press Release',
  'Secretariat Updates',
]

interface NewsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { category, q } = await searchParams
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

  const allArticles =
    rawArticles.length >= 3
      ? rawArticles
      : [...rawArticles, ...fallbackArticles.slice(rawArticles.length)]

  // Collect all unique categories from articles + default categories
  const categorySet = new Set<string>(DEFAULT_CATEGORIES)
  for (const item of allArticles) {
    if (item.category && typeof item.category === 'string') {
      categorySet.add(item.category.trim())
    }
  }
  const categories = Array.from(categorySet)

  // Filter articles by selected category and optional search query
  const filteredArticles = allArticles.filter((item) => {
    const itemCat = (item.category || 'Sector News').trim()
    const matchesCategory =
      !category || itemCat.toLowerCase() === category.trim().toLowerCase()

    const matchesQuery =
      !q ||
      item.title?.toLowerCase().includes(q.toLowerCase()) ||
      item.excerpt?.toLowerCase().includes(q.toLowerCase()) ||
      itemCat.toLowerCase().includes(q.toLowerCase())

    return matchesCategory && matchesQuery
  })

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

          {/* Search Form */}
          <form method="GET" action="/news" className="pt-4 max-w-2xl mx-auto">
            {category && <input type="hidden" name="category" value={category} />}
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-4 text-[#526658]" />
              <input
                type="text"
                name="q"
                defaultValue={q || ''}
                placeholder="Search news articles, briefings, or dialogues..."
                className="w-full pl-12 pr-28 py-4 bg-white text-[#122419] rounded-full text-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1e7e48] placeholder:text-[#526658]"
              />
              <button
                type="submit"
                className="absolute right-2 px-6 py-2.5 bg-[#1e7e48] hover:bg-[#166538] text-white font-bold text-xs rounded-full transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-5xl pt-12 space-y-12">
        {/* Category Filter Pills */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#526658]">
              Filter by Category:
            </span>
            <span className="text-xs font-bold text-[#1e7e48] bg-[#eef6f1] px-3 py-1 rounded-full w-fit">
              {filteredArticles.length}{' '}
              {filteredArticles.length === 1 ? 'Article' : 'Articles'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-[#dbe6de]">
            <Link
              href={q ? `/news?q=${encodeURIComponent(q)}` : '/news'}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                !category
                  ? 'bg-[#1e7e48] text-white shadow-xs'
                  : 'bg-white border border-[#dbe6de] text-[#526658] hover:border-[#1e7e48] hover:text-[#1e7e48]'
              }`}
            >
              All Categories
            </Link>

            {categories.map((cat) => {
              const isSelected =
                category?.trim().toLowerCase() === cat.toLowerCase()
              const href = `/news?category=${encodeURIComponent(cat)}${
                q ? `&q=${encodeURIComponent(q)}` : ''
              }`
              return (
                <Link
                  key={cat}
                  href={href}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-[#1e7e48] text-white shadow-xs'
                      : 'bg-white border border-[#dbe6de] text-[#526658] hover:border-[#1e7e48] hover:text-[#1e7e48]'
                  }`}
                >
                  {cat}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Latest Posts Grid or Empty State */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#dbe6de] p-8 space-y-3">
            <FileText size={40} className="mx-auto text-[#526658]" />
            <h2 className="text-xl font-bold text-[#122419]">
              No news articles found
            </h2>
            <p className="text-sm text-[#526658] max-w-md mx-auto">
              No articles match your selected category or search filter. Try selecting another category or clearing your filters.
            </p>
            {(category || q) && (
              <Link
                href="/news"
                className="inline-block mt-2 px-5 py-2.5 text-xs font-bold bg-[#1e7e48] text-white rounded-full hover:bg-[#166538] transition-colors"
              >
                Clear Filters
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((item) => {
              const itemData = item as any
              const articleImg =
                itemData.image_url ||
                itemData.featured_image ||
                '/photos/fosta-stakeholders-dialogue.jpg'
              const itemCategory = item.category || 'Sector News'
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
                        <Link
                          href={`/news?category=${encodeURIComponent(itemCategory)}`}
                          className="px-3 py-1 rounded-full bg-white/95 hover:bg-[#1e7e48] text-[#1e7e48] hover:text-white backdrop-blur-xs font-bold text-xs shadow-xs transition-colors inline-block"
                        >
                          {itemCategory}
                        </Link>
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
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}

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
              <span>
                Follow our updates live via the{' '}
                <a
                  href="https://facebook.com/ACFZambia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-white hover:text-[#a3e6be] transition-colors"
                >
                  Agricultural Consultative Forum Facebook Page
                </a>
                .
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
