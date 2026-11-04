import Link from 'next/link'
import { BookOpen, Download, Search, FileText, FileSpreadsheet, Layers, ArrowRight, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatFileSize } from '@/lib/utils/formatters'
import { constructMetadata } from '@/lib/utils/seo'

export const metadata = constructMetadata({
  title: 'Knowledge Hub | Research, Tools & Advisories',
  description:
    'Access our full depository of empirical data, templates, and policy statements from the Agricultural Consultative Forum.',
  pathname: '/publications',
})

interface PublicationsPageProps {
  searchParams: Promise<{ q?: string; category?: string }>
}

export default async function KnowledgeHubPage({ searchParams }: PublicationsPageProps) {
  const { q, category } = await searchParams
  const supabase = await createClient()

  // Fetch categories
  const { data: categoriesData } = await supabase
    .from('publication_categories')
    .select('*')
    .order('order_index', { ascending: true })

  const categories = (categoriesData || []) as any[]

  // Query publications
  let query = supabase
    .from('publications')
    .select('*, publication_categories(name, slug)')
    .eq('status', 'published')
    .order('published_on', { ascending: false })

  if (category) {
    const matchingCat = categories.find((c) => c.slug === category)
    if (matchingCat) {
      query = query.eq('category_id', matchingCat.id)
    }
  }

  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  const { data: pubData } = await query
  const publications = (pubData || []) as any[]

  const featuredHubResources = [
    {
      group: 'Policy Briefs & Advocacy Papers',
      icon: FileText,
      items: [
        {
          title: 'Joint Ministerial Policy Brief on El Niño Adaptation Actions',
          type: 'Policy Brief',
          date: '2026',
        },
        {
          title: 'Parliamentary Committee Briefing on Agricultural Budget Performance',
          type: 'Advocacy Paper',
          date: '2026',
        },
      ],
    },
    {
      group: 'Institutional Templates',
      icon: FileSpreadsheet,
      items: [
        {
          title: 'District Early Warning Template for Disaster Management Committees',
          type: 'Operational Template',
          date: '2025/2026',
        },
      ],
    },
    {
      group: 'Technical Studies',
      icon: Layers,
      items: [
        {
          title: 'Zambia Competitiveness and Animal Health Institutional Assessment',
          type: 'Technical Study',
          date: '2025/2026',
        },
      ],
    },
  ]

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#153e28] text-white py-16 lg:py-20 border-b border-[#1e4a32]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white bg-white/15 px-3.5 py-1.5 rounded-full border border-white/20 inline-block">
            Knowledge Hub
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Research, Tools &amp; Advisories
          </h1>
          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Access our full depository of empirical data, templates, and policy statements.
          </p>

          {/* Search Bar Form */}
          <form method="GET" action="/publications" className="pt-4 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-4 text-[#526658]" />
              <input
                type="text"
                name="q"
                defaultValue={q || ''}
                placeholder="Search by Topic, Year, or Project..."
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
        {/* Category Filters Pills */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#526658] mb-3">
            Filter by Resource Type:
          </div>
          <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-[#dbe6de]">
            <Link
              href="/publications"
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                !category
                  ? 'bg-[#1e7e48] text-white shadow-xs'
                  : 'bg-white border border-[#dbe6de] text-[#526658] hover:border-[#1e7e48] hover:text-[#1e7e48]'
              }`}
            >
              All Resource Types
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/publications?category=${cat.slug}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                  category === cat.slug
                    ? 'bg-[#1e7e48] text-white shadow-xs'
                    : 'bg-white border border-[#dbe6de] text-[#526658] hover:border-[#1e7e48] hover:text-[#1e7e48]'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Depository Highlights (shown when no specific search query) */}
        {!q && !category && (
          <section className="bg-[#f4f8f5] p-6 sm:p-8 rounded-3xl border border-[#dbe6de] space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#1e7e48]" />
              <h2 className="text-lg font-bold text-[#122419]">
                Featured Depository Highlights
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredHubResources.map((group) => {
                const Icon = group.icon
                return (
                  <div
                    key={group.group}
                    className="bg-white rounded-2xl p-5 border border-[#dbe6de] shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#eef6f1] text-[#1e7e48] flex items-center justify-center font-bold">
                          <Icon size={16} />
                        </div>
                        <h3 className="font-bold text-xs uppercase tracking-wider text-[#122419]">
                          {group.group}
                        </h3>
                      </div>

                      <div className="space-y-2.5">
                        {group.items.map((item) => (
                          <div key={item.title} className="text-xs border-l-2 border-[#1e7e48] pl-2.5 py-0.5">
                            <span className="font-bold text-[#122419] block leading-snug">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-[#526658]">
                              {item.type} • {item.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#f4f8f5]">
                      <Link
                        href={`/publications?q=${encodeURIComponent(group.items[0].title.slice(0, 15))}`}
                        className="text-[11px] font-bold text-[#1e7e48] hover:underline flex items-center gap-1"
                      >
                        <span>Access Document</span>
                        <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Publications List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#dbe6de] pb-3">
            <h2 className="text-xl font-bold text-[#122419]">
              {q ? `Search Results for "${q}"` : 'All Available Publications & Briefs'}
            </h2>
            <span className="text-xs font-bold text-[#1e7e48] bg-[#eef6f1] px-3 py-1 rounded-full">
              {publications.length} Documents
            </span>
          </div>

          {publications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#dbe6de] p-8 space-y-3">
              <BookOpen size={40} className="mx-auto text-[#526658]" />
              <h2 className="text-xl font-bold text-[#122419]">No publications found</h2>
              <p className="text-sm text-[#526658] max-w-md mx-auto">
                No policy documents match your current filter criteria. Try clearing search filters.
              </p>
              {(category || q) && (
                <Link
                  href="/publications"
                  className="inline-block mt-2 px-5 py-2 text-xs font-bold bg-[#1e7e48] text-white rounded-full hover:bg-[#166538]"
                >
                  Clear Filters
                </Link>
              )}
            </div>
          ) : (
            publications.map((pub) => (
              <div
                key={pub.slug}
                className="bg-white rounded-3xl border border-[#dbe6de] p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
              >
                <div className="space-y-2 flex-grow">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#526658]">
                    <span className="px-3 py-1 rounded-md bg-[#eef6f1] text-[#1e7e48] font-bold">
                      {(pub.publication_categories as any)?.name || 'Policy Document'}
                    </span>
                    <span>•</span>
                    <span>Published on {formatDate(pub.published_on)}</span>
                    {pub.file_size && (
                      <>
                        <span>•</span>
                        <span>{formatFileSize(pub.file_size)}</span>
                      </>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-[#122419] group-hover:text-[#1e7e48] transition-colors leading-snug">
                    <Link href={`/publications/${pub.slug}`}>{pub.title}</Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-[#526658] leading-relaxed max-w-2xl line-clamp-2">
                    {pub.summary}
                  </p>
                </div>

                <div className="shrink-0 w-full md:w-auto pt-2 md:pt-0 flex items-center gap-3">
                  <Link
                    href={`/publications/${pub.slug}`}
                    className="w-full md:w-auto px-5 py-3 rounded-xl bg-[#1e7e48] hover:bg-[#166538] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Download size={15} />
                    <span>View &amp; Download</span>
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
