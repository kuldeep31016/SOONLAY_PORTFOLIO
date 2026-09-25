const shimmer =
  "animate-pulse rounded-full bg-surface-2 motion-reduce:animate-none"

export function JobDetailSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading job details"
      className="relative overflow-hidden bg-gradient-dark py-20 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="mesh-gradient" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`${shimmer} h-4 w-40`} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
          <div className="min-w-0">
            <div className={`${shimmer} h-10 w-3/4`} />
            <div className={`${shimmer} mt-6 h-4 w-2/3`} />
            <div className="mt-10 space-y-6">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="card-surface bg-surface/70 p-6">
                  <div className={`${shimmer} h-5 w-40`} />
                  <div className={`${shimmer} mt-5 h-4 w-full`} />
                  <div className={`${shimmer} mt-2 h-4 w-11/12`} />
                  <div className={`${shimmer} mt-2 h-4 w-4/5`} />
                </div>
              ))}
            </div>
          </div>
          <div className="card-surface h-64 bg-surface/90 p-6">
            <div className={`${shimmer} h-5 w-28`} />
            <div className={`${shimmer} mt-5 h-4 w-full`} />
            <div className={`${shimmer} mt-12 h-12 w-full`} />
          </div>
        </div>
      </div>
    </div>
  )
}
