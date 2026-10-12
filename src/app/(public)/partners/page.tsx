import Link from 'next/link'
import { ExternalLink, Handshake, Shield, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { constructMetadata } from '@/lib/utils/seo'

export const metadata = constructMetadata({
  title: 'Partners & Affiliations | Collaborating Institutions',
  description:
    'Explore the partner organizations, development partners, research entities, and farmer networks working alongside the Agricultural Consultative Forum (ACF) in Zambia.',
  pathname: '/partners',
})

export default async function PartnersPage() {
  const supabase = await createClient()

  const { data: partnersData } = await supabase
    .from('partners')
    .select('*')
    .eq('is_visible', true)
    .order('order_index', { ascending: true })

  const defaultPartners = [
    {
      id: '1',
      name: 'Ministry of Agriculture - Zambia',
      type: 'Collaborating Institution',
      description:
        'The primary governmental counterpart in national agricultural policy consultations, crop forecasts, and input support reviews.',
      website_url: 'https://www.agriculture.gov.zm',
    },
    {
      id: '2',
      name: 'Zambia National Farmers Union (ZNFU)',
      type: 'Partner',
      description:
        'Apex representative federation for smallholder, emergent, and large-scale commercial farming households in Zambia.',
      website_url: 'https://www.znfu.org.zm',
    },
    {
      id: '3',
      name: 'Indaba Agricultural Policy Research Institute (IAPRI)',
      type: 'Partner',
      description:
        'Premier collaborating research body undertaking rigorous empirical analyses of food security and rural economics.',
      website_url: 'https://www.iapri.org.zm',
    },
    {
      id: '4',
      name: 'International Land Coalition (ILC)',
      type: 'Network & Affiliation',
      description:
        'Global alliance collaborating with ACF on customary land tenure documentation and equitable women farmer rights.',
      website_url: 'https://www.landcoalition.org',
    },
    {
      id: '5',
      name: 'Grain Traders Association of Zambia',
      type: 'Partner',
      description:
        'Key agribusiness association collaborating on regional grain marketing, trade tariffs, and strategic storage mechanisms.',
      website_url: null,
    },
  ]

  const partners = partnersData && partnersData.length > 0 ? partnersData : defaultPartners

  // Group by partner type
  const types = ['Collaborating Institution', 'Partner', 'Network & Affiliation', 'Development Partner']

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#0f1d14] text-white py-16 lg:py-20 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#a3e635] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 inline-block">
            Collaborative Ecosystem
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Partners & Strategic Networks
          </h1>
          <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Working in concert with public agencies, farmer federations, research institutes, and development partners to advance Zambia&apos;s agricultural sector.
          </p>
        </div>
      </section>

      {/* Main Partners Listing */}
      <div className="container mx-auto px-4 max-w-5xl pt-16 space-y-16">
        {types.map((t) => {
          const group = partners.filter((p) => p.type === t)
          if (group.length === 0) return null

          return (
            <section key={t} className="space-y-6">
              <div className="border-b border-[#e2ebe4] pb-3 flex items-center gap-2">
                <Handshake size={20} className="text-[#175432]" />
                <h2 className="text-xl font-bold text-[#0f1d14]">{t}s</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group.map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-white rounded-2xl border border-[#e2ebe4] p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-bold text-[#0f1d14] leading-snug">
                          {partner.name}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#f0f6f1] text-[#175432] shrink-0">
                          {partner.type}
                        </span>
                      </div>

                      {partner.description && (
                        <p className="text-xs text-[#5c6f62] leading-relaxed">
                          {partner.description}
                        </p>
                      )}
                    </div>

                    {partner.website_url && (
                      <div className="pt-4 border-t border-[#e2ebe4] mt-4 flex items-center justify-end">
                        <a
                          href={partner.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#175432] hover:text-[#2da44e] transition-colors"
                        >
                          <span>Visit Website</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        })}

        {/* Partnership Enquiries CTA */}
        <section className="bg-[#175432] text-white p-8 sm:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-bold">Interested in Partnering with ACF?</h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-lg leading-relaxed">
              We welcome collaboration with agricultural research consortia, development partners, and commercial associations working toward sustainable agriculture.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3.5 bg-[#2da44e] hover:bg-[#34a853] text-[#0a140e] font-extrabold text-xs rounded-full shadow-md transition-colors shrink-0"
          >
            Contact Secretariat
          </Link>
        </section>
      </div>
    </div>
  )
}
