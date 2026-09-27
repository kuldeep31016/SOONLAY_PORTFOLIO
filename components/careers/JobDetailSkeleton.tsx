const shimmer =
  "animate-pulse rounded-md bg-white/[0.06] motion-reduce:animate-none"

export function JobDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading job details">
      <section className="border-b border-border bg-background pt-16">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className={`${shimmer} h-3 w-40`} />
          <div className={`${shimmer} mt-6 h-3 w-28`} />
          <div className={`${shimmer} mt-6 h-11 w-full max-w-2xl`} />
          <div className={`${shimmer} mt-6 h-4 w-full max-w-xl`} />
          <div className="mt-8 flex flex-wrap gap-2">
            <div className={`${shimmer} h-8 w-28 rounded-full`} />
            <div className={`${shimmer} h-8 w-32 rounded-full`} />
            <div className={`${shimmer} h-8 w-24 rounded-full`} />
          </div>
        </div>
      </section>

      <section className="bg-background py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 lg:px-8">
          <div className="min-w-0 divide-y divide-border rounded-2xl border border-border glass p-6 sm:p-10">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="py-8 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`${shimmer} h-9 w-9 rounded-full`} />
                  <div className={`${shimmer} h-5 w-40`} />
                </div>
                <div className={`${shimmer} mt-5 h-4 w-full`} />
                <div className={`${shimmer} mt-2.5 h-4 w-11/12`} />
                <div className={`${shimmer} mt-2.5 h-4 w-4/5`} />
              </div>
            ))}
          </div>
          <div className="h-fit rounded-2xl border border-border glass p-6 sm:p-7">
            <div className={`${shimmer} h-6 w-40`} />
            <div className={`${shimmer} mt-3 h-4 w-full`} />
            <div className={`${shimmer} mt-2 h-4 w-3/4`} />
            <div className={`${shimmer} mt-6 h-12 w-full rounded-lg`} />
            <div className="mt-6 space-y-3 border-t border-border pt-6">
              <div className={`${shimmer} h-4 w-full`} />
              <div className={`${shimmer} h-4 w-full`} />
              <div className={`${shimmer} h-4 w-full`} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
