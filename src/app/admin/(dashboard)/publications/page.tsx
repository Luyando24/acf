import { createClient } from '@/lib/supabase/server'
import PublicationManager, { PublicationItem } from '@/components/admin/PublicationManager'

export default async function AdminPublicationsPage() {
  const supabase = await createClient()

  const { data: pubData } = await supabase
    .from('publications')
    .select('*, publication_categories(name)')
    .order('published_on', { ascending: false })

  const publications = (pubData as unknown as PublicationItem[]) || []

  return <PublicationManager initialPublications={publications} />
}
