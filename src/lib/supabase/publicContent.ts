import { cache } from 'react'
import { createClient } from './server'

/**
 * Memoised published-content readers. `cache` lets generateMetadata and the
 * page body share one database round trip per request.
 */

export const getPublishedNews = cache(async (slug: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('news_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  return data
})

export const getPublishedPublication = cache(async (slug: string) => {
  const supabase = await createClient()
  const { data } = await (supabase.from('publications') as any)
    .select('*, publication_categories(name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  return data
})

export const getPublishedEvent = cache(async (slug: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  return data
})

export const getPublishedOpportunity = cache(async (slug: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('opportunities')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  return data
})
