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

const defaultPubs: PublicationItem[] = [
  {
    id: '33333333-3333-3333-3333-333333333301',
    slug: 'zambia-agricultural-policy-brief-2026',
    title: 'Zambia Agricultural Sector Policy Review 2025/2026',
    summary: 'An evidence-based assessment of agricultural performance, input support programmes, and market policies in Zambia.',
    published_on: '2026-02-15',
    file_path: '/publications/zambia-agricultural-policy-brief-2026.pdf',
    file_size: 2450000,
    download_count: 142,
    is_featured: true,
    status: 'published',
    category_name: 'Policy Briefs',
  },
  {
    id: '33333333-3333-3333-3333-333333333302',
    slug: 'smallholder-drought-resilience-study',
    title: 'Building Climate Resilience Among Smallholder Maize Farmers',
    summary: 'Empirical study on drought mitigation strategies, crop diversification, and irrigation adoption in Southern and Eastern Provinces.',
    published_on: '2026-01-20',
    file_path: '/publications/smallholder-drought-resilience-study.pdf',
    file_size: 3820000,
    download_count: 98,
    is_featured: true,
    status: 'published',
    category_name: 'Research Reports',
  },
  {
    id: '33333333-3333-3333-3333-333333333303',
    slug: 'customary-land-rights-brief-women',
    title: 'Securing Customary Land Rights for Women Farmers in Zambia',
    summary: 'Policy advisory note detailing practical legal mechanisms to strengthen women smallholders land tenure security.',
    published_on: '2025-11-10',
    file_path: '/publications/customary-land-rights-brief-women.pdf',
    file_size: 1850000,
    download_count: 76,
    is_featured: false,
    status: 'published',
    category_name: 'Policy Advisory Notes',
  },
]

export default async function EditPublicationPage({ params }: EditPublicationProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('publications')
    .select('*, publication_categories(name)')
    .eq('id', id)
    .single()

  const publication = data || defaultPubs.find((p) => p.id === id)

  if (!publication) {
    notFound()
  }

  return <PublicationForm initialData={publication as unknown as PublicationItem} />
}
