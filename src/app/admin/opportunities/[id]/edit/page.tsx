import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OpportunityForm from '@/components/admin/forms/OpportunityForm'
import { OpportunityItem } from '@/components/admin/OpportunityManager'

export const metadata = {
  title: 'Edit Opportunity | ACF Admin CMS',
}

interface EditOpportunityProps {
  params: Promise<{ id: string }>
}

const defaultOpps: OpportunityItem[] = [
  {
    id: '66666666-6666-6666-6666-666666666601',
    slug: 'consultancy-agricultural-policy-analyst',
    title: 'Senior Agricultural Policy Consultant',
    type: 'Consultancy',
    opens_on: '2026-03-01',
    closes_on: '2026-11-30',
    description: 'Senior Agricultural Policy Consultant to undertake comprehensive value chain analysis.',
    application_instructions: 'Please submit all required documents listed above through the portal before the closing deadline.',
    apply_url: null,
    contact_info: 'opportunities@acfzambia.org',
    status: 'published',
    accepted_documents: [
      'Curriculum Vitae (CV)',
      'Technical Proposal',
      'Financial Bid / Cost Quotation',
      'Professional References (3 Letters)',
    ],
  },
  {
    id: '66666666-6666-6666-6666-666666666602',
    slug: 'tender-annual-audit-services-2026',
    title: 'Expression of Interest: External Audit Services',
    type: 'Tender',
    opens_on: '2026-03-05',
    closes_on: '2026-11-15',
    description: 'Qualified audit firms are invited to submit expressions of interest for statutory audit.',
    application_instructions: 'Submit sealed proposals to the ACF Secretariat.',
    apply_url: null,
    contact_info: 'procurement@acfzambia.org',
    status: 'published',
    accepted_documents: [
      'Company Registration & ZRA Tax Clearance',
      'Technical Proposal',
      'Financial Bid / Cost Quotation',
    ],
  },
]

export default async function EditOpportunityPage({ params }: EditOpportunityProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', id)
    .single()

  const opp = data || defaultOpps.find((o) => o.id === id)

  if (!opp) {
    notFound()
  }

  return <OpportunityForm initialData={opp as unknown as OpportunityItem} />
}
