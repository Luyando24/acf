import Link from 'next/link'
import { ExternalLink, Handshake } from 'lucide-react'
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

  const PARTNER_LOGOS: Record<string, string> = {
    'Ministry of Agriculture': '/partners/ministry-of-agriculture.svg',
    'Ministry of Agriculture - Zambia': '/partners/ministry-of-agriculture.svg',
    'Zambia National Farmers Union (ZNFU)': '/partners/znfu.svg',
    'Indaba Agricultural Policy Research Institute (IAPRI)': '/partners/iapri.svg',
    'International Land Coalition (ILC)': '/partners/ilc.svg',
    'Grain Traders Association of Zambia': '/partners/gtaz.svg',
    'Food and Agriculture Organization (FAO)': '/partners/fao.svg',
  }

  const partners = (partnersData || []) as any[]

  // Group by partner type
  const types = ['Collaborating Institution', 'Partner', 'Network & Affiliation', 'Development Partner']

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#153e28] text-white py-16 lg:py-20 border-b border-[#1e4a32]">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white bg-white/15 px-3.5 py-1.5 rounded-full border border-white/20 inline-block">
            Collaborative Ecosystem
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Partners & Strategic Networks
          </h1>
          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Working in concert with public agencies, farmer federations, research institutes, and development partners to advance Zambia&apos;s agricultural sector.
          </p>
        </div>
      </section>

      {/* Main Partners Listing */}
      <div className="container mx-auto px-4 max-w-5xl pt-16 space-y-16">
        {partners.length > 0 ? (
          types.map((t) => {
            const group = partners.filter((p) => p.type === t)
            if (group.length === 0) return null

            return (
              <section key={t} className="space-y-6">
                <div className="border-b border-[#dbe6de] pb-3 flex items-center gap-2">
                  <Handshake size={20} className="text-[#1e7e48]" />
                  <h2 className="text-xl font-bold text-[#122419]">{t}s</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {group.map((partner) => {
                    const logoSrc = partner.logo_url || PARTNER_LOGOS[partner.name] || '/photos/logo.png'
                    return (
                      <div
                        key={partner.id}
                        className="bg-white rounded-2xl border border-[#dbe6de] p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-[#dbe6de] p-2.5 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={logoSrc}
                                alt={`${partner.name} logo`}
                                className="w-full h-full object-contain"
                                loading="lazy"
                              />
                            </div>
                            <div className="space-y-1 flex-1 min-w-0">
                              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#eef6f1] text-[#1e7e48] inline-block">
                                {partner.type}
                              </span>
                              <h3 className="text-lg font-bold text-[#122419] leading-snug">
                                {partner.name}
                              </h3>
                            </div>
                          </div>

                          {partner.description && (
                            <p className="text-xs text-[#526658] leading-relaxed">
                              {partner.description}
                            </p>
                          )}
                        </div>

                        {partner.website_url && (
                          <div className="pt-4 border-t border-[#dbe6de] mt-4 flex items-center justify-end">
                            <a
                              href={partner.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e7e48] hover:text-[#166538] transition-colors"
                            >
                              <span>Visit Website</span>
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#dbe6de] p-8 max-w-md mx-auto">
            <p className="text-base font-semibold text-[#122419]">No partners currently listed</p>
            <p className="text-xs text-[#526658] mt-1">Partner and network listings will appear here once added in the administrative portal.</p>
          </div>
        )}

        {/* Partnership Enquiries CTA */}
        <section className="bg-[#153e28] text-white p-8 sm:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-bold">Interested in Partnering with ACF?</h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg leading-relaxed">
              We welcome collaboration with agricultural research consortia, development partners, and commercial associations working toward sustainable agriculture.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3.5 bg-[#2e9e5b] hover:bg-[#268a4e] text-white font-extrabold text-xs rounded-full shadow-md transition-colors shrink-0"
          >
            Contact Secretariat
          </Link>
        </section>
      </div>
    </div>
  )
}
