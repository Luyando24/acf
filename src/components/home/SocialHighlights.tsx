import Link from 'next/link'
import { Calendar, ArrowUpRight } from 'lucide-react'
import { FacebookIcon } from '@/components/ui/SocialIcons'
import { getRecentFacebookPosts } from '@/lib/facebook'

interface SocialHighlightsProps {
  facebookUrl?: string
}

export default async function SocialHighlights({ facebookUrl = 'https://facebook.com/ACFZambia' }: SocialHighlightsProps) {
  const posts = await getRecentFacebookPosts(3)

  return (
    <section className="py-20 bg-[#fbfdfb] border-t border-[#e2ebe4]" aria-label="Social Media Highlights">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#175432] bg-[#f0f6f1] px-3 py-1 rounded-md inline-block mb-3">
              Live Feed
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#122419] tracking-tight">
              Social Media Highlights
            </h2>
            <p className="text-[#526658] text-sm sm:text-base mt-1.5 max-w-xl">
              Stay connected with our day-to-day stakeholder convenings, policy roundtables, and community updates on Facebook.
            </p>
          </div>

          <Link
            href="/facebook-posts"
            className="text-[#1e7e48] hover:text-[#122419] font-bold text-sm flex items-center gap-2 group transition-colors shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center transition-transform group-hover:scale-110">
              <FacebookIcon size={16} />
            </div>
            <span className="hover:underline">All Highlights</span>
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.permalink_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-[#dbe6de] flex flex-col hover:-translate-y-1"
              >
                {post.full_picture && (
                  <div className="aspect-video w-full overflow-hidden bg-neutral-100">
                    <img
                      src={post.full_picture}
                      alt="ACF Facebook Update"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center mr-3 shadow-xs text-white">
                        <FacebookIcon size={16} />
                      </div>
                      <span className="font-bold text-sm text-[#122419]">ACF Zambia</span>
                    </div>
                    <div className="flex items-center text-[#526658] text-xs">
                      <Calendar size={14} className="mr-1" />
                      {new Date(post.created_time).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  <p className="text-[#2d3f33] text-sm mb-6 line-clamp-4 leading-relaxed font-normal">
                    {post.message || 'View ACF update on Facebook.'}
                  </p>

                  <div className="mt-auto text-[#1e7e48] group-hover:text-[#166538] text-xs font-bold flex items-center gap-1 group-hover:underline pt-2">
                    <span>View on Facebook</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#ccd9cf] p-8 max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center mx-auto">
              <FacebookIcon size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#122419]">Connect with ACF on Facebook</h3>
            <p className="text-[#526658] text-sm leading-relaxed max-w-md mx-auto">
              Follow our official Facebook page for the latest announcements, workshop galleries, and live dialogue coverage.
            </p>
            <div className="pt-2">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-3 px-8 rounded-full transition-all shadow-md hover:scale-105"
              >
                <FacebookIcon size={18} />
                <span>Visit Our Facebook Page</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
