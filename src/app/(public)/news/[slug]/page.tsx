import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, Share2 } from 'lucide-react'
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/formatters'
import { constructMetadata } from '@/lib/utils/seo'

interface NewsDetailProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: NewsDetailProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: news } = await supabase
    .from('news_posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .single()

  const newsItem = news as any
  if (!newsItem) {
    return constructMetadata({ title: 'Article' })
  }

  return constructMetadata({
    title: `${newsItem.title} | News & Updates`,
    description: newsItem.excerpt,
    pathname: `/news/${slug}`,
  })
}

export default async function NewsDetailPage({ params }: NewsDetailProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: newsData } = await supabase
    .from('news_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  const article =
    newsData ||
    (slug === 'national-consultative-dialogue-food-security-2026'
      ? {
          id: '44444444-4444-4444-4444-444444444401',
          slug: 'national-consultative-dialogue-food-security-2026',
          title: 'ACF Convenes National Stakeholder Dialogue on Sustainable Food Security',
          excerpt:
            'Key stakeholders from government, farmer federations, and agribusiness gathered in Lusaka to review post-drought recovery mechanisms.',
          body: `
            <p>The Agricultural Consultative Forum (ACF) convened a high-level consultative dialogue in Lusaka, bringing together over 80 representatives from farmer unions, agribusiness associations, research bodies, and the Ministry of Agriculture.</p>
            <p>Discussions centred on evidence-backed strategies for the upcoming cropping season, emergency irrigation expansion, and targeted support for smallholder farming families affected by climate shocks.</p>
            <h2>Key Policy Resolutions</h2>
            <p>Participants agreed on the following policy directions to be submitted to the Ministry of Agriculture and Parliament:</p>
            <ul>
              <li>Expansion of flexible electronic voucher mechanisms allowing farmers to procure drought-resilient legumes and certified seed varieties.</li>
              <li>Public investment prioritisation for community-managed micro-irrigation infrastructure.</li>
              <li>Establishment of a predictable grain marketing calendar with transparent grain reserve targets.</li>
            </ul>
            <p>ACF will compile the complete technical proceedings into a forthcoming Policy Brief to be distributed to parliamentary committees and donor agricultural working groups.</p>
          `,
          category: 'Policy Dialogue',
          published_at: '2026-03-01T07:00:00Z',
        }
      : null)

  if (!article) {
    notFound()
  }

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0f1d14] via-[#142d1f] to-[#175432] text-white py-16 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl space-y-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All News</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1e462f] text-[#a3e635] border border-[#2da44e]/40">
              {article.category || 'Sector News'}
            </span>
            <span className="text-xs text-emerald-200/70">
              Published on {formatDate(article.published_at)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {article.title}
          </h1>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-4xl pt-16 space-y-10">
        <div className="bg-white rounded-3xl border border-[#e2ebe4] p-8 sm:p-12 shadow-xs space-y-8">
          <div className="border-b border-[#e2ebe4] pb-6">
            <p className="text-base sm:text-lg text-[#175432] font-semibold leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          <div
            className="prose-acf"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          <div className="pt-8 border-t border-[#e2ebe4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-xs font-bold text-[#5c6f62]">
              Share this article with colleagues & networks:
            </span>
            <div className="flex items-center gap-2">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `https://acfzambia.org/news/${article.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#f0f6f1] text-[#175432] hover:bg-[#175432] hover:text-white transition-colors"
                aria-label="Share on Facebook"
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  article.title
                )}&url=${encodeURIComponent(`https://acfzambia.org/news/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#f0f6f1] text-[#175432] hover:bg-[#175432] hover:text-white transition-colors"
                aria-label="Share on Twitter"
              >
                <TwitterIcon size={16} />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                  `https://acfzambia.org/news/${article.slug}`
                )}&title=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#f0f6f1] text-[#175432] hover:bg-[#175432] hover:text-white transition-colors"
                aria-label="Share on LinkedIn"
              >
                <LinkedinIcon size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
