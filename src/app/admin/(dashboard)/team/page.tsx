import { redirect } from 'next/navigation'
import { getStaffSession } from '@/lib/auth/session'
import { canManageStaff } from '@/lib/auth/permissions'
import StaffManager from '@/components/admin/StaffManager'

export default async function StaffAccountsPage() {
  const session = await getStaffSession()

  if (!session || !canManageStaff(session.role)) {
    redirect('/admin')
  }

  return <StaffManager currentUserId={session.userId} />
}
