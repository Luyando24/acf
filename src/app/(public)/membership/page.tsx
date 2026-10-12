import Link from 'next/link'
import { CheckCircle2, Users, Shield, ArrowRight, FileCheck, Layers } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { constructMetadata } from '@/lib/utils/seo'

export const metadata = constructMetadata({
  title: 'Membership & Stakeholder Caucuses | Overview & Benefits',
  description:
    'Join the Agricultural Consultative Forum (ACF). Discover membership categories, institutional benefits, eligibility criteria, and application procedures.',
  pathname: '/membership',
})

export default async function MembershipOverviewPage() {
  const supabase = await createClient()

  const { data: catData } = await supabase
    .from('membership_categories')
    .select('*')
    .order('order_index', { ascending: true })

  const defaultCategories = [
    {
      id: '1',
      name: 'Agricultural Producer Associations & Cooperatives',
      description:
        'For registered farmer cooperatives, smallholder unions, and agricultural commodity associations.',
      benefits: [
        'Direct representation in high-level national policy consultative roundtables',
        'Early access to research publications and market analysis briefs',
        'Inclusion in multi-stakeholder dialogue working groups on input subsidies and grain pricing',
        'Voting rights in stakeholder advisory caucuses',
      ],
      requirements: [
        'Legally registered cooperative or association in Zambia',
        'Demonstrated active membership base of farmers or rural producers',
        'Commitment to transparent and participatory representation',
      ],
    },
    {
      id: '2',
      name: 'Agri-Business & Private Sector Enterprises',
      description:
        'For input distributors, grain traders, processors, logistics companies, and agricultural financial lenders.',
      benefits: [
        'Direct engagement with senior policymakers on trade tariffs, export policies, and regulations',
        'B2B networking across the entire Zambian agricultural ecosystem',
        'Contribution to joint private sector position papers presented to government',
        'Listing in the official ACF Agricultural Stakeholder Directory',
      ],
      requirements: [
        'PACRA-registered business entity operating in Zambia',
        'Active commercial operations in agriculture or allied agribusiness value chains',
        'Adherence to ethical commercial practices and environmental standards',
      ],
    },
    {
      id: '3',
      name: 'Research Institutes & Academic Entities',
      description:
        'For universities, agricultural research centres, policy think tanks, and training colleges.',
      benefits: [
        'Collaborative research opportunities on national policy agendas',
        'Direct channels to disseminate scientific findings to senior policymakers',
        'Co-hosting national agricultural symposiums and technical conferences',
      ],
      requirements: [
        'Accredited higher learning or registered research institution',
        'Active research portfolio in agronomy, agricultural economics, or rural development',
      ],
    },
  ]

  const categories = catData && catData.length > 0 ? catData : defaultCategories

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#0f1d14] text-white py-16 lg:py-20 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#a3e635] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 inline-block">
            Multi-Stakeholder Forum
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            ACF Membership Overview
          </h1>
          <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Become an active voice in shaping national agricultural policies, market frameworks, and sustainable farming systems across Zambia.
          </p>

          <div className="pt-2">
            <Link
              href="/membership/apply"
              className="px-8 py-3.5 bg-[#2da44e] hover:bg-[#34a853] text-[#0a140e] font-extrabold text-sm rounded-full transition-all inline-flex items-center gap-2 shadow-lg shadow-[#2da44e]/20"
            >
              <span>Apply for Membership Online</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-5xl pt-16 space-y-16">
        {/* Why Join Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-[#e2ebe4] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#f0f6f1] text-[#175432] flex items-center justify-center">
              <Users size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#0f1d14]">Policy Influence</h2>
            <p className="text-xs text-[#5c6f62] leading-relaxed">
              Participate directly in consultations with the Ministry of Agriculture and parliamentary standing committees on key legislative bills.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2ebe4] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#f0f6f1] text-[#175432] flex items-center justify-center">
              <FileCheck size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#0f1d14]">Credible Evidence</h2>
            <p className="text-xs text-[#5c6f62] leading-relaxed">
              Gain verified empirical data, market reports, and policy briefs to inform your institutional strategies and commercial investments.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2ebe4] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#f0f6f1] text-[#175432] flex items-center justify-center">
              <Shield size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#0f1d14]">Collaborative Network</h2>
            <p className="text-xs text-[#5c6f62] leading-relaxed">
              Connect across our network spanning farmer federations, agro-dealers, grain traders, academic researchers, and donor working groups.
            </p>
          </div>
        </section>

        {/* Categories & Criteria */}
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0f1d14] tracking-tight">
              Membership Categories & Requirements
            </h2>
            <p className="text-sm text-[#5c6f62] mt-1">
              Select the appropriate caucus for your organization.
            </p>
          </div>

          <div className="space-y-8">
            {categories.map((cat: any) => (
              <div
                key={cat.name}
                className="bg-white rounded-3xl border border-[#e2ebe4] p-8 shadow-xs space-y-6"
              >
                <div className="border-b border-[#e2ebe4] pb-4">
                  <h3 className="text-2xl font-bold text-[#0f1d14]">{cat.name}</h3>
                  <p className="text-sm text-[#5c6f62] mt-1">{cat.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Benefits */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#175432] mb-3">
                      Key Member Benefits
                    </h4>
                    <ul className="space-y-2.5">
                      {(cat.benefits as string[]).map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[#3b4d41] leading-relaxed">
                          <CheckCircle2 size={15} className="text-[#2da44e] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#0f1d14] mb-3">
                      Eligibility & Requirements
                    </h4>
                    <ul className="space-y-2.5">
                      {(cat.requirements as string[]).map((r, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[#5c6f62] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#175432] shrink-0 mt-1.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Link
                    href={`/membership/apply?category=${encodeURIComponent(cat.id || '')}`}
                    className="px-6 py-2.5 bg-[#175432] hover:bg-[#114227] text-white font-bold text-xs rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Apply for this Category</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
