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
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/formatters'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Get real-time metric counts in a single parallel batch
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

  const newAppsCount = appsRes.count ?? 0
  const unreadMessagesCount = contactsRes.count ?? 0
  const publicationsCount = pubsRes.count ?? 0
  const newsCount = newsRes.count ?? 0

  // Secondary directory metrics
  const directoryMetrics = [
    {
      label: 'Events & Forums',
      value: eventsRes.count ?? 0,
      icon: Calendar,
      href: '/admin/events',
      caption: 'Dialogues & forums',
    },
    {
      label: 'Opportunities',
      value: oppsRes.count ?? 0,
      icon: Briefcase,
      href: '/admin/opportunities',
      caption: 'Jobs & consultancies',
    },
    {
      label: 'Programmes',
      value: progRes.count ?? 0,
      icon: Layers,
      href: '/admin/programmes',
      caption: 'Thematic pillars',
    },
    {
      label: 'Board & Staff',
      value: peopleRes.count ?? 0,
      icon: Users,
      href: '/admin/people',
      caption: 'Governance profiles',
    },
    {
      label: 'Partners',
      value: partnerRes.count ?? 0,
      icon: Handshake,
      href: '/admin/partners',
      caption: 'Affiliated bodies',
    },
    {
      label: 'Newsletter',
      value: subsRes.count ?? 0,
      icon: Mail,
      href: '/admin/newsletter',
      caption: 'Subscribers list',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900">
            Dashboard Overview
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Real-time operational status, stakeholder inquiries, and content management.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/publications"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle size={14} />
            <span>Add Publication</span>
          </Link>
          <Link
            href="/admin/news"
            className="px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-slate-200 shadow-xs"
          >
            <PlusCircle size={14} className="text-slate-400" />
            <span>Post News</span>
          </Link>
          <Link
            href="/admin/opportunities"
            className="px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-slate-200 shadow-xs"
          >
            <PlusCircle size={14} className="text-slate-400" />
            <span>Add Vacancy</span>
          </Link>
          <Link
            href="/admin/events"
            className="px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-slate-200 shadow-xs"
          >
            <PlusCircle size={14} className="text-slate-400" />
            <span>Post Event</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards Grid (4 Top Hero Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Membership Applications */}
        <Link
          href="/admin/membership"
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all group relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold group-hover:bg-[#175432] group-hover:text-white transition-all">
                <Shield size={22} strokeWidth={2.2} />
              </div>
              {newAppsCount > 0 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Review Pending
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Up to Date
                </span>
              )}
            </div>
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">
              New Memberships
            </h3>
            <p className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">
              {newAppsCount}
            </p>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-3 flex items-center gap-1.5">
            {newAppsCount > 0 ? (
              <span className="text-amber-700 font-bold flex items-center gap-1">
                <AlertCircle size={13} /> {newAppsCount} awaiting review
              </span>
            ) : (
              <span className="text-slate-400 flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-600" /> All submissions reviewed
              </span>
            )}
          </p>
        </Link>

        {/* Metric 2: Unread Contact Inquiries */}
        <Link
          href="/admin/contacts"
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all group relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold group-hover:bg-[#175432] group-hover:text-white transition-all">
                <MessageSquare size={22} strokeWidth={2.2} />
              </div>
              {unreadMessagesCount > 0 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Needs Triage
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Inbox Clear
                </span>
              )}
            </div>
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">
              Contact Inquiries
            </h3>
            <p className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">
              {unreadMessagesCount}
            </p>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-3 flex items-center gap-1.5">
            {unreadMessagesCount > 0 ? (
              <span className="text-amber-700 font-bold flex items-center gap-1">
                <AlertCircle size={13} /> {unreadMessagesCount} unread message{unreadMessagesCount > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="text-slate-400 flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-600" /> All inquiries handled
              </span>
            )}
          </p>
        </Link>

        {/* Metric 3: Publications */}
        <Link
          href="/admin/publications"
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all group relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold group-hover:bg-[#175432] group-hover:text-white transition-all">
                <BookOpen size={22} strokeWidth={2.2} />
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Research
              </span>
            </div>
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">
              Publications
            </h3>
            <p className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">
              {publicationsCount}
            </p>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-3">
            Policy briefs, working papers & reports
          </p>
        </Link>

        {/* Metric 4: News Posts */}
        <Link
          href="/admin/news"
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all group relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold group-hover:bg-[#175432] group-hover:text-white transition-all">
                <FileText size={22} strokeWidth={2.2} />
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Press & Media
              </span>
            </div>
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">
              News Posts
            </h3>
            <p className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">
              {newsCount}
            </p>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-3">
            Articles, press releases & statements
          </p>
        </Link>
      </div>

      {/* Secondary Operations & Directory Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Operations & Directory
          </h2>
          <span className="text-xs font-medium text-slate-400">
            Direct CMS section links
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {directoryMetrics.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                href={item.href}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 hover:bg-slate-50/60 transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-slate-400 group-hover:text-slate-700 transition-colors mb-2">
                  <Icon size={16} strokeWidth={2} />
                  <ArrowRight
                    size={12}
                    className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-slate-400"
                  />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 tabular-nums">
                    {item.value}
                  </div>
                  <div className="text-xs font-bold text-slate-700 mt-1 truncate">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate font-medium">
                    {item.caption}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Split Recent Inquiries and Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Membership Applications */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-black text-slate-900 tracking-tight">
                Recent Membership Inquiries
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200">
                {recentApplications?.length ?? 0}
              </span>
            </div>
            <Link
              href="/admin/membership"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <span>Manage all</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {recentApplications && recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center shrink-0 border border-slate-200/60 uppercase">
                      {(app.org_name || app.contact_name || 'M').charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {app.org_name || app.contact_name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        {app.email} &bull; {app.location_province || 'Zambia'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0 border ${
                      app.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : app.status === 'new'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-xs font-medium text-slate-400">
                No pending membership applications.
              </div>
            )}
          </div>
        </div>

        {/* Recent Contact Messages */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-black text-slate-900 tracking-tight">
                Recent Contact Messages
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200">
                {recentMessages?.length ?? 0}
              </span>
            </div>
            <Link
              href="/admin/contacts"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <span>View inbox</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {recentMessages && recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center shrink-0 border border-slate-200/60 uppercase">
                      {(msg.name || 'C').charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {msg.subject || 'Inquiry'}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        From {msg.name} ({msg.email})
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-slate-400 shrink-0">
                    {formatDate(msg.created_at)}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-xs font-medium text-slate-400">
                Inbox is clean. No new inquiries.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
