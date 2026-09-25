import { compactSearchText, normalizeSearchText } from "./slug"
import { EMPLOYMENT_TYPES } from "./types"
import type { EmploymentType, JobFilters, JobRecord, JobStatus, Pagination } from "./types"
import type { SortOrder } from "./query"

export interface ListFilterState {
  status: JobStatus | null
  location: string | null
  department: string | null
  employmentType: EmploymentType | null
  featured: boolean | null
  archived: boolean | null
}

export const NO_FILTERS: ListFilterState = {
  status: null,
  location: null,
  department: null,
  employmentType: null,
  featured: null,
  archived: null
}

interface SearchIndex {
  words: string
  compact: string
}

function compareText(a: string, b: string): number {
  return a.localeCompare(b, "en")
}

function buildSearchText(record: JobRecord): string {
  return [
    record.title,
    record.department,
    record.location,
    record.employmentType,
    record.experienceLevel ?? "",
    record.shortDescription,
    record.description,
    ...record.skills,
    ...record.responsibilities,
    ...record.requirements,
    ...record.niceToHave,
    ...record.benefits
  ].join(" ")
}

function buildSearchIndex(record: JobRecord): SearchIndex {
  const text = buildSearchText(record)
  return { words: normalizeSearchText(text), compact: compactSearchText(text) }
}

function termMatches(index: SearchIndex, term: string): boolean {
  const words = normalizeSearchText(term)
  if (words.length > 0 && index.words.includes(words)) {
    return true
  }

  const compact = compactSearchText(term)
  return compact.length > 0 && index.compact.includes(compact)
}

/**
 * Every search term must appear somewhere in the job text. Matching runs against
 * the title, department, location, employment type, experience level, summary,
 * description, skills, responsibilities, requirements, nice-to-have list, and
 * benefits, so results are case- and accent-insensitive, support partial words
 * and multi-word phrases, and still match when the query omits a separator that
 * the job text contains.
 */
export function matchesSearch(record: JobRecord, terms: readonly string[]): boolean {
  if (terms.length === 0) {
    return true
  }

  const index = buildSearchIndex(record)
  return terms.every((term) => termMatches(index, term))
}

export function matchesFilters(record: JobRecord, filters: ListFilterState): boolean {
  if (filters.status !== null && record.status !== filters.status) {
    return false
  }
  if (filters.archived === true && record.archivedAt === null) {
    return false
  }
  if (filters.archived === false && record.archivedAt !== null) {
    return false
  }
  if (filters.location !== null && record.location !== filters.location) {
    return false
  }
  if (filters.department !== null && record.department !== filters.department) {
    return false
  }
  if (filters.employmentType !== null && record.employmentType !== filters.employmentType) {
    return false
  }
  if (filters.featured !== null && record.featured !== filters.featured) {
    return false
  }
  return true
}

export function buildFilterOptions(records: readonly JobRecord[]): JobFilters {
  const locations = new Set<string>()
  const departments = new Set<string>()
  const employmentTypes = new Set<EmploymentType>()

  for (const record of records) {
    const location = record.location.trim()
    const department = record.department.trim()

    if (location.length > 0) {
      locations.add(location)
    }
    if (department.length > 0) {
      departments.add(department)
    }
    if (EMPLOYMENT_TYPES.includes(record.employmentType)) {
      employmentTypes.add(record.employmentType)
    }
  }

  return {
    locations: Array.from(locations).sort(compareText),
    departments: Array.from(departments).sort(compareText),
    employmentTypes: EMPLOYMENT_TYPES.filter((type) => employmentTypes.has(type))
  }
}

function readSortValue(record: JobRecord, field: string): string | null {
  switch (field) {
    case "title":
      return record.title
    case "department":
      return record.department
    case "location":
      return record.location
    case "status":
      return record.status
    case "publishedAt":
      return record.publishedAt
    case "createdAt":
      return record.createdAt
    case "updatedAt":
      return record.updatedAt
    case "closedAt":
      return record.closedAt
    default:
      return null
  }
}

export function sortRecords(
  records: readonly JobRecord[],
  field: string,
  order: SortOrder
): JobRecord[] {
  const direction = order === "desc" ? -1 : 1

  return [...records].sort((a, b) => {
    const left = readSortValue(a, field)
    const right = readSortValue(b, field)

    if (left === null || right === null) {
      if (left === right) {
        return a.id.localeCompare(b.id)
      }
      return left === null ? 1 : -1
    }

    const result = compareText(left, right) * direction
    return result !== 0 ? result : a.id.localeCompare(b.id)
  })
}

export function buildPagination(page: number, limit: number, total: number): Pagination {
  return { page, limit, total, totalPages: limit > 0 ? Math.ceil(total / limit) : 0 }
}

/**
 * Out-of-range pages are clamped to the last available page so a hand-edited or
 * stale `?page=` value still renders results instead of an empty grid.
 */
export function paginateRecords<T>(
  records: readonly T[],
  page: number,
  limit: number
): { page: T[]; pagination: Pagination } {
  const total = records.length
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0
  const safePage = totalPages > 0 ? Math.min(Math.max(page, 1), totalPages) : 1
  const start = (safePage - 1) * limit

  return {
    page: records.slice(start, start + limit),
    pagination: buildPagination(safePage, limit, total)
  }
}
