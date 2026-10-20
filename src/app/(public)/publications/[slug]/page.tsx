import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Download, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatFileSize } from '@/lib/utils/formatters'
import { constructMetadata } from '@/lib/utils/seo'

interface PublicationDetailProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PublicationDetailProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: pub } = await supabase
    .from('publications')
    .select('title, summary')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  const pubItem = pub as any
  if (!pubItem) {
    return constructMetadata({ title: 'Publication' })
  }

  return constructMetadata({
    title: `${pubItem.title} | Publications`,
    description: pubItem.summary,
    pathname: `/publications/${slug}`,
  })
}

export default async function PublicationDetailPage({ params }: PublicationDetailProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: rawPub } = await supabase
    .from('publications')
    .select('*, publication_categories(name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!rawPub) {
    notFound()
  }

  const pub = rawPub as any

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#0f1d14] text-white py-16 border-b border-[#1b3424]">
        <div className="container mx-auto px-4 max-w-4xl space-y-4">
          <Link
            href="/publications"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Publications</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1e462f] text-[#a3e635] border border-[#2da44e]/40">
              {(pub.publication_categories as any)?.name || 'Policy Brief'}
            </span>
            <span className="text-xs text-emerald-200/70">
              Published on {formatDate(pub.published_on)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {pub.title}
          </h1>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 max-w-4xl pt-12 space-y-8">
        <div className="bg-white rounded-3xl border border-[#e2ebe4] p-8 sm:p-12 shadow-xs space-y-8">
          <div>
            <h2 className="text-xl font-bold text-[#0f1d14] mb-3">Executive Summary & Overview</h2>
            <p className="text-base sm:text-lg text-[#3b4d41] leading-relaxed">
              {pub.summary}
            </p>
          </div>

          {/* Download & File Info Box */}
          <div className="p-8 rounded-2xl bg-[#f0f6f1] border border-[#d2e3d6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0f1d14]">
                <FileText size={18} className="text-[#175432]" />
                <span>Download Policy Document</span>
              </div>
              <p className="text-xs text-[#5c6f62]">
                {pub.file_size ? `${formatFileSize(pub.file_size)} • ` : ''}Official PDF Publication
              </p>
            </div>

            <a
              href={pub.file_path || '#'}
              download
              className="w-full sm:w-auto px-8 py-3.5 bg-[#175432] hover:bg-[#114227] text-white font-bold text-xs rounded-full shadow-md flex items-center justify-center gap-2 transition-colors shrink-0"
            >
              <Download size={15} />
              <span>Download PDF</span>
            </a>
          </div>

          <div className="pt-6 border-t border-[#e2ebe4] flex items-center justify-between text-xs text-[#5c6f62]">
            <span>Downloads: {pub.download_count || 0} times</span>
            <span>Agricultural Consultative Forum Policy Series</span>
          </div>
        </div>
      </div>
    </div>
  )
}
