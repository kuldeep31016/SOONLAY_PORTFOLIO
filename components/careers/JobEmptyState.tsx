import Link from "next/link"
import { BriefcaseBusiness, SearchX } from "lucide-react"

type JobEmptyStateVariant = "no-jobs" | "no-results"

interface JobEmptyStateProps {
  variant: JobEmptyStateVariant
}

export function JobEmptyState({ variant }: JobEmptyStateProps) {
  const isFiltered = variant === "no-results"
  const Icon = isFiltered ? SearchX : BriefcaseBusiness
  const title = isFiltered ? "No positions found" : "No open positions"
  const description = isFiltered
    ? "Try changing your search or filters."
    : "We don't have any open positions right now. Please check back later."

  return (
    <div className="card-surface flex flex-col items-center justify-center bg-surface/70 px-6 py-16 text-center sm:px-10">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-5 font-display text-xl text-primary">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-secondary">{description}</p>
      {isFiltered && (
        <Link
          href="/careers"
          className="mt-6 inline-flex items-center rounded-full border border-border bg-surface px-5 py-2 text-xs font-medium text-primary transition-colors hover:border-border-bright"
        >
          Clear filters
        </Link>
      )}
    </div>
  )
}
