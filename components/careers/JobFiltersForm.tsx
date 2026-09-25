import Link from "next/link"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/Button"
import type { JobFilters } from "@/lib/careers/types"

interface JobFiltersFormProps {
  filters: JobFilters
  search: string
  location: string
  department: string
  employmentType: string
  hasActiveFilters: boolean
}

interface FilterFieldsProps extends Omit<JobFiltersFormProps, "hasActiveFilters"> {
  idPrefix: string
}

function uniqueValues(values: string[]): string[] {
  return Array.from(new Set(values))
}

function FilterFields({
  filters,
  search,
  location,
  department,
  employmentType,
  idPrefix
}: FilterFieldsProps) {
  const searchId = `${idPrefix}-search`
  const locationId = `${idPrefix}-location`
  const departmentId = `${idPrefix}-department`
  const employmentTypeId = `${idPrefix}-employment-type`
  const fieldClasses =
    "w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm text-primary outline-none transition-colors focus:border-accent"
  const labelClasses = "mb-1.5 block text-xs font-medium text-secondary"

  return (
    <>
      <div>
        <label htmlFor={searchId} className={labelClasses}>
          Search jobs
        </label>
        <input
          id={searchId}
          name="search"
          type="search"
          defaultValue={search}
          placeholder="Title, skill, or keyword"
          className={fieldClasses}
        />
      </div>

      <div>
        <label htmlFor={locationId} className={labelClasses}>
          Location
        </label>
        <select
          id={locationId}
          name="location"
          defaultValue={location}
          className={fieldClasses}
        >
          <option value="">All locations</option>
          {uniqueValues(filters.locations).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={departmentId} className={labelClasses}>
          Department
        </label>
        <select
          id={departmentId}
          name="department"
          defaultValue={department}
          className={fieldClasses}
        >
          <option value="">All departments</option>
          {uniqueValues(filters.departments).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={employmentTypeId} className={labelClasses}>
          Employment type
        </label>
        <select
          id={employmentTypeId}
          name="employmentType"
          defaultValue={employmentType}
          className={fieldClasses}
        >
          <option value="">All employment types</option>
          {uniqueValues(filters.employmentTypes).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

function ClearFiltersLink() {
  return (
    <Link
      href="/careers"
      className="inline-flex h-8 items-center rounded-full border border-border bg-surface px-4 text-xs font-medium text-secondary transition-colors hover:border-border-bright hover:text-primary"
    >
      Clear filters
    </Link>
  )
}

export function JobFiltersForm(props: JobFiltersFormProps) {
  const {
    filters,
    search,
    location,
    department,
    employmentType,
    hasActiveFilters
  } = props
  const fieldProps = {
    filters,
    search,
    location,
    department,
    employmentType
  }
  const activeFilterCount = [search, location, department, employmentType].filter(
    (value) => value.trim().length > 0
  ).length

  return (
    <>
      <details className="group lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-2xl border border-border bg-surface/80 px-4 py-3 text-sm text-primary [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-accent" aria-hidden="true" />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[0.65rem] text-accent">
                {activeFilterCount}
              </span>
            )}
          </span>
          <span className="font-mono text-[0.65rem] uppercase tracking-wide text-muted group-open:text-accent">
            {hasActiveFilters ? "Active" : "Show"}
          </span>
        </summary>
        <form
          action="/careers"
          method="get"
          className="mt-3 rounded-2xl border border-border bg-surface/60 p-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FilterFields {...fieldProps} idPrefix="mobile" />
          </div>
          <div className="mt-5 flex items-center gap-3">
            <Button type="submit" size="sm" showArrow>
              Apply filters
            </Button>
            {hasActiveFilters && <ClearFiltersLink />}
          </div>
        </form>
      </details>

      <form
        action="/careers"
        method="get"
        className="card-surface hidden bg-surface/70 p-5 lg:block"
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <FilterFields {...fieldProps} idPrefix="desktop" />
        </div>
        <div className="mt-5 flex items-center gap-3">
          <Button type="submit" size="sm" showArrow>
            Apply filters
          </Button>
          {hasActiveFilters && <ClearFiltersLink />}
        </div>
      </form>
    </>
  )
}
