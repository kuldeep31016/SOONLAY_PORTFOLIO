export const JOB_QUERY_KEYS = [
  "search",
  "status",
  "location",
  "department",
  "employmentType",
  "sort",
  "order",
  "page",
  "limit",
  "archived"
] as const
export const JOB_SORTS = ["newest", "oldest", "title", "updated"] as const
export const JOB_STATUS_FILTERS = ["PUBLISHED", "DRAFT", "CLOSED"] as const

export type JobSort = (typeof JOB_SORTS)[number]
export type JobStatusFilter = (typeof JOB_STATUS_FILTERS)[number]

export interface JobListQuery {
  q: string
  status: JobStatusFilter | ""
  location: string
  department: string
  employmentType: string
  sort: JobSort
  page: number
  limit: number
  archived: boolean
}

export type QueryInput = URLSearchParams | Record<string, string | string[] | undefined>

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100
const MAX_PAGE = 1000

function getValue(input: QueryInput, key: string) {
  if (input instanceof URLSearchParams) {
    return input.get(key) ?? ""
  }
  const value = input[key]
  return Array.isArray(value) ? value[0] ?? "" : value ?? ""
}

function positiveInteger(value: string, fallback: number, maximum: number) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback
  }
  return Math.min(parsed, maximum)
}

export function parseJobListQuery(input: QueryInput): JobListQuery {
  const rawSearch = getValue(input, "search") || getValue(input, "q")
  const rawStatus = getValue(input, "status").toUpperCase()
  const rawSort = getValue(input, "sort").toLowerCase()
  const archivedValue = getValue(input, "archived") || getValue(input, "includeArchived")

  return {
    q: rawSearch.trim().slice(0, 160),
    status: JOB_STATUS_FILTERS.includes(rawStatus as JobStatusFilter) ? (rawStatus as JobStatusFilter) : "",
    location: getValue(input, "location").trim().slice(0, 80),
    department: getValue(input, "department").trim().slice(0, 80),
    employmentType: getValue(input, "employmentType").trim().slice(0, 80),
    sort: JOB_SORTS.includes(rawSort as JobSort) ? (rawSort as JobSort) : "newest",
    page: positiveInteger(getValue(input, "page"), 1, MAX_PAGE),
    limit: positiveInteger(getValue(input, "limit"), DEFAULT_LIMIT, MAX_LIMIT),
    archived: ["1", "true", "yes"].includes(archivedValue.toLowerCase())
  }
}

export function toSearchParams(query: JobListQuery) {
  const params = new URLSearchParams()
  if (query.q) params.set("search", query.q)
  if (query.status) params.set("status", query.status)
  if (query.location) params.set("location", query.location)
  if (query.department) params.set("department", query.department)
  if (query.employmentType) params.set("employmentType", query.employmentType)
  if (query.sort !== "newest") params.set("sort", query.sort)
  if (query.page > 1) params.set("page", String(query.page))
  if (query.limit !== DEFAULT_LIMIT) params.set("limit", String(query.limit))
  if (query.archived) params.set("archived", "true")
  return params
}

export function toPublicJobQuery(query: JobListQuery) {
  const params = new URLSearchParams()
  if (query.q) params.set("search", query.q)
  if (query.status) params.set("status", query.status)
  if (query.location) params.set("location", query.location)
  if (query.department) params.set("department", query.department)
  if (query.employmentType) params.set("employmentType", query.employmentType)
  const sortMap: Record<JobSort, { sort: string; order: "asc" | "desc" }> = {
    newest: { sort: "createdAt", order: "desc" },
    oldest: { sort: "createdAt", order: "asc" },
    title: { sort: "title", order: "asc" },
    updated: { sort: "updatedAt", order: "desc" }
  }
  const sort = sortMap[query.sort]
  params.set("sort", sort.sort)
  params.set("order", sort.order)
  params.set("page", String(query.page))
  params.set("limit", String(query.limit))
  params.set("archived", query.archived ? "true" : "false")
  return Object.fromEntries(params.entries())
}
