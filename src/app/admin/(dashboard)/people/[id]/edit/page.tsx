import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PersonForm from '@/components/admin/forms/PersonForm'
import { PersonItem } from '@/components/admin/PeopleManager'

export const metadata = {
  title: 'Edit Personnel Profile | ACF Admin CMS',
}

interface EditPersonProps {
  params: Promise<{ id: string }>
}

const defaultPeople: PersonItem[] = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    group_type: 'board',
    name: 'Prof. Godfrey Kanyama',
    position: 'Board Chairperson',
    bio: 'Distinguished agricultural leader with extensive experience in Zambian rural development policy and agricultural enterprise.',
    photo_url: '/people/board-chair.jpg',
    order_index: 1,
    email: 'chairperson@acf.org.zm',
    linkedin_url: 'https://linkedin.com',
    is_visible: true,
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    group_type: 'board',
    name: 'Eng. Nalukui Mwalusi',
    position: 'Vice Chairperson',
    bio: 'Specialist in agricultural trade, commodity exchange systems, and cooperative management across Eastern and Southern Africa.',
    photo_url: '/people/board-vice.jpg',
    order_index: 2,
    email: 'vicechair@acf.org.zm',
    linkedin_url: 'https://linkedin.com',
    is_visible: true,
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    group_type: 'management',
    name: 'Dr. Munalula Silumesii',
    position: 'Executive Director',
    bio: 'Leads the ACF secretariat, spearheading multi-stakeholder policy formulation and strategic partnerships across government and cooperating partners.',
    photo_url: '/people/exec-director.jpg',
    order_index: 1,
    email: 'ed@acf.org.zm',
    linkedin_url: 'https://linkedin.com',
    is_visible: true,
  },
  {
    id: '22222222-2222-2222-2222-222222222204',
    group_type: 'staff',
    name: 'Kabaso Chileshe',
    position: 'Senior Agricultural Policy Analyst',
    bio: 'Specialising in quantitative sector modeling, FISP impact assessment, and input delivery reform.',
    photo_url: '/people/analyst.jpg',
    order_index: 1,
    email: 'kchileshe@acf.org.zm',
    linkedin_url: 'https://linkedin.com',
    is_visible: true,
  },
]

export default async function EditPersonPage({ params }: EditPersonProps) {
  const { id } = await params
  const supabase = await createClient()

  let person: PersonItem | null = null

  try {
    const { data } = await supabase
      .from('people')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      person = data as unknown as PersonItem
    }
  } catch {
    // Fallback
  }

  if (!person) {
    const found = defaultPeople.find((p) => p.id === id)
    if (found) {
      person = found
    }
  }

  if (!person) {
    notFound()
  }

  return <PersonForm initialData={person} />
}
