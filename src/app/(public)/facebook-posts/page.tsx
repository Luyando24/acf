import Link from 'next/link'
import { Calendar, ExternalLink, ArrowLeft } from 'lucide-react'
import { FacebookIcon } from '@/components/ui/SocialIcons'
import { getRecentFacebookPosts } from '@/lib/facebook'
import { constructMetadata } from '@/lib/utils/seo'
import { getSiteSettings } from '@/lib/supabase/settings'

export const metadata = constructMetadata({
  title: 'Social Media Highlights | ACF Facebook Feed',
  description:
    'Explore the latest Facebook posts, stakeholder updates, and policy dialogues from the Agricultural Consultative Forum (ACF) in Zambia.',
  pathname: '/facebook-posts',
})

export default async function FacebookPostsPage() {
  const [posts, settings] = await Promise.all([
    getRecentFacebookPosts(20),
    getSiteSettings(),
  ])

  const fbUrl = settings.facebook_url || 'https://facebook.com/ACFZambia'

  return (
    <div className="bg-[#f8faf8] min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-12 max-w-3xl">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-[#175432] hover:text-[#0f1d14] flex items-center gap-1.5 mb-4 group"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#175432] bg-[#f0f6f1] px-3 py-1 rounded-md">
              Social Stream
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f1d14] tracking-tight">
            Social Media Highlights
          </h1>
          <p className="text-[#5c6f62] text-base mt-2 leading-relaxed">
            Live updates, field workshops, stakeholder dialogues, and community stories directly from our Facebook page.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-[#e2ebe4] flex flex-col"
              >
                {post.full_picture && (
                  <div className="aspect-video w-full overflow-hidden bg-neutral-100">
                    <img
                      src={post.full_picture}
                      alt="Facebook Post"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="p-7 sm:p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center mr-3 shadow-xs text-white">
                        <FacebookIcon size={20} />
                      </div>
                      <span className="font-bold text-[#0f1d14] text-base">ACF Zambia</span>
                    </div>
                    <div className="flex items-center text-[#5c6f62] text-xs font-medium">
                      <Calendar size={15} className="mr-1.5 text-neutral-400" />
                      {new Date(post.created_time).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  <p className="text-[#3b4d41] text-sm mb-6 leading-relaxed line-clamp-4 font-normal">
                    {post.message || 'View ACF post on Facebook.'}
                  </p>

                  <a
                    href={post.permalink_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-3.5 px-6 rounded-full transition-all w-full shadow-md hover:shadow-lg"
                  >
                    <ExternalLink size={16} />
                    <span>View on Facebook</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#ccd9cf] p-8 max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center mx-auto">
              <FacebookIcon size={36} />
            </div>
            <h2 className="text-2xl font-bold text-[#0f1d14]">Connect with us on Facebook</h2>
            <p className="text-[#5c6f62] text-sm leading-relaxed">
              We couldn&apos;t load the latest posts at the moment. You can visit our official Facebook page directly to browse all recent updates.
            </p>
            <div className="pt-2">
              <a
                href={fbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-4 px-10 rounded-full transition-all shadow-md hover:scale-105"
              >
                <FacebookIcon size={20} />
                <span>Visit Our Facebook Page</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
