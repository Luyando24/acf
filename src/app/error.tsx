'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#fdfdfd] p-4 text-[#142018]">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#e2ebe4] p-8 sm:p-12 text-center shadow-lg space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle size={32} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
            System Notice
          </span>
          <h1 className="text-2xl font-black text-[#0f1d14] tracking-tight">
            Unexpected Error Occurred
          </h1>
          <p className="text-xs text-[#5c6f62] leading-relaxed">
            We encountered an unexpected technical problem loading this resource. Please attempt to refresh the page or return to the main portal.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 bg-[#175432] hover:bg-[#114227] text-white font-bold text-xs rounded-full transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="px-5 py-3 border border-[#e2ebe4] hover:bg-gray-50 text-[#0f1d14] font-bold text-xs rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <Home size={15} />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
