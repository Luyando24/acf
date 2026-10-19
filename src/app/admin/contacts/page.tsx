import { createClient } from '@/lib/supabase/server'
import ContactManager, { ContactMessageItem } from '@/components/admin/ContactManager'

export default async function AdminContactsPage() {
  const supabase = await createClient()

  const { data: messagesData } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  const defaultMessages: ContactMessageItem[] = [
    {
      id: '99999999-9999-9999-9999-999999999901',
      name: 'Dr. Kabwe Silwimba',
      email: 'ksilwimba@unza.zm',
      phone: '+260 97 8887766',
      subject: 'Collaboration on 2026 Smallholder Irrigation Policy Study',
      message:
        'Greetings ACF team. On behalf of the Agricultural Economics Department at the University of Zambia, we would like to explore joint publication opportunities on the upcoming irrigation brief.',
      is_read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: '99999999-9999-9999-9999-999999999902',
      name: 'Ruth Tembo',
      email: 'ruth.tembo@agrizambia.org',
      phone: '+260 95 3322110',
      subject: 'Request for Hard Copies: Policy Brief 2025/2026',
      message:
        'Could you advise if printed hard copies of the latest agricultural sector policy review are available for pickup at the Lusaka secretariat?',
      is_read: true,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ]

  const messages = messagesData && messagesData.length > 0 ? (messagesData as unknown as ContactMessageItem[]) : defaultMessages

  return <ContactManager initialMessages={messages} />
}
