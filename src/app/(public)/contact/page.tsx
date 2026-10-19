import { constructMetadata } from '@/lib/utils/seo'
import { getPageContent, ContactPageContent } from '@/lib/supabase/pageContent'
import ContactClientView from '@/components/contact/ContactClientView'

export const metadata = constructMetadata({
  title: 'Contact Secretariat | Location, Direct Phone Lines & Inquiries',
  description:
    'Contact the Agricultural Consultative Forum (ACF) secretariat in Woodlands, Lusaka. Reach our policy advocacy and research teams directly.',
  pathname: '/contact',
})

export default async function ContactPage() {
  const content = await getPageContent<ContactPageContent>('contact')

  return <ContactClientView initialContent={content} />
}
