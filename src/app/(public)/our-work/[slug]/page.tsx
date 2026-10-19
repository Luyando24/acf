import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Calendar, FileText, Scale, ArrowRight, Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/formatters'
import { constructMetadata } from '@/lib/utils/seo'

interface ProgrammePageProps {
  params: Promise<{ slug: string }>
}

const DEMO_PROGRAMMES: Record<
  string,
  {
    id: string
    slug: string
    title: string
    summary: string
    body: string
  }
> = {
  'policy-advocacy': {
    id: '22222222-2222-2222-2222-222222222201',
    slug: 'policy-advocacy',
    title: 'Agricultural Policy Advocacy',
    summary:
      'Mobilising multi-stakeholder consultations and evidence to influence national agricultural policy formulation and implementation in Zambia.',
    body: `
      <p>The Agricultural Consultative Forum (ACF) facilitates high-level policy advocacy that connects grassroots smallholder farmer experiences with national policymakers in Lusaka.</p>
      <p>Our advocacy actions include regular policy roundtables with the Ministry of Agriculture, parliamentary committee submissions on national budget allocations, and technical dialogue with cooperating donor agencies.</p>
      <h3>Strategic Focus Areas</h3>
      <ul>
        <li>Monitoring and reform of public agricultural subsidies and electronic voucher distribution</li>
        <li>Promoting transparent, predictable agricultural trade and grain export regulations</li>
        <li>Enhancing public expenditure quality toward extension services and rural infrastructure</li>
      </ul>
    `,
  },
  'research-and-evidence': {
    id: '22222222-2222-2222-2222-222222222202',
    slug: 'research-and-evidence',
    title: 'Research & Evidence Generation',
    summary:
      'Generating credible empirical data, analytical briefs, and sector performance reviews to guide agricultural investments.',
    body: `
      <p>ACF believes that sound policy starts with rigorous, unbiased evidence. We conduct and commission targeted empirical analyses to evaluate sector interventions, commodity pricing trends, and input subsidy effectiveness in Zambia.</p>
      <p>Working alongside premier agricultural research bodies like IAPRI and the University of Zambia, ACF translates complex analytical findings into accessible policy advisory briefs for legislators, farming associations, and agribusinesses.</p>
      <h3>Key Research Priorities</h3>
      <ul>
        <li>Annual agricultural budget reviews and tracking of public resource expenditure</li>
        <li>Assessment of post-harvest loss reduction technologies and storage economics</li>
        <li>Impact assessments of electronic voucher programmes on smallholder productivity</li>
        <li>Regional commodity market integration and trade corridor competitiveness</li>
      </ul>
    `,
  },
  'climate-resilience': {
    id: '22222222-2222-2222-2222-222222222203',
    slug: 'climate-resilience',
    title: 'Climate Resilience & Sustainable Systems',
    summary:
      'Advocating for climate-smart agriculture, soil health conservation, and resilient rural farming systems in Zambia.',
    body: `
      <p>With increasing climate variability, erratic rainfall, and recurring drought cycles confronting Zambian farming communities, ACF champions comprehensive policy frameworks that support climate-smart agriculture (CSA).</p>
      <p>Our initiatives bridge scientific climate projections with practical farmer adaptation mechanisms, promoting sustainable land and water management across vulnerable agricultural districts.</p>
      <h3>Key Pillars of Intervention</h3>
      <ul>
        <li>Accelerating adoption of drought-tolerant and early-maturing crop varieties</li>
        <li>Expanding small-scale community irrigation systems and solar water harvesting</li>
        <li>Promotion of conservation agriculture techniques, minimum tillage, and organic mulch cover</li>
        <li>Scaling weather-index crop and livestock insurance mechanisms for smallholders</li>
      </ul>
    `,
  },
  'multi-stakeholder-dialogue': {
    id: '22222222-2222-2222-2222-222222222204',
    slug: 'multi-stakeholder-dialogue',
    title: 'Multi-Stakeholder Dialogue',
    summary:
      'Providing a neutral, inclusive convening platform where government, agribusiness, donors, and smallholder farmer groups collaborate.',
    body: `
      <p>ACF serves as the premier neutral platform in Zambia where diverse agricultural stakeholders meet to resolve contentious policy bottlenecks and foster consensus.</p>
      <p>By bringing together civil society, farmer unions, commercial agribusiness federations, and senior government officials, we ensure that agricultural policies reflect broad-based consensus rather than narrow interest groups.</p>
      <h3>Our Dialogue Platforms</h3>
      <ul>
        <li>Quarterly National Agricultural Consultative Roundtables</li>
        <li>Commodity-specific working groups (Maize, Soya, Livestock, Horticulture)</li>
        <li>Pre-budget stakeholder consultative submissions to the Ministry of Finance</li>
        <li>Annual Agricultural Policy Symposium</li>
      </ul>
    `,
  },
  'land-rights-tenure': {
    id: '22222222-2222-2222-2222-222222222205',
    slug: 'land-rights-tenure',
    title: "Land Tenure & Women's Rights",
    summary:
      'Advocating for secure customary land tenure and equal rights for women and small-scale farming households.',
    body: `
      <p>Secure land rights are fundamental to agricultural investment and rural prosperity. ACF works with traditional leaders, local councils, and government ministries to promote transparent customary land governance.</p>
      <p>Special focus is placed on eliminating barriers that prevent women smallholder farmers from securing documented tenure over the lands they cultivate.</p>
      <h3>Key Initiatives</h3>
      <ul>
        <li>Customary land documentation and boundary dispute resolution mechanisms</li>
        <li>Advocacy for gender-equitable land allocation guidelines in chiefdoms</li>
        <li>Technical inputs into national land policy and land tenure legislative reviews</li>
      </ul>
    `,
  },
}

export async function generateMetadata({ params }: ProgrammePageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: prog } = await supabase
    .from('programmes')
    .select('title, summary')
    .eq('slug', slug)
    .single()

  const fallback = DEMO_PROGRAMMES[slug]
  const progItem = (prog as any) || fallback
  if (!progItem) {
    return constructMetadata({ title: 'Programme Detail' })
  }

  return constructMetadata({
    title: `${progItem.title} | Our Work`,
    description: progItem.summary,
    pathname: `/our-work/${slug}`,
  })
}

export default async function ProgrammeDetailPage({ params }: ProgrammePageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: progData } = await supabase
    .from('programmes')
    .select('*')
    .eq('slug', slug)
    .single()

  // Fallback demo data if database table is not yet populated
  const prog = progData || DEMO_PROGRAMMES[slug]

  if (!prog) {
    notFound()
  }

  // Fetch related publications
  const { data: relatedPubsData } = await supabase
    .from('publications')
    .select('*, publication_categories(name)')
    .eq('status', 'published')
    .limit(3)
  const relatedPubs = relatedPubsData as any[] | null

  // Fetch related news
  const { data: relatedNewsData } = await supabase
    .from('news_posts')
    .select('*')
    .eq('status', 'published')
    .limit(2)
  const relatedNews = relatedNewsData as any[] | null

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#0f1d14] text-white py-16 lg:py-20 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl space-y-4">
          <Link
            href="/our-work"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Programmes</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {prog.title}
          </h1>

          <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed max-w-3xl">
            {prog.summary}
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-5xl pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Body (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#e2ebe4] shadow-xs">
              <div
                className="prose-acf"
                dangerouslySetInnerHTML={{ __html: prog.body }}
              />
            </div>

            {/* Related Publications */}
            {relatedPubs && relatedPubs.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#0f1d14]">
                    Related Research & Policy Briefs
                  </h2>
                  <Link
                    href="/publications"
                    className="text-xs font-bold text-[#175432] hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {relatedPubs.map((pub) => (
                    <div
                      key={pub.id}
                      className="bg-white p-5 rounded-2xl border border-[#e2ebe4] shadow-xs flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#175432] bg-[#f0f6f1] px-2 py-0.5 rounded">
                          {(pub.publication_categories as any)?.name || 'Brief'}
                        </span>
                        <h3 className="text-sm font-bold text-[#0f1d14] hover:text-[#175432] transition-colors">
                          <Link href={`/publications/${pub.slug}`}>{pub.title}</Link>
                        </h3>
                        <div className="text-[11px] text-[#5c6f62]">
                          Published {formatDate(pub.published_on)}
                        </div>
                      </div>

                      <Link
                        href={`/publications/${pub.slug}`}
                        className="px-3.5 py-1.5 rounded-lg bg-[#f0f6f1] text-[#175432] hover:bg-[#175432] hover:text-white transition-colors text-xs font-bold flex items-center gap-1 shrink-0"
                      >
                        <Download size={13} />
                        <span>PDF</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA & Related (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#175432] text-white p-6 rounded-3xl shadow-lg border border-[#2da44e]/30 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a3e635]">
                Get Involved
              </span>
              <h3 className="text-lg font-bold leading-tight">
                Participate in Policy Roundtables
              </h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Connect with our thematic working groups and register your organization for upcoming stakeholder dialogue sessions.
              </p>
              <Link
                href="/membership/apply"
                className="block text-center py-2.5 px-4 bg-[#2da44e] hover:bg-[#34a853] text-[#0a140e] font-extrabold text-xs rounded-xl shadow-md transition-colors"
              >
                Join Stakeholder Caucus
              </Link>
            </div>

            {relatedNews && relatedNews.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0f1d14]">
                  Recent Programme News
                </h3>
                <div className="space-y-3">
                  {relatedNews.map((news) => (
                    <div key={news.id} className="border-b border-[#e2ebe4] pb-3 last:border-0 last:pb-0">
                      <div className="text-[11px] text-[#5c6f62]">
                        {formatDate(news.published_at)}
                      </div>
                      <h4 className="text-xs font-bold text-[#0f1d14] hover:text-[#175432] transition-colors mt-0.5">
                        <Link href={`/news/${news.slug}`}>{news.title}</Link>
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
