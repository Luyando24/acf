import Link from 'next/link'
import { Home, ArrowLeft, Search, FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#fdfdfd] p-4 text-[#142018]">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#e2ebe4] p-8 sm:p-12 text-center shadow-lg space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#f0f6f1] text-[#175432] flex items-center justify-center mx-auto">
          <FileQuestion size={32} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#175432] bg-[#f0f6f1] px-3 py-1 rounded-full">
            404 • Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f1d14] tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs text-[#5c6f62] leading-relaxed">
            The page, policy brief, or resource you are looking for may have been relocated or updated in the ACF knowledge repository.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#175432] hover:bg-[#114227] text-white font-bold text-xs rounded-full transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Home size={15} />
            <span>Return Home</span>
          </Link>
          <Link
            href="/publications"
            className="px-5 py-3 border border-[#e2ebe4] hover:bg-gray-50 text-[#0f1d14] font-bold text-xs rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <Search size={15} />
            <span>Search Publications</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
