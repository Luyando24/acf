import TopBar from '@/components/layout/TopBar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getSiteSettings } from '@/lib/supabase/settings'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] text-[#142018]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-[#175432] focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:font-semibold"
      >
        Skip to main content
      </a>
      <TopBar settings={settings} />
      <Header settings={settings} />
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer settings={settings} />
    </div>
  )
}
