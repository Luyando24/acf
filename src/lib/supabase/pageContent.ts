import { createClient } from './server'
import { revalidatePath } from 'next/cache'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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

const LOCAL_STORE_PATH = join(process.cwd(), 'src', 'data', 'page_content_store.json')

async function readLocalStore(): Promise<Record<string, any>> {
  try {
    if (!existsSync(LOCAL_STORE_PATH)) return {}
    const raw = await readFile(LOCAL_STORE_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function writeLocalStore(key: string, value: any): Promise<void> {
  // Only write to local file store in local development
  if (process.env.NODE_ENV === 'production') return

  try {
    const dir = join(process.cwd(), 'src', 'data')
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true })
    }
    const current = await readLocalStore()
    current[key] = value
    await writeFile(LOCAL_STORE_PATH, JSON.stringify(current, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to write local page content fallback:', err)
  }
}

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
  } catch {
    // Continue to local store fallback
  }

  // Check local fallback store
  try {
    const localStore = await readLocalStore()
    const localVal = localStore[key]
    if (localVal) {
      if (typeof localVal === 'object' && !Array.isArray(localVal)) {
        return {
          ...defaultContent,
          ...localVal,
        } as T
      }
      return (localVal as T) || defaultContent
    }
  } catch {
    // Fallback to defaults
  }

  return defaultContent as T
}

export async function savePageContent(slug: string, content: any): Promise<{ success: boolean; error?: string }> {
  const key = `page_${slug}`

  // Persist to local store in development
  await writeLocalStore(key, content)

  // Try updating Supabase
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
      console.warn(`Supabase upsert for ${key} reported notice:`, error.message)
    } else {
      // If home page was updated in Supabase, also synchronize legacy keys if hero_slides or stats were modified
      if (slug === 'home') {
        if (content.hero_slides) {
          await (supabase.from('site_settings') as any).upsert({
            key: 'hero_slides',
            value: content.hero_slides,
            description: 'Synchronized hero slides for home page',
            updated_at: new Date().toISOString(),
          })
        }
        if (content.stats) {
          await (supabase.from('site_settings') as any).upsert({
            key: 'stats',
            value: content.stats,
            description: 'Synchronized statistics for home page',
            updated_at: new Date().toISOString(),
          })
        }
      }
    }
  } catch (err: any) {
    console.warn(`Supabase connection warning for ${key}:`, err?.message || err)
  }

  // Revalidate paths for instant visibility
  try {
    if (slug === 'home') revalidatePath('/')
    else revalidatePath(`/${slug}`)
  } catch {
    // Path revalidation might run outside request context in some cases
  }

  return { success: true }
}
