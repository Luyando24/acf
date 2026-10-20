import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'
import { getStaffSession } from '@/lib/auth/session'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getStaffSession()

  return (
    <div className="min-h-screen flex bg-[#f4f6f5] text-[#142018]">
      <AdminSidebar role={session?.role ?? ''} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AdminTopbar email={session?.email ?? ''} role={session?.role ?? ''} />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
