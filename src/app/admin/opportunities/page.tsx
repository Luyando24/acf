import { createClient } from '@/lib/supabase/server'
import OpportunityManager, { OpportunityItem } from '@/components/admin/OpportunityManager'

export default async function AdminOpportunitiesPage() {
  const supabase = await createClient()

  const { data: oppData } = await supabase
    .from('opportunities')
    .select('*')
    .order('closes_on', { ascending: false })

  const defaultOpps: OpportunityItem[] = [
    {
      id: '66666666-6666-6666-6666-666666666601',
      slug: 'consultancy-agricultural-policy-analyst',
      title: 'Senior Agricultural Policy Consultant',
      type: 'Consultancy',
      opens_on: '2026-03-01',
      closes_on: '2026-11-30',
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
      status: 'published',
      accepted_documents: [
        'Company Registration & ZRA Tax Clearance',
        'Technical Proposal',
        'Financial Bid / Cost Quotation',
      ],
    },
    {
      id: '66666666-6666-6666-6666-666666666603',
      slug: 'consultancy-monitoring-evaluation-officer-expired',
      title: 'Monitoring & Evaluation Specialist',
      type: 'Job',
      opens_on: '2026-01-01',
      closes_on: '2026-02-15',
      status: 'published',
      accepted_documents: [
        'Curriculum Vitae (CV)',
        'Cover Letter',
        'Academic & Professional Qualifications',
        'National Registration Card (NRC) / ID',
      ],
    },
  ]

  const opportunities = oppData && oppData.length > 0 ? (oppData as OpportunityItem[]) : defaultOpps

  return <OpportunityManager initialOpportunities={opportunities} />
}
