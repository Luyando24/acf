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

  const members: Person[] = (peopleData as Person[]) || []

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
        {members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e2ebe4] p-8 max-w-md mx-auto">
            <p className="text-base font-semibold text-[#0f1d14]">No staff profiles currently listed</p>
            <p className="text-xs text-[#5c6f62] mt-1">Secretariat staff profiles will appear here once added in the administrative portal.</p>
          </div>
        )}
      </div>
    </div>
  )
}
