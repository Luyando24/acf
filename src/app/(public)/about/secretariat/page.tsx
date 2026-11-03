import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PersonCard, { Person } from '@/components/ui/PersonCard'
import { constructMetadata } from '@/lib/utils/seo'

export const metadata = constructMetadata({
  title: 'Secretariat | Executive Leadership & Staff',
  description:
    'Meet the executive leadership, management, and dedicated staff team driving operations and research at the Agricultural Consultative Forum (ACF) in Lusaka, Zambia.',
  pathname: '/about/secretariat',
})

export default async function SecretariatPage() {
  const supabase = await createClient()
  const { data: peopleData } = await supabase
    .from('people')
    .select('*')
    .in('group_type', ['management', 'staff'])
    .eq('is_visible', true)
    .order('order_index', { ascending: true })

  // Sort so management profiles appear first, followed by operational staff
  const members: Person[] = (peopleData as Person[]) || []
  const sortedMembers = [...members].sort((a, b) => {
    if (a.group_type === 'management' && b.group_type !== 'management') return -1
    if (a.group_type !== 'management' && b.group_type === 'management') return 1
    return (a.order_index ?? 0) - (b.order_index ?? 0)
  })

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#153e28] text-white py-16 border-b border-[#1e4a32]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-widest">
            <Link href="/about" className="hover:underline">
              About ACF
            </Link>
            <span>/</span>
            <span>People</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            The Secretariat
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mx-auto">
            The executive management and operational team leading policy research, stakeholder dialogues, and administrative programmes in Lusaka.
          </p>
        </div>
      </section>

      {/* Two-Tab Navigation Switcher */}
      <div className="container mx-auto px-4 max-w-5xl pt-10">
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#eef6f1] border border-[#dbe6de] shadow-2xs gap-1.5">
            <Link
              href="/about/board"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#526658] hover:text-[#122419] transition-all"
            >
              Board of Directors
            </Link>
            <Link
              href="/about/secretariat"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#1e7e48] text-white shadow-xs transition-all"
            >
              Secretariat
            </Link>
          </div>
        </div>

        {/* Personnel Grid */}
        <div className="pt-10">
          {sortedMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedMembers.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#dbe6de] p-8 max-w-md mx-auto">
              <p className="text-base font-semibold text-[#122419]">No secretariat profiles currently listed</p>
              <p className="text-xs text-[#526658] mt-1">Secretariat personnel records will appear here once added in the administrative portal.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
