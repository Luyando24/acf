import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, AlertCircle, Mail, Globe, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate, isOpportunityClosed } from '@/lib/utils/formatters'
import { constructMetadata } from '@/lib/utils/seo'

interface OpportunityDetailProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: OpportunityDetailProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: opp } = await supabase
    .from('opportunities')
    .select('title, description')
    .eq('slug', slug)
    .single()

  const oppItem = opp as any
  if (!oppItem) {
    return constructMetadata({ title: 'Opportunity' })
  }

  return constructMetadata({
    title: `${oppItem.title} | Opportunities`,
    description: oppItem.description,
    pathname: `/opportunities/${slug}`,
  })
}

export default async function OpportunityDetailPage({ params }: OpportunityDetailProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: oppData } = await supabase
    .from('opportunities')
    .select('*')
    .eq('slug', slug)
    .single()

  const opp =
    oppData ||
    (slug === 'consultancy-agricultural-policy-analyst'
      ? {
          id: '66666666-6666-6666-6666-666666666601',
          slug: 'consultancy-agricultural-policy-analyst',
          title: 'Senior Agricultural Policy Consultant',
          type: 'Consultancy',
          description:
            'ACF seeks a qualified Agricultural Economist or Policy Analyst to lead an independent study on Zambian agricultural value chain competitiveness.',
          opens_on: '2026-03-01',
          closes_on: '2026-11-30',
          application_instructions:
            'Interested qualified candidates should submit: (1) A comprehensive technical and financial proposal, (2) Detailed CV highlighting previous agricultural policy assignments in Zambia, and (3) Three professional references.',
          apply_url: null,
          contact_info: 'opportunities@acfzambia.org',
          status: 'published',
        }
      : null)

  if (!opp) {
    notFound()
  }

  const isClosed = isOpportunityClosed(opp.closes_on)

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#0f1d14] text-white py-16 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl space-y-4">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Opportunities</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1e462f] text-[#a3e635] border border-[#2da44e]/40">
              {opp.type}
            </span>

            {isClosed ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <AlertCircle size={13} />
                <span>Closed / Expired</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                <span>Accepting Applications</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {opp.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200/80 pt-1">
            <span>Opened: {formatDate(opp.opens_on)}</span>
            <span>•</span>
            <span className="font-bold text-[#a3e635]">
              Closing Deadline: {formatDate(opp.closes_on)} (CAT)
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-4xl pt-16 space-y-8">
        {/* Closed Alert Notice */}
        {isClosed && (
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-4">
            <AlertCircle size={22} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">Notice: This Opportunity is Closed</h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                The deadline for this opportunity was {formatDate(opp.closes_on)}. The Agricultural Consultative Forum is no longer accepting applications or bids for this notice.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-[#e2ebe4] p-8 sm:p-12 shadow-xs space-y-8">
          <div>
            <h2 className="text-xl font-bold text-[#0f1d14] mb-3">Overview & Terms of Reference</h2>
            <p className="text-base sm:text-lg text-[#3b4d41] leading-relaxed whitespace-pre-line">
              {opp.description}
            </p>
          </div>

          {opp.application_instructions && (
            <div className="pt-6 border-t border-[#e2ebe4]">
              <h3 className="text-lg font-bold text-[#0f1d14] mb-3">
                Application Instructions & Submission Requirements
              </h3>
              <p className="text-sm text-[#5c6f62] leading-relaxed whitespace-pre-line">
                {opp.application_instructions}
              </p>
            </div>
          )}

          {/* Submission CTA Box */}
          {!isClosed && (
            <div className="p-6 rounded-2xl bg-[#f6f9f6] border border-[#e2ebe4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[#0f1d14]">Ready to Submit?</h4>
                <p className="text-xs text-[#5c6f62]">
                  Send your proposal or CV to the secretariat before the closing deadline.
                </p>
              </div>

              {opp.apply_url ? (
                <a
                  href={opp.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#175432] hover:bg-[#114227] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors shrink-0"
                >
                  <Globe size={15} />
                  <span>External Application Portal</span>
                </a>
              ) : (
                <a
                  href={`mailto:${opp.contact_info || 'opportunities@acfzambia.org'}?subject=Application: ${encodeURIComponent(opp.title)}`}
                  className="px-6 py-3 bg-[#175432] hover:bg-[#114227] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors shrink-0"
                >
                  <Mail size={15} />
                  <span>Submit via Email</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
