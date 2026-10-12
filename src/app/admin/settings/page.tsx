import { Settings, Save, Globe, Phone, Mail, MapPin } from 'lucide-react'
import { getSiteSettings, getSiteStats } from '@/lib/supabase/settings'

export default async function AdminSettingsPage() {
  const [settings, stats] = await Promise.all([
    getSiteSettings(),
    getSiteStats(),
  ])

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2ebe4] shadow-xs">
        <h1 className="text-2xl font-black text-[#0f1d14] tracking-tight">
          Site Settings & Institutional Metadata
        </h1>
        <p className="text-xs text-[#5c6f62] mt-0.5">
          Update public contact numbers, secretariat address, social channels, and homepage impact counters.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#e2ebe4] p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-[#0f1d14] border-b border-[#e2ebe4] pb-3">
          Secretariat General Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-bold text-[#0f1d14]">Organization Name</label>
            <input
              type="text"
              defaultValue={settings.site_name}
              className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#0f1d14]">Official Contact Email</label>
            <input
              type="email"
              defaultValue={settings.email}
              className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#0f1d14]">Telephone Hotline</label>
            <input
              type="text"
              defaultValue={settings.phone}
              className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-bold text-[#0f1d14]">Physical Office Address</label>
            <input
              type="text"
              defaultValue={settings.address}
              className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-bold text-[#0f1d14]">Working Hours</label>
            <input
              type="text"
              defaultValue={settings.office_hours}
              className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>
        </div>

        <h2 className="text-lg font-bold text-[#0f1d14] border-b border-[#e2ebe4] pb-3 pt-4">
          Social Media Links
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-[#0f1d14]">Facebook URL</label>
            <input
              type="url"
              defaultValue={settings.facebook_url || ''}
              className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#0f1d14]">Twitter (X) URL</label>
            <input
              type="url"
              defaultValue={settings.twitter_url || ''}
              className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-bold text-[#0f1d14]">LinkedIn URL</label>
            <input
              type="url"
              defaultValue={settings.linkedin_url || ''}
              className="w-full px-4 py-3 rounded-xl border border-[#e2ebe4] focus:ring-2 focus:ring-[#175432] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-[#e2ebe4] flex justify-end">
          <button
            type="button"
            className="px-6 py-3 bg-[#175432] hover:bg-[#114227] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save size={15} />
            <span>Save Settings Changes</span>
          </button>
        </div>
      </div>
    </div>
  )
}
