import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PersonCard, { Person } from '@/components/ui/PersonCard'
import { constructMetadata } from '@/lib/utils/seo'

export const metadata = constructMetadata({
  title: 'Staff Profiles | Secretariat Team',
  description:
    'Dedicated staff officers powering the research, communications, finance, and operations of the Agricultural Consultative Forum.',
  pathname: '/about/staff',
})

export default async function StaffPage() {
  const supabase = await createClient()
  const { data: peopleData } = await supabase
    .from('people')
    .select('*')
    .eq('group_type', 'staff')
    .eq('is_visible', true)
    .order('order_index', { ascending: true })

  const members: Person[] =
    peopleData && peopleData.length > 0
      ? (peopleData as Person[])
      : [
          {
            id: '1',
            group_type: 'staff',
            name: 'Chileshe Mulenga',
            position: 'Communications & Knowledge Manager',
            photo_url: '/people/staff-1.jpg',
            email: 'cmulenga@acf.org.zm',
            linkedin_url: 'https://linkedin.com',
            twitter_url: 'https://x.com',
            bio: 'Manages publications dissemination, media relations, digital platforms, and stakeholder outreach across Zambia.',
          },
          {
            id: '2',
            group_type: 'staff',
            name: 'Kondwani Banda',
            position: 'Finance & Administration Officer',
            photo_url: '/people/staff-2.jpg',
            email: 'kbanda@acf.org.zm',
            linkedin_url: 'https://linkedin.com',
            bio: 'Oversees financial management, grant compliance, and operational logistics for ACF dialogue programmes.',
          },
          {
            id: '3',
            group_type: 'staff',
            name: 'Mwape Tembo',
            position: 'Programme & M&E Officer',
            photo_url: '/people/staff-3.jpg',
            email: 'mtembo@acf.org.zm',
            linkedin_url: 'https://linkedin.com',
            twitter_url: 'https://x.com',
            bio: 'Coordinates field performance indicators, stakeholder feedback surveys, and activity monitoring.',
          },
        ]

  return (
    <div className="bg-[#fdfdfd] pb-24">
      <section className="bg-[#0f1d14] text-white py-16 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-widest">
            <Link href="/about" className="hover:underline">
              About ACF
            </Link>
            <span>/</span>
            <span>Secretariat</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Secretariat Staff
          </h1>
          <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto">
            The dedicated operational and technical team executing ACF programmes from our secretariat in Lusaka.
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
