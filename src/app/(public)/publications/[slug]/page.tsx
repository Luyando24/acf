import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Download, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatFileSize } from '@/lib/utils/formatters'
import { constructMetadata } from '@/lib/utils/seo'
import { isServableDocumentPath } from '@/lib/uploads/policy'

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
  const canDownload = isServableDocumentPath(pub.file_path || '')

  return (
    <div className="bg-[#fdfdfd] pb-24">
      {/* Header Banner */}
      <section className="bg-[#153e28] text-white py-16 border-b border-[#1e4a32]">
        <div className="container mx-auto px-4 max-w-4xl space-y-4">
          <Link
            href="/publications"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Publications</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-white border border-white/20">
              {(pub.publication_categories as any)?.name || 'Policy Brief'}
            </span>
            <span className="text-xs text-emerald-100/80">
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
        <div className="bg-white rounded-3xl border border-[#dbe6de] p-8 sm:p-12 shadow-xs space-y-8">
          <div>
            <h2 className="text-xl font-bold text-[#122419] mb-3">Executive Summary & Overview</h2>
            <p className="text-base sm:text-lg text-[#2d3f33] leading-relaxed">
              {pub.summary}
            </p>
          </div>

          {/* Download & File Info Box */}
          <div className="p-8 rounded-2xl bg-[#eef6f1] border border-[#dbe6de] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold text-[#122419]">
                <FileText size={18} className="text-[#1e7e48]" />
                <span>Download Policy Document</span>
              </div>
              <p className="text-xs text-[#526658]">
                {canDownload
                  ? `${pub.file_size ? `${formatFileSize(pub.file_size)} • ` : ''}Official PDF Publication`
                  : 'The document file has not been uploaded yet.'}
              </p>
            </div>

            {canDownload ? (
              <a
                href={`/api/publications/${encodeURIComponent(pub.slug)}/download`}
                download
                className="w-full sm:w-auto px-8 py-3.5 bg-[#1e7e48] hover:bg-[#166538] text-white font-bold text-xs rounded-full shadow-md flex items-center justify-center gap-2 transition-colors shrink-0"
              >
                <Download size={15} />
                <span>Download PDF</span>
              </a>
            ) : (
              <span className="w-full sm:w-auto px-8 py-3.5 bg-[#e8ede9] text-[#7a8b80] font-bold text-xs rounded-full flex items-center justify-center gap-2 shrink-0 cursor-not-allowed">
                <Download size={15} />
                <span>Document Pending Upload</span>
              </span>
            )}
          </div>

          <div className="pt-6 border-t border-[#dbe6de] flex items-center justify-between text-xs text-[#526658]">
            <span>Downloads: {pub.download_count || 0} times</span>
            <span>Agricultural Consultative Forum Policy Series</span>
          </div>
        </div>
      </div>
    </div>
  )
}
