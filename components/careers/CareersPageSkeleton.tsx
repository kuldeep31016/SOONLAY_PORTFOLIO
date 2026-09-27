export function CareersPageSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="border-b border-border pt-16">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="h-3 w-24 rounded bg-white/[0.06]" />
          <div className="mt-6 h-14 w-3/4 max-w-xl rounded-lg bg-white/[0.06]" />
          <div className="mt-6 h-5 w-full max-w-lg rounded bg-white/[0.06]" />
        </div>
      </div>
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-16 sm:px-6 lg:px-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-white/[0.06]" />
        ))}
      </div>
    </div>
  )
}
