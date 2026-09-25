const shimmer =
  "animate-pulse rounded-full bg-surface-2 motion-reduce:animate-none"

export function CareersPageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading careers page">
      <section className="relative overflow-hidden bg-gradient-dark py-20 md:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="mesh-gradient" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`${shimmer} h-6 w-28`} />
          <div className={`${shimmer} mt-6 h-12 w-full max-w-2xl`} />
          <div className={`${shimmer} mt-4 h-12 w-full max-w-xl`} />
          <div className={`${shimmer} mt-6 h-5 w-full max-w-2xl`} />
          <div className={`${shimmer} mt-2 h-5 w-full max-w-lg`} />
          <div className="mt-8 flex gap-4">
            <div className={`${shimmer} h-12 w-48`} />
            <div className={`${shimmer} h-12 w-40`} />
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-background py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="card-surface bg-surface/70 p-6">
                <div className={`${shimmer} h-10 w-10`} />
                <div className={`${shimmer} mt-5 h-5 w-3/4`} />
                <div className={`${shimmer} mt-3 h-4 w-full`} />
                <div className={`${shimmer} mt-2 h-4 w-2/3`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-background py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`${shimmer} h-6 w-32`} />
          <div className={`${shimmer} mt-6 h-10 w-80 max-w-full`} />
          <div className={`${shimmer} mt-8 h-24 w-full`} />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="card-surface bg-surface/70 p-6">
                <div className={`${shimmer} h-5 w-3/4`} />
                <div className={`${shimmer} mt-3 h-4 w-1/2`} />
                <div className={`${shimmer} mt-5 h-4 w-full`} />
                <div className={`${shimmer} mt-2 h-4 w-5/6`} />
                <div className={`${shimmer} mt-6 h-4 w-24`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
