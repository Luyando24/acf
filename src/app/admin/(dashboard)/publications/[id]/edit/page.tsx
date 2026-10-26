import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PublicationForm from '@/components/admin/forms/PublicationForm'
import { PublicationItem } from '@/components/admin/PublicationManager'

export const metadata = {
  title: 'Edit Publication | ACF Admin CMS',
}

interface EditPublicationProps {
  params: Promise<{ id: string }>
}

export default async function EditPublicationPage({ params }: EditPublicationProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('publications')
    .select('*, publication_categories(name)')
    .eq('id', id)
    .single()

  if (!data) {
    notFound()
  }

  return <PublicationForm initialData={data as unknown as PublicationItem} />
}
