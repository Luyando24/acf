import Link from 'next/link'
import { BookOpen, Download, FileText, Filter, Search, Tag } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatFileSize } from '@/lib/utils/formatters'
import { constructMetadata } from '@/lib/utils/seo'

export const metadata = constructMetadata({
  title: 'Publications Repository | Agricultural Research & Policy Briefs',
  description:
    'Search and download evidence-based policy briefs, research reports, newsletters, and technical presentations from the Agricultural Consultative Forum.',
  pathname: '/publications',
})

interface PublicationsPageProps {
  searchParams: Promise<{ q?: string; category?: string }>
}

export default async function PublicationsPage({ searchParams }: PublicationsPageProps) {
  const { q, category } = await searchParams
  const supabase = await createClient()

  // Fetch categories
  const { data: categoriesData } = await supabase
    .from('publication_categories')
    .select('*')
    .order('order_index', { ascending: true })

  const categories =
    categoriesData && categoriesData.length > 0
      ? categoriesData
      : [
          { id: '1', slug: 'policy-briefs', name: 'Policy Briefs' },
          { id: '2', slug: 'research-reports', name: 'Research Reports' },
          { id: '3', slug: 'technical-reports', name: 'Technical Reports' },
          { id: '4', slug: 'policy-advisory-notes', name: 'Policy Advisory Notes' },
          { id: '5', slug: 'newsletters', name: 'Newsletters' },
        ]

  // Query publications
  let query = supabase
    .from('publications')
    .select('*, publication_categories(name, slug)')
    .eq('status', 'published')
    .order('published_on', { ascending: false })

  if (category) {
    // If category slug is provided, filter by category slug
    const matchingCat = categories.find((c) => c.slug === category)
    if (matchingCat) {
      query = query.eq('category_id', matchingCat.id)
    }
  }

  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  const { data: pubData } = await query

  const defaultPubs = [
    {
      id: '33333333-3333-3333-3333-333333333301',
      slug: 'zambia-agricultural-policy-brief-2026',
      title: 'Zambia Agricultural Sector Policy Review 2025/2026',
      summary:
        'An evidence-based assessment of agricultural performance, input support programmes, and market policies in Zambia.',
      published_on: '2026-02-15',
      file_size: 2450000,
      download_count: 142,
      publication_categories: { name: 'Policy Briefs', slug: 'policy-briefs' },
    },
    {
      id: '33333333-3333-3333-3333-333333333302',
      slug: 'smallholder-drought-resilience-study',
      title: 'Building Climate Resilience Among Smallholder Maize Farmers',
      summary:
        'Empirical study on drought mitigation strategies, crop diversification, and irrigation adoption in Southern and Eastern Provinces.',
      published_on: '2026-01-20',
      file_size: 3820000,
      download_count: 98,
      publication_categories: { name: 'Research Reports', slug: 'research-reports' },
    },
    {
      id: '33333333-3333-3333-3333-333333333303',
      slug: 'customary-land-rights-brief-women',
      title: 'Securing Customary Land Rights for Women Farmers in Zambia',
      summary:
        'Policy advisory note detailing practical legal mechanisms to strengthen women smallholders land tenure security.',
      published_on: '2025-11-10',
      file_size: 1850000,
      download_count: 76,
      publication_categories: { name: 'Policy Advisory Notes', slug: 'policy-advisory-notes' },
    },
    {
      id: '33333333-3333-3333-3333-333333333304',
      slug: 'acf-newsletter-q4-2025',
      title: 'ACF Quarterly Newsletter - Q4 2025',
      summary:
        'Highlights from national agricultural policy consultative forums, stakeholder submissions, and upcoming programmes.',
      published_on: '2025-12-22',
      file_size: 1240000,
      download_count: 54,
      publication_categories: { name: 'Newsletters', slug: 'newsletters' },
    },
  ]

  const publications = pubData && pubData.length > 0 ? pubData : defaultPubs

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0f1d14] via-[#142d1f] to-[#175432] text-white py-16 lg:py-20 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#a3e635] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 inline-block">
            Knowledge Repository
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Publications & Research Library
          </h1>
          <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Browse, search, and download credible empirical research, policy briefs, and advisory documents.
          </p>

          {/* Search Bar Form */}
          <form method="GET" action="/publications" className="pt-4 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-4 text-[#5c6f62]" />
              <input
                type="text"
                name="q"
                defaultValue={q || ''}
                placeholder="Search publications by keyword, title, or topic..."
                className="w-full pl-12 pr-28 py-4 bg-white text-[#0f1d14] rounded-full text-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-[#a3e635] placeholder:text-[#5c6f62]"
              />
              <button
                type="submit"
                className="absolute right-2 px-6 py-2.5 bg-[#175432] hover:bg-[#114227] text-white font-bold text-xs rounded-full transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-5xl pt-12">
        {/* Category Filters Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-8 border-b border-[#e2ebe4]">
          <Link
            href="/publications"
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              !category
                ? 'bg-[#175432] text-white shadow-xs'
                : 'bg-white border border-[#e2ebe4] text-[#5c6f62] hover:border-[#175432] hover:text-[#175432]'
            }`}
          >
            All Categories
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/publications?category=${cat.slug}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                category === cat.slug
                  ? 'bg-[#175432] text-white shadow-xs'
                  : 'bg-white border border-[#e2ebe4] text-[#5c6f62] hover:border-[#175432] hover:text-[#175432]'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Publications List */}
        <div className="pt-8 space-y-6">
          {publications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#e2ebe4] p-8 space-y-3">
              <BookOpen size={40} className="mx-auto text-[#5c6f62]" />
              <h2 className="text-xl font-bold text-[#0f1d14]">No publications found</h2>
              <p className="text-sm text-[#5c6f62] max-w-md mx-auto">
                No research documents match your criteria. Try adjusting your search keyword or selecting a different category.
              </p>
              <Link
                href="/publications"
                className="inline-block mt-2 px-5 py-2 text-xs font-bold bg-[#175432] text-white rounded-full"
              >
                Clear Filters
              </Link>
            </div>
          ) : (
            publications.map((pub) => (
              <div
                key={pub.slug}
                className="bg-white rounded-3xl border border-[#e2ebe4] p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
              >
                <div className="space-y-2 flex-grow">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#5c6f62]">
                    <span className="px-3 py-1 rounded-md bg-[#f0f6f1] text-[#175432] font-bold">
                      {(pub.publication_categories as any)?.name || 'Policy Brief'}
                    </span>
                    <span>•</span>
                    <span>Published {formatDate(pub.published_on)}</span>
                    {pub.file_size && (
                      <>
                        <span>•</span>
                        <span>{formatFileSize(pub.file_size)}</span>
                      </>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-[#0f1d14] group-hover:text-[#175432] transition-colors leading-snug">
                    <Link href={`/publications/${pub.slug}`}>{pub.title}</Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-[#5c6f62] leading-relaxed max-w-2xl line-clamp-2">
                    {pub.summary}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto pt-2 md:pt-0">
                  <Link
                    href={`/publications/${pub.slug}`}
                    className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-[#175432] hover:bg-[#114227] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Download size={14} />
                    <span>View & Download</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
