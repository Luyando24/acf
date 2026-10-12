import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = {
  title: 'ACF Admin Dashboard | Content Management System',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-[#f6f9f6] text-[#142018]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  )
}
