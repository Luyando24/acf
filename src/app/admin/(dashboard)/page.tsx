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
  ArrowRight,
  Layers,
  Handshake,
  Mail,
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
    progRes,
    peopleRes,
    partnerRes,
    subsRes,
  ] = await Promise.all([
    supabase.from('publications').select('*', { count: 'exact', head: true }),
    supabase.from('news_posts').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('opportunities').select('*', { count: 'exact', head: true }),
    supabase.from('membership_applications').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('programmes').select('*', { count: 'exact', head: true }),
    supabase.from('people').select('*', { count: 'exact', head: true }),
    supabase.from('partners').select('*', { count: 'exact', head: true }),
    supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
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

  const metrics = [
    { label: 'Publications', value: pubsRes.count ?? 0, icon: BookOpen, href: '/admin/publications', caption: 'Policy briefs & research reports', alert: false },
    { label: 'News Posts', value: newsRes.count ?? 0, icon: FileText, href: '/admin/news', caption: 'Sector news & press releases', alert: false },
    { label: 'Events & Forums', value: eventsRes.count ?? 0, icon: Calendar, href: '/admin/events', caption: 'Dialogues & stakeholder meetings', alert: false },
    { label: 'Opportunities', value: oppsRes.count ?? 0, icon: Briefcase, href: '/admin/opportunities', caption: 'Jobs, tenders & consultancies', alert: false },
    { label: 'Programmes', value: progRes.count ?? 0, icon: Layers, href: '/admin/programmes', caption: 'Thematic work areas', alert: false },
    { label: 'Board & Staff', value: peopleRes.count ?? 0, icon: Users, href: '/admin/people', caption: 'Governance & secretariat profiles', alert: false },
    { label: 'Partners', value: partnerRes.count ?? 0, icon: Handshake, href: '/admin/partners', caption: 'Federations & cooperating partners', alert: false },
    { label: 'New Memberships', value: appsRes.count ?? 0, icon: Shield, href: '/admin/membership', caption: 'Applications awaiting review', alert: (appsRes.count ?? 0) > 0 },
    { label: 'Unread Inquiries', value: contactsRes.count ?? 0, icon: MessageSquare, href: '/admin/contacts', caption: 'Contact messages to triage', alert: (contactsRes.count ?? 0) > 0 },
    { label: 'Newsletter', value: subsRes.count ?? 0, icon: Mail, href: '/admin/newsletter', caption: 'Subscriber signups', alert: false },
  ]

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f1d14] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-[#5c6f62] mt-0.5">
            Publications, sector news, dialogues, opportunities, and member submissions at a glance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/publications"
            className="px-3.5 py-2 bg-[#175432] hover:bg-[#114227] text-white text-sm font-bold rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle size={14} />
            <span>Add Publication</span>
          </Link>
          <Link
            href="/admin/news"
            className="px-3.5 py-2 bg-white text-[#0f1d14] hover:bg-[#f5f8f5] text-sm font-semibold rounded-md transition-colors flex items-center gap-1.5 border border-[#e4e8e6]"
          >
            <PlusCircle size={14} className="text-[#5c6f62]" />
            <span>Post News</span>
          </Link>
          <Link
            href="/admin/opportunities"
            className="px-3.5 py-2 bg-white text-[#0f1d14] hover:bg-[#f5f8f5] text-sm font-semibold rounded-md transition-colors flex items-center gap-1.5 border border-[#e4e8e6]"
          >
            <PlusCircle size={14} className="text-[#5c6f62]" />
            <span>Add Vacancy</span>
          </Link>
          <Link
            href="/admin/events"
            className="px-3.5 py-2 bg-white text-[#0f1d14] hover:bg-[#f5f8f5] text-sm font-semibold rounded-md transition-colors flex items-center gap-1.5 border border-[#e4e8e6]"
          >
            <PlusCircle size={14} className="text-[#5c6f62]" />
            <span>Post Event</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              href={item.href}
              className="bg-white p-4 lg:p-5 rounded-lg border border-[#e4e8e6] hover:border-[#175432]/50 hover:shadow-sm transition-all group flex flex-col"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a9a8f] group-hover:text-[#175432] transition-colors">
                  {item.label}
                </span>
                <span className="flex items-center gap-1.5">
                  {item.alert && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" aria-label="Needs attention" />}
                  <Icon size={15} className="text-[#aebcb2] group-hover:text-[#175432] transition-colors shrink-0" />
                </span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-[#0f1d14] tabular-nums leading-none">
                {item.value}
              </div>
              <div className="text-xs text-[#8a9a8f] mt-2 leading-snug">
                {item.caption}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Split Recent Inquiries and Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        {/* Recent Membership Applications */}
        <div className="bg-white rounded-lg border border-[#e4e8e6] overflow-hidden">
          <div className="flex justify-between items-center px-5 py-3.5 border-b border-[#e4e8e6]">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#5c6f62]">
              Membership Inquiries ({recentApplications?.length ?? 0})
            </h2>
            <Link
              href="/admin/membership"
              className="text-sm font-semibold text-[#175432] hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-[#eef2ef]">
            {recentApplications && recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div key={app.id} className="px-5 py-3.5 flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#0f1d14] truncate">
                      {app.org_name || app.contact_name}
                    </h3>
                    <div className="text-xs text-[#8a9a8f] truncate">
                      {app.email} • {app.location_province || 'Zambia'}
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#3b4d41] shrink-0">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        app.status === 'approved'
                          ? 'bg-emerald-500'
                          : app.status === 'new'
                          ? 'bg-amber-500'
                          : 'bg-gray-400'
                      }`}
                    />
                    <span className="capitalize">{app.status}</span>
                  </span>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-center text-sm text-[#8a9a8f]">
                No pending membership applications.
              </div>
            )}
          </div>
        </div>

        {/* Recent Contact Messages */}
        <div className="bg-white rounded-lg border border-[#e4e8e6] overflow-hidden">
          <div className="flex justify-between items-center px-5 py-3.5 border-b border-[#e4e8e6]">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#5c6f62]">
              Recent Messages ({recentMessages?.length ?? 0})
            </h2>
            <Link
              href="/admin/contacts"
              className="text-sm font-semibold text-[#175432] hover:underline flex items-center gap-1"
            >
              <span>View Inbox</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-[#eef2ef]">
            {recentMessages && recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <div key={msg.id} className="px-5 py-3.5 flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#0f1d14] truncate">{msg.subject}</h3>
                    <div className="text-xs text-[#8a9a8f] truncate">
                      From {msg.name} ({msg.email})
                    </div>
                  </div>
                  <span className="text-xs text-[#8a9a8f] shrink-0">
                    {formatDate(msg.created_at)}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-center text-sm text-[#8a9a8f]">
                Inbox is clean. No new inquiries.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
