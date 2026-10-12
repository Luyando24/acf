import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PersonCard, { Person } from '@/components/ui/PersonCard'
import { constructMetadata } from '@/lib/utils/seo'

export const metadata = constructMetadata({
  title: 'Management Team | Executive Leadership',
  description:
    'Meet the Management Team leading the Secretariat of the Agricultural Consultative Forum (ACF) in Lusaka, Zambia.',
  pathname: '/about/management',
})

export default async function ManagementPage() {
  const supabase = await createClient()
  const { data: peopleData } = await supabase
    .from('people')
    .select('*')
    .eq('group_type', 'management')
    .eq('is_visible', true)
    .order('order_index', { ascending: true })

  const members: Person[] =
    peopleData && peopleData.length > 0
      ? (peopleData as Person[])
      : [
          {
            id: '1',
            group_type: 'management',
            name: '[PLACEHOLDER] Executive Director',
            position: 'Executive Director',
            bio: 'Leads the ACF Secretariat in executing policy dialogues, stakeholder coordination, and institutional strategy across Zambia.',
          },
          {
            id: '2',
            group_type: 'management',
            name: '[PLACEHOLDER] Head of Policy & Research',
            position: 'Head of Policy & Research',
            bio: 'Coordinates empirical studies, policy briefs, and dialogue working groups connecting farmers with national policymakers.',
          },
        ]

  return (
    <div className="bg-[#fdfdfd] pb-24">
      <section className="bg-gradient-to-r from-[#0f1d14] via-[#142d1f] to-[#175432] text-white py-16 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-widest">
            <Link href="/about" className="hover:underline">
              About ACF
            </Link>
            <span>/</span>
            <span>Executive</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Management Team
          </h1>
          <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto">
            Executive directors steering daily operations, research agendas, and stakeholder dialogue forums.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl pt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      </div>
    </div>
  )
}
