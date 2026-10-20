import { notFound } from 'next/navigation'
import { getPageContent } from '@/lib/supabase/pageContent'
import HomeSectionEditor from '@/components/admin/pages/HomeSectionEditor'
import AboutSectionEditor from '@/components/admin/pages/AboutSectionEditor'
import ContactSectionEditor from '@/components/admin/pages/ContactSectionEditor'
import MembershipSectionEditor from '@/components/admin/pages/MembershipSectionEditor'

interface AdminPageSlugProps {
  params: Promise<{ slug: string }>
}

const VALID_SLUGS = ['home', 'about', 'contact', 'membership']

export default async function AdminPageSlugEditor({ params }: AdminPageSlugProps) {
  const { slug } = await params

  if (!VALID_SLUGS.includes(slug)) {
    notFound()
  }

  const initialContent = await getPageContent<any>(slug)

  if (slug === 'home') {
    return <HomeSectionEditor initialContent={initialContent} />
  }

  if (slug === 'about') {
    return <AboutSectionEditor initialContent={initialContent} />
  }

  if (slug === 'contact') {
    return <ContactSectionEditor initialContent={initialContent} />
  }

  if (slug === 'membership') {
    return <MembershipSectionEditor initialContent={initialContent} />
  }

  notFound()
}
