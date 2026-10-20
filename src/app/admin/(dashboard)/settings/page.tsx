import { getSiteSettings } from '@/lib/supabase/settings'
import SettingsForm from '@/components/admin/SettingsForm'

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#e2ebe4] shadow-xs">
        <h1 className="text-2xl font-black text-[#0f1d14] tracking-tight">
          Site Settings & Institutional Metadata
        </h1>
        <p className="text-sm text-[#5c6f62] mt-0.5">
          Update the institutional logo, public contact numbers, secretariat address, and social channels.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  )
}
