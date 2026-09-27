import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import type { PublicJob } from "@/lib/careers/types"

export function OpenPositions({ jobs }: { jobs: PublicJob[] }) {
  if (jobs.length === 0) {
    return (
      <div data-reveal className="rounded-2xl border border-border glass px-6 py-12 text-center sm:px-10">
        <h3 className="font-display text-2xl font-semibold text-primary">No open positions right now.</h3>
        <p className="mx-auto mt-3 max-w-lg text-secondary">
          We don&apos;t have any open positions at the moment, but we&apos;re always interested in meeting talented
          people.
        </p>
        <a
          href="#apply"
          className="group mt-7 inline-flex items-center gap-3 rounded-full bg-accent-2 py-2 pl-6 pr-2 text-[15px] font-semibold text-ink"
        >
          Send Your Resume
          <span className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:translate-x-0.5 bg-ink text-accent-2 ring-1 ring-white/10">
            <ArrowRight className="h-4 w-4" />
          </span>
        </a>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-border border-y border-border">
      {jobs.map((job) => (
        <li key={job.id} data-reveal>
          <Link
            href={`/careers/${job.slug}`}
            className="group flex flex-col gap-3 py-7 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-8"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{job.department}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-primary transition-colors group-hover:text-accent sm:text-[1.7rem]">
                {job.title}
              </h3>
              <p className="mt-1.5 text-sm text-secondary">
                {job.location} <span className="mx-1.5 text-border-bright">·</span> {job.employmentType}
              </p>
            </div>
            <span className="inline-flex flex-shrink-0 items-center gap-2 text-[15px] font-semibold text-primary">
              <span className="link-underline">View Position</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
