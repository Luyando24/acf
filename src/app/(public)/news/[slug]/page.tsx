import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/formatters'
import { constructMetadata } from '@/lib/utils/seo'
import { renderRichText } from '@/lib/content/richText'
import ContentImage from '@/components/ui/ContentImage'

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
    .eq('status', 'published')
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

  const { data: rawArticle } = await supabase
    .from('news_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!rawArticle) {
    notFound()
  }

  const article = rawArticle as any
  const featuredImg = article.image_url || article.featured_image || '/photos/fosta-stakeholders-dialogue.jpg'

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#153e28] text-white py-16 border-b border-[#1e4a32]">
        <div className="container mx-auto px-4 max-w-4xl space-y-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All News</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-white border border-white/20">
              {article.category || 'Sector News'}
            </span>
            <span className="text-xs text-emerald-100/80">
              Published on {formatDate(article.published_at)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {article.title}
          </h1>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-4xl pt-12 space-y-10">
        {/* Featured Article Image */}
        <div className="relative w-full aspect-21/9 sm:aspect-2/1 rounded-3xl overflow-hidden border border-[#dbe6de] shadow-sm bg-neutral-100">
          <ContentImage src={featuredImg} alt={article.title} className="object-cover" />
        </div>

        <div className="bg-white rounded-3xl border border-[#dbe6de] p-8 sm:p-12 shadow-xs space-y-8">
          <div className="border-b border-[#dbe6de] pb-6">
            <p className="text-base sm:text-lg text-[#1e7e48] font-semibold leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          <div
            className="prose-acf"
            dangerouslySetInnerHTML={{ __html: renderRichText(article.body || article.excerpt || '') }}
          />

          <div className="pt-8 border-t border-[#dbe6de] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-xs font-bold text-[#526658]">
              Share this article with colleagues & networks:
            </span>
            <div className="flex items-center gap-2">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `https://acfzambia.org/news/${article.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#eef6f1] text-[#1e7e48] hover:bg-[#1e7e48] hover:text-white transition-colors"
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
                className="p-2 rounded-lg bg-[#eef6f1] text-[#1e7e48] hover:bg-[#1e7e48] hover:text-white transition-colors"
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
                className="p-2 rounded-lg bg-[#eef6f1] text-[#1e7e48] hover:bg-[#1e7e48] hover:text-white transition-colors"
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
