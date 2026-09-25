import { SectionHeading } from "@/components/ui/SectionHeading"
import { JobCard } from "@/components/careers/JobCard"
import { JobEmptyState } from "@/components/careers/JobEmptyState"
import { JobFiltersForm } from "@/components/careers/JobFiltersForm"
import { JobPagination } from "@/components/careers/JobPagination"
import {
  firstParamValue,
  hasActiveJobFilters,
  type JobSearchParams
} from "@/components/careers/queryState"
import type { JobListResponse } from "@/lib/careers/types"

interface OpenPositionsSectionProps {
  result: JobListResponse
  searchParams: JobSearchParams
}

function positionSummary(
  shown: number,
  total: number,
  page: number,
  limit: number
): string {
  if (total === 0) {
    return "0 open positions"
  }

  const noun = total === 1 ? "position" : "positions"

  if (shown === 0) {
    return `Showing 0 of ${total} open ${noun}`
  }

  const start = (page - 1) * limit + 1
  const end = Math.min(start + shown - 1, total)

  return `Showing ${start}–${end} of ${total} open ${noun}`
}

export function OpenPositionsSection({
  result,
  searchParams
}: OpenPositionsSectionProps) {
  const { jobs, pagination, filters } = result
  const hasFilters = hasActiveJobFilters(searchParams)
  const emptyVariant =
    hasFilters || pagination.total > 0 ? "no-results" : "no-jobs"

  return (
    <section
      id="open-positions"
      className="scroll-mt-24 border-t border-border/60 bg-background py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Careers"
          heading="Open positions"
          subheading="Every current role at Soonlay, with the full description and a direct application link."
          align="left"
        />

        <div className="mt-10">
          <JobFiltersForm
            filters={filters}
            search={firstParamValue(searchParams.search)}
            location={firstParamValue(searchParams.location)}
            department={firstParamValue(searchParams.department)}
            employmentType={firstParamValue(searchParams.employmentType)}
            hasActiveFilters={hasFilters}
          />
        </div>

        <p
          aria-live="polite"
          className="mt-6 font-mono text-[0.7rem] uppercase tracking-wide text-muted"
        >
          {positionSummary(
            jobs.length,
            pagination.total,
            pagination.page,
            pagination.limit
          )}
        </p>

        {jobs.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <JobEmptyState variant={emptyVariant} />
          </div>
        )}

        <JobPagination pagination={pagination} searchParams={searchParams} />
      </div>
    </section>
  )
}
