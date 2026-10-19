import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProgrammeForm from '@/components/admin/forms/ProgrammeForm'
import { ProgrammeItem } from '@/components/admin/ProgrammeManager'

export const metadata = {
  title: 'Edit Programme Pillar | ACF Admin CMS',
}

interface EditProgrammeProps {
  params: Promise<{ id: string }>
}

const defaultProgrammes: ProgrammeItem[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    slug: 'policy-advocacy',
    title: 'Agricultural Policy Advocacy',
    summary: 'Mobilising multi-stakeholder consultations and evidence to influence national agricultural policy formulation and implementation in Zambia.',
    body: 'ACF engages with the Ministry of Agriculture, Parliamentary Committees, and farmer caucuses to advance equitable agricultural legislation, efficient input support, and open trade regimes.',
    cover_image: '/photos/dialogue.jpg',
    icon: 'Scale',
    order_index: 1,
    status: 'published',
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    slug: 'research-and-evidence',
    title: 'Research & Evidence Generation',
    summary: 'Generating credible empirical data, analytical briefs, and sector performance reviews to guide agricultural investments.',
    body: 'Rigorous empirical analyses, smallholder surveys, and cost-benefit evaluations that provide the foundational evidence for multi-stakeholder debate.',
    cover_image: '/photos/fieldwork.jpg',
    icon: 'BookOpen',
    order_index: 2,
    status: 'published',
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    slug: 'multi-stakeholder-dialogue',
    title: 'Multi-Stakeholder Dialogue Platforms',
    summary: 'Providing a neutral, inclusive convening platform where government, agribusiness, donors, and smallholder farmer groups collaborate.',
    body: 'Convening neutral policy roundtables, technical taskforces, and annual national symposia that build consensus on contentious sector issues.',
    cover_image: '/photos/event1.jpg',
    icon: 'Users',
    order_index: 3,
    status: 'published',
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    slug: 'climate-resilience',
    title: 'Climate Resilience & Sustainable Systems',
    summary: 'Advocating for climate-smart agriculture, soil health conservation, and resilient rural farming systems in Zambia.',
    body: 'Promoting drought mitigation strategies, crop diversification, conservation agriculture, and rural water harvesting frameworks.',
    cover_image: '/photos/resilience.jpg',
    icon: 'Sprout',
    order_index: 4,
    status: 'published',
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    slug: 'land-rights-tenure',
    title: "Land Tenure & Women's Rights",
    summary: 'Protecting customary land tenure, strengthening women smallholder rights, and promoting fair land governance across Zambia.',
    body: 'ACF works with traditional authorities, civil society partners, and legal aid groups to formalise and safeguard land access rights for vulnerable rural households.',
    cover_image: '/photos/fieldwork.jpg',
    icon: 'Shield',
    order_index: 5,
    status: 'published',
  },
]

export default async function EditProgrammePage({ params }: EditProgrammeProps) {
  const { id } = await params
  const supabase = await createClient()

  let programme: ProgrammeItem | null = null

  try {
    const { data } = await supabase
      .from('programmes')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      programme = data as ProgrammeItem
    }
  } catch {
    // Fallback to local default data
  }

  if (!programme) {
    const found = defaultProgrammes.find((p) => p.id === id)
    if (found) {
      programme = found
    }
  }

  if (!programme) {
    notFound()
  }

  return <ProgrammeForm initialData={programme} />
}
