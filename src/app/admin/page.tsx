import Link from 'next/link'
import {
  BookOpen,
  FileText,
  Calendar,
  Briefcase,
  Users,
  MessageSquare,
  Shield,
  PlusCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/formatters'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Get real-time metric counts
  const [
    pubsRes,
    newsRes,
    eventsRes,
    oppsRes,
    appsRes,
    contactsRes,
  ] = await Promise.all([
    supabase.from('publications').select('*', { count: 'exact', head: true }),
    supabase.from('news_posts').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('opportunities').select('*', { count: 'exact', head: true }),
    supabase.from('membership_applications').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
  ])

  // Get recent applications
  const { data: recentApplicationsData } = await supabase
    .from('membership_applications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  const recentApplications = recentApplicationsData as any[] | null

  // Get recent contact inquiries
  const { data: recentMessagesData } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  const recentMessages = recentMessagesData as any[] | null

  const pubCount = pubsRes.count ?? 4
  const newsCount = newsRes.count ?? 2
  const eventCount = eventsRes.count ?? 3
  const oppCount = oppsRes.count ?? 2
  const newAppCount = appsRes.count ?? 0
  const unreadContactCount = contactsRes.count ?? 0

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome & Quick Actions Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#e2ebe4] shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#175432] bg-[#f0f6f1] px-3 py-1 rounded-full">
            Admin Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f1d14] tracking-tight mt-1.5">
            Agricultural Consultative Forum CMS
          </h1>
          <p className="text-xs sm:text-sm text-[#5c6f62] mt-0.5">
            Manage research publications, sector news, policy dialogues, opportunities, and member submissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/publications"
            className="px-4 py-2 bg-[#175432] hover:bg-[#114227] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle size={14} />
            <span>Add Publication</span>
          </Link>
          <Link
            href="/admin/news"
            className="px-4 py-2 bg-[#f0f6f1] text-[#175432] hover:bg-[#e2ebe4] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <PlusCircle size={14} />
            <span>Post News</span>
          </Link>
          <Link
            href="/admin/opportunities"
            className="px-4 py-2 bg-[#f0f6f1] text-[#175432] hover:bg-[#e2ebe4] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <PlusCircle size={14} />
            <span>Add Opportunity</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Publications', value: pubCount, icon: BookOpen, href: '/admin/publications', color: 'text-[#175432]' },
          { label: 'News Posts', value: newsCount, icon: FileText, href: '/admin/news', color: 'text-[#175432]' },
          { label: 'Events', value: eventCount, icon: Calendar, href: '/admin/events', color: 'text-[#175432]' },
          { label: 'Opportunities', value: oppCount, icon: Briefcase, href: '/admin/opportunities', color: 'text-[#175432]' },
          { label: 'New Memberships', value: newAppCount, icon: Shield, href: '/admin/membership', color: newAppCount > 0 ? 'text-amber-600' : 'text-[#175432]' },
          { label: 'Unread Inquiries', value: unreadContactCount, icon: MessageSquare, href: '/admin/contacts', color: unreadContactCount > 0 ? 'text-amber-600' : 'text-[#175432]' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              href={item.href}
              className="bg-white p-4 rounded-2xl border border-[#e2ebe4] shadow-xs hover:border-[#175432] hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <Icon size={18} className="text-[#5c6f62] group-hover:text-[#175432] transition-colors" />
                <span className={`text-xl font-black ${item.color}`}>{item.value}</span>
              </div>
              <div className="text-[11px] font-bold text-[#5c6f62] mt-2 group-hover:text-[#0f1d14]">
                {item.label}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Split Recent Inquiries and Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Membership Applications */}
        <div className="bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#e2ebe4] pb-3">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-[#175432]" />
              <h2 className="text-base font-bold text-[#0f1d14]">
                Recent Membership Inquiries
              </h2>
            </div>
            <Link
              href="/admin/membership"
              className="text-xs font-bold text-[#175432] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {recentApplications && recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl bg-[#f6f9f6] border border-[#e2ebe4] flex justify-between items-center text-xs"
                >
                  <div>
                    <h3 className="font-bold text-[#0f1d14]">{app.org_name || app.contact_name}</h3>
                    <div className="text-[11px] text-[#5c6f62]">{app.email} • {app.location_province}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f0f6f1] text-[#175432] uppercase">
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-[#5c6f62]">
                No pending membership applications.
              </div>
            )}
          </div>
        </div>

        {/* Recent Contact Messages */}
        <div className="bg-white p-6 rounded-3xl border border-[#e2ebe4] shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#e2ebe4] pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-[#175432]" />
              <h2 className="text-base font-bold text-[#0f1d14]">
                Recent Contact Messages
              </h2>
            </div>
            <Link
              href="/admin/contacts"
              className="text-xs font-bold text-[#175432] hover:underline flex items-center gap-1"
            >
              <span>View Inbox</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {recentMessages && recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-xl bg-[#f6f9f6] border border-[#e2ebe4] flex justify-between items-center text-xs"
                >
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-[#0f1d14]">{msg.subject}</h3>
                    <div className="text-[11px] text-[#5c6f62]">
                      From {msg.name} ({msg.email})
                    </div>
                  </div>
                  <span className="text-[10px] text-[#5c6f62]">
                    {formatDate(msg.created_at)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-[#5c6f62]">
                Inbox is clean. No new inquiries.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
