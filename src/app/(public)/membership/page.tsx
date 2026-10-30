import Link from 'next/link'
import { CheckCircle2, Users, Shield, ArrowRight, FileCheck, Layers } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { constructMetadata } from '@/lib/utils/seo'
import { getPageContent, MembershipPageContent } from '@/lib/supabase/pageContent'

export const metadata = constructMetadata({
  title: 'Membership & Stakeholder Caucuses | Overview & Benefits',
  description:
    'Join the Agricultural Consultative Forum (ACF). Discover membership categories, institutional benefits, eligibility criteria, and application procedures.',
  pathname: '/membership',
})

export default async function MembershipOverviewPage() {
  const supabase = await createClient()

  const [catRes, pageContent] = await Promise.all([
    supabase
      .from('membership_categories')
      .select('*')
      .order('order_index', { ascending: true }),
    getPageContent<MembershipPageContent>('membership'),
  ])

  const categories = catRes.data || []

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#153e28] text-white py-16 lg:py-20 border-b border-[#1e4a32]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white bg-white/15 px-3.5 py-1.5 rounded-full border border-white/20 inline-block">
            {pageContent?.header?.badge || 'Multi-Stakeholder Forum'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            {pageContent?.header?.title || 'ACF Membership Overview'}
          </h1>
          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {pageContent?.header?.description ||
              'Become an active voice in shaping national agricultural policies, market frameworks, and sustainable farming systems across Zambia.'}
          </p>

          <div className="pt-2">
            <Link
              href="/membership/apply"
              className="px-8 py-3.5 bg-[#2e9e5b] hover:bg-[#268a4e] text-white font-extrabold text-sm rounded-full transition-all inline-flex items-center gap-2 shadow-lg shadow-[#153e28]/25"
            >
              <span>Apply for Membership</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-5xl pt-16 space-y-16">
        {/* Core Value Proposition Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {(pageContent?.why_join?.benefits || []).map((b, idx) => {
            const icons = [Users, Shield, FileCheck, Layers]
            const Icon = icons[idx % icons.length]
            return (
              <div
                key={b.title}
                className="bg-white p-6 rounded-2xl border border-[#dbe6de] shadow-xs space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#eef6f1] text-[#1e7e48] flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-[#122419] text-base">{b.title}</h3>
                <p className="text-xs text-[#526658] leading-relaxed">{b.description}</p>
              </div>
            )
          })}
        </section>

        {/* Categories & Criteria */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-[#122419] tracking-tight">
              Membership Categories & Requirements
            </h2>
            <p className="text-sm text-[#526658] mt-1">
              Select the appropriate caucus for your organization.
            </p>
          </div>

          <div className="space-y-8">
            {categories.length > 0 ? (
              categories.map((cat: any) => (
                <div
                  key={cat.name}
                  className="bg-white rounded-3xl border border-[#dbe6de] p-8 shadow-xs space-y-6"
                >
                  <div className="border-b border-[#dbe6de] pb-4">
                    <h3 className="text-2xl font-bold text-[#122419]">{cat.name}</h3>
                    <p className="text-sm text-[#526658] mt-1">{cat.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Benefits */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#1e7e48] mb-3">
                        Key Member Benefits
                      </h4>
                      <ul className="space-y-2.5">
                        {((cat.benefits as string[]) || []).map((b, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-[#2d3f33] leading-relaxed">
                            <CheckCircle2 size={15} className="text-[#1e7e48] shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#122419] mb-3">
                        Eligibility & Requirements
                      </h4>
                      <ul className="space-y-2.5">
                        {((cat.requirements as string[]) || []).map((r, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-[#526658] leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1e7e48] shrink-0 mt-1.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Link
                      href={`/membership/apply?category=${encodeURIComponent(cat.id || '')}`}
                      className="px-6 py-2.5 bg-[#1e7e48] hover:bg-[#166538] text-white font-bold text-xs rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Apply for this Category</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#dbe6de] p-8 max-w-md mx-auto">
                <p className="text-base font-semibold text-[#122419]">No membership categories configured</p>
                <p className="text-xs text-[#526658] mt-1">Categories configured in the administrative portal will appear here.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
