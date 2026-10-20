import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { constructMetadata } from '@/lib/utils/seo'

export const metadata = constructMetadata({
  title: 'Search',
  description: 'Search published ACF news, publications, programmes, and events.',
  pathname: '/search',
})

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = (q || '').trim().slice(0, 120)
  const supabase = await createClient()

  const pattern = `%${query.replace(/[%_]/g, '')}%`
  const [news, publications, programmes, events] = query
    ? await Promise.all([
        supabase.from('news_posts').select('title, slug, excerpt').eq('status', 'published').ilike('title', pattern).limit(8),
        supabase.from('publications').select('title, slug, summary').eq('status', 'published').ilike('title', pattern).limit(8),
        supabase.from('programmes').select('title, slug, summary').eq('status', 'published').ilike('title', pattern).limit(8),
        supabase.from('events').select('title, slug, description').eq('status', 'published').ilike('title', pattern).limit(8),
      ])
    : []

  const groups = [
    { label: 'News', href: (slug: string) => `/news/${slug}`, rows: news?.data || [] },
    { label: 'Publications', href: (slug: string) => `/publications/${slug}`, rows: publications?.data || [] },
    { label: 'Our Work', href: (slug: string) => `/our-work/${slug}`, rows: programmes?.data || [] },
    { label: 'Events', href: (slug: string) => `/events/${slug}`, rows: events?.data || [] },
  ]
  const total = groups.reduce((sum, group) => sum + group.rows.length, 0)

  return (
    <div className="bg-[#fdfdfd] pb-24">
      <section className="bg-[#0f1d14] text-white py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-black tracking-tight">Search</h1>
          <form action="/search" className="mt-6 flex gap-2" role="search">
            <label htmlFor="site-search" className="sr-only">
              Search the site
            </label>
            <input
              id="site-search"
              name="q"
              defaultValue={query}
              placeholder="Search news, publications, programmes, events"
              className="flex-1 rounded-xl px-4 py-3 text-sm text-[#0f1d14]"
            />
            <button type="submit" className="rounded-xl bg-[#175432] px-5 py-3 text-sm font-bold">
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-3xl pt-10 space-y-8">
        {query && (
          <p className="text-sm text-[#5c6f62]">
            {total} published {total === 1 ? 'result' : 'results'} for “{query}”
          </p>
        )}
        {query &&
          groups.map((group) =>
            group.rows.length > 0 ? (
              <section key={group.label} className="space-y-3">
                <h2 className="text-lg font-black text-[#0f1d14]">{group.label}</h2>
                <ul className="space-y-2">
                  {group.rows.map((row) => (
                    <li key={row.slug}>
                      <Link href={group.href(row.slug)} className="font-bold text-[#175432] hover:underline">
                        {row.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null
          )}
      </div>
    </div>
  )
}
