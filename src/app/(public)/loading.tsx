export default function PublicLoading() {
  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center py-24 px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-[#175432] animate-spin" />
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#175432]/70 animate-pulse">
        Loading...
      </p>
    </div>
  )
}
