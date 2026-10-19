import { createClient } from '@/lib/supabase/server'
import ProgrammeManager, { ProgrammeItem } from '@/components/admin/ProgrammeManager'

export default async function AdminProgrammesPage() {
  const supabase = await createClient()

  const { data: progData } = await supabase
    .from('programmes')
    .select('*')
    .order('order_index', { ascending: true })

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
      summary: 'Advocating for secure customary land tenure and equal rights for women and small-scale farming households.',
      body: 'Working with traditional leaders and land administration authorities to secure documented customary land rights and prevent displacement.',
      cover_image: '/photos/women_farming.jpg',
      icon: 'Shield',
      order_index: 5,
      status: 'published',
    },
  ]

  const programmes = progData && progData.length > 0 ? (progData as unknown as ProgrammeItem[]) : defaultProgrammes

  return <ProgrammeManager initialProgrammes={programmes} />
}
