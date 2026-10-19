import { createClient } from '@/lib/supabase/server'
import MembershipManager, { MembershipApplicationItem } from '@/components/admin/MembershipManager'

export default async function AdminMembershipPage() {
  const supabase = await createClient()

  const { data: appsData } = await supabase
    .from('membership_applications')
    .select('*, membership_categories(name)')
    .order('created_at', { ascending: false })

  const defaultApplications: MembershipApplicationItem[] = [
    {
      id: '88888888-8888-8888-8888-888888888801',
      applicant_type: 'organisation',
      org_name: 'Lusaka Grain Growers Cooperative',
      contact_name: 'Mwamba Banda',
      email: 'mbanda@graingrowers.co.zm',
      phone: '+260 97 1234567',
      location_province: 'Lusaka Province',
      sector_interest: 'Maize & Soya Value Chains',
      status: 'new',
      notes: null,
      created_at: new Date().toISOString(),
      membership_categories: { name: 'Agricultural Producer Associations' },
    },
    {
      id: '88888888-8888-8888-8888-888888888802',
      applicant_type: 'organisation',
      org_name: 'Eastern Agribusiness Inputs Ltd',
      contact_name: 'Chileshe Phiri',
      email: 'chileshe@easterninputs.zm',
      phone: '+260 96 7654321',
      location_province: 'Eastern Province',
      sector_interest: 'Certified Seed & Fertilizer Distribution',
      status: 'approved',
      notes: 'PACRA certified and verified by Eastern Province agro-dealer caucus.',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      membership_categories: { name: 'Agri-Business & Private Sector' },
    },
  ]

  const applications = appsData && appsData.length > 0 ? (appsData as unknown as MembershipApplicationItem[]) : defaultApplications

  return <MembershipManager initialApplications={applications} />
}
