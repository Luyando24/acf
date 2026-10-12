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
      <TopBar settings={settings} />
      <Header />
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer settings={settings} />
    </div>
  )
}
