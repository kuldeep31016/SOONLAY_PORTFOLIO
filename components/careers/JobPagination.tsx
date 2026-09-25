import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Pagination } from "@/lib/careers/types"
import { cn } from "@/lib/utils"
import {
  toSearchParams,
  type JobSearchParams
} from "@/components/careers/queryState"

interface JobPaginationProps {
  pagination: Pagination
  searchParams: JobSearchParams
}

const controlClasses =
  "inline-flex h-9 items-center gap-1 rounded-full border border-border bg-surface px-3 text-xs text-secondary transition-colors hover:border-border-bright hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-secondary"

function pageHref(
  page: number,
  searchParams: JobSearchParams
): string {
  const nextParams = toSearchParams(searchParams)
  nextParams.set("page", String(page))
  const query = nextParams.toString()
  return query ? `/careers?${query}` : "/careers"
}

export function JobPagination({
  pagination,
  searchParams
}: JobPaginationProps) {
  const totalPages = Math.max(0, pagination.totalPages)

  if (totalPages === 0) {
    return null
  }

  const currentPage = Math.min(
    Math.max(pagination.page, 1),
    totalPages
  )
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  const previousPage = Math.max(currentPage - 1, 1)
  const nextPage = Math.min(currentPage + 1, totalPages)

  return (
    <nav
      aria-label="Careers pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {currentPage > 1 ? (
        <Link
          href={pageHref(previousPage, searchParams)}
          className={controlClasses}
          rel="prev"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </Link>
      ) : (
        <button type="button" className={controlClasses} disabled>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </button>
      )}

      {pages.map((page) => {
        const isCurrent = page === currentPage

        return (
          <Link
            key={page}
            href={pageHref(page, searchParams)}
            aria-current={isCurrent ? "page" : undefined}
            aria-label={`Page ${page}`}
            className={cn(
              "inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-xs font-mono transition-colors",
              isCurrent
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-surface text-secondary hover:border-border-bright hover:text-primary"
            )}
          >
            {page}
          </Link>
        )
      })}

      {currentPage < totalPages ? (
        <Link
          href={pageHref(nextPage, searchParams)}
          className={controlClasses}
          rel="next"
        >
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : (
        <button type="button" className={controlClasses} disabled>
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </nav>
  )
}
