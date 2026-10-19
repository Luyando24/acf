import { createClient } from './server'
import { revalidatePath } from 'next/cache'

// Re-export all client-safe types and default configurations
export * from '@/types/pageContent'

import {
  DEFAULT_HOME_PAGE_CONTENT,
  DEFAULT_ABOUT_PAGE_CONTENT,
  DEFAULT_CONTACT_PAGE_CONTENT,
  DEFAULT_MEMBERSHIP_PAGE_CONTENT,
} from '@/types/pageContent'

// ============================================================================
// Data Access Helper Functions (Server-Side)
// ============================================================================

export async function getPageContent<T>(slug: string): Promise<T> {
  const key = `page_${slug}`
  let defaultContent: any = {}

  if (slug === 'home') defaultContent = DEFAULT_HOME_PAGE_CONTENT
  else if (slug === 'about') defaultContent = DEFAULT_ABOUT_PAGE_CONTENT
  else if (slug === 'contact') defaultContent = DEFAULT_CONTACT_PAGE_CONTENT
  else if (slug === 'membership') defaultContent = DEFAULT_MEMBERSHIP_PAGE_CONTENT

  try {
    const supabase = await createClient()
    const { data, error } = await (supabase.from('site_settings') as any)
      .select('value')
      .eq('key', key)
      .maybeSingle()

    const rawValue = (data as any)?.value

    if (!error && rawValue) {
      if (typeof rawValue === 'object' && !Array.isArray(rawValue)) {
        return {
          ...defaultContent,
          ...rawValue,
        } as T
      }
      return (rawValue as T) || defaultContent
    }
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE') {
      throw err
    }
    console.error(`Failed to fetch page content for ${slug} from database:`, err)
  }

  return defaultContent as T
}

export async function savePageContent(slug: string, content: any): Promise<{ success: boolean; error?: string }> {
  const key = `page_${slug}`

  // Persist directly to Supabase site_settings
  try {
    const supabase = await createClient()

    const { error } = await (supabase.from('site_settings') as any).upsert(
      {
        key,
        value: content,
        description: `Editable page content for ${slug} page`,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )

    if (error) {
      console.error(`Failed to save page content for ${slug} to database:`, error)
      return { success: false, error: error.message }
    }

    // Revalidate paths for instant cache invalidation
    if (slug === 'home') revalidatePath('/')
    else revalidatePath(`/${slug}`)

    return { success: true }
  } catch (err: any) {
    console.error(`Database error saving page content for ${slug}:`, err)
    return { success: false, error: err.message || 'Database error occurred' }
  }
}
