import Link from 'next/link'
import { MessageSquare, Mail, Phone, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDateTime } from '@/lib/utils/formatters'

export default async function AdminContactsPage() {
  const supabase = await createClient()

  const { data: messagesData } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  const defaultMessages = [
    {
      id: '1',
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
      id: '2',
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

  const messages = messagesData && messagesData.length > 0 ? messagesData : defaultMessages

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-[#0f1d14] tracking-tight">
            Contact Inquiries & Inbox
          </h1>
          <p className="text-xs text-[#5c6f62] mt-0.5">
            Public enquiries submitted via the website contact form.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((msg: any) => (
          <div
            key={msg.id}
            className={`p-6 rounded-3xl border transition-all ${
              !msg.is_read
                ? 'bg-white border-[#175432] shadow-sm'
                : 'bg-white/80 border-[#e2ebe4] shadow-xs opacity-80'
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
              <div className="flex items-center gap-2">
                {!msg.is_read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2da44e]" />
                )}
                <h2 className="text-base font-bold text-[#0f1d14]">{msg.subject}</h2>
              </div>
              <span className="text-[11px] text-[#5c6f62]">
                {formatDateTime(msg.created_at)}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#3b4d41] leading-relaxed mb-4 bg-[#f6f9f6] p-4 rounded-xl border border-[#e2ebe4]/70">
              {msg.message}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#5c6f62]">
              <span className="font-semibold text-[#0f1d14]">{msg.name}</span>
              <span>•</span>
              <a
                href={`mailto:${msg.email}`}
                className="text-[#175432] font-semibold hover:underline flex items-center gap-1"
              >
                <Mail size={13} />
                <span>{msg.email}</span>
              </a>
              {msg.phone && (
                <>
                  <span>•</span>
                  <a
                    href={`tel:${msg.phone}`}
                    className="hover:text-[#175432] flex items-center gap-1"
                  >
                    <Phone size={13} />
                    <span>{msg.phone}</span>
                  </a>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
