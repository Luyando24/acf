import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PersonCard, { Person } from '@/components/ui/PersonCard'
import { constructMetadata } from '@/lib/utils/seo'

export const metadata = constructMetadata({
  title: 'Board of Directors | Governance Leadership',
  description:
    'Meet the Board of Directors of the Agricultural Consultative Forum (ACF), providing strategic governance and policy oversight.',
  pathname: '/about/board',
})

export default async function BoardPage() {
  const supabase = await createClient()
  const { data: peopleData } = await supabase
    .from('people')
    .select('*')
    .eq('group_type', 'board')
    .eq('is_visible', true)
    .order('order_index', { ascending: true })

  const members: Person[] =
    peopleData && peopleData.length > 0
      ? (peopleData as Person[])
      : [
          {
            id: '1',
            group_type: 'board',
            name: 'Prof. Godfrey Kanyama',
            position: 'Board Chairperson',
            photo_url: '/people/board-chair.jpg',
            email: 'chairperson@acf.org.zm',
            linkedin_url: 'https://linkedin.com',
            twitter_url: 'https://x.com',
            bio: 'Distinguished agricultural leader with extensive experience in Zambian rural development policy and agricultural enterprise.',
          },
          {
            id: '2',
            group_type: 'board',
            name: 'Eng. Nalukui Mwalusi',
            position: 'Vice Chairperson',
            photo_url: '/people/board-vice.jpg',
            email: 'vicechair@acf.org.zm',
            linkedin_url: 'https://linkedin.com',
            bio: 'Specialist in agricultural trade, commodity exchange systems, and cooperative management across Eastern and Southern Africa.',
          },
          {
            id: '3',
            group_type: 'board',
            name: 'Chama Mwape',
            position: 'Board Member - Agribusiness Caucus',
            photo_url: '/people/board-private.jpg',
            email: 'agribusiness@acf.org.zm',
            linkedin_url: 'https://linkedin.com',
            twitter_url: 'https://x.com',
            bio: 'Senior corporate executive championing inclusive smallholder farmer commercial linkages and agro-dealer expansion.',
          },
          {
            id: '4',
            group_type: 'board',
            name: 'Dr. Evans Phiri',
            position: 'Board Member - Research & Academia',
            photo_url: '/people/board-academia.jpg',
            email: 'research.board@acf.org.zm',
            linkedin_url: 'https://linkedin.com',
            bio: 'Professor of Agricultural Economics focused on national grain market efficiency, post-harvest resilience, and food pricing models.',
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
            <span>Governance</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Board of Directors
          </h1>
          <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto">
            Providing institutional governance, strategic direction, and policy oversight across multi-stakeholder caucuses.
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
