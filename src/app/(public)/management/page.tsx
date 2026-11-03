import { redirect } from 'next/navigation'

export default function ManagementRootRedirect() {
  redirect('/about/secretariat')
}
