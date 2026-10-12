import { createClient } from './server'

export interface SiteSettings {
  site_name: string
  tagline: string
  description: string
  email: string
  phone: string
  address: string
  office_hours: string
  facebook_url?: string
  twitter_url?: string
  linkedin_url?: string
  youtube_url?: string
}

export interface SiteStat {
  label: string
  value: string
  order: number
}

const DEFAULT_SETTINGS: SiteSettings = {
  site_name: 'Agricultural Consultative Forum (ACF)',
  tagline: 'Multi-stakeholder dialogue & evidence-based policy for sustainable agriculture in Zambia',
  description:
    'ACF is a Zambian multi-stakeholder agricultural policy NGO bringing together public, private, farmer and research sectors for sustainable agricultural development.',
  email: 'info@acfzambia.org',
  phone: '+260 95 4755071',
  address: '24 Elm Rd, Woodlands, Lusaka, Zambia',
  office_hours: 'Monday - Friday: 08:00 - 17:00 CAT',
  facebook_url: 'https://facebook.com/ACFZambia',
  twitter_url: 'https://twitter.com/ACFZambia',
  linkedin_url: 'https://linkedin.com/company/acfzambia',
}

const DEFAULT_STATS: SiteStat[] = [
  { label: 'Policy Dialogues Held', value: '120+', order: 1 },
  { label: 'Research Publications', value: '85+', order: 2 },
  { label: 'Farmer Groups Reached', value: '50,000+', order: 3 },
  { label: 'Stakeholder Partners', value: '40+', order: 4 },
]

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'general')
      .single()

    const rawValue = (data as any)?.value
    if (error || !rawValue) {
      return DEFAULT_SETTINGS
    }
    return { ...DEFAULT_SETTINGS, ...(rawValue as Partial<SiteSettings>) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function getSiteStats(): Promise<SiteStat[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'stats')
      .single()

    const rawValue = (data as any)?.value
    if (error || !rawValue) {
      return DEFAULT_STATS
    }
    return rawValue as unknown as SiteStat[]
  } catch {
    return DEFAULT_STATS
  }
}
