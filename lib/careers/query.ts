import { z } from "zod"

import { ValidationError } from "./errors"
import { EMPLOYMENT_TYPES, JOB_STATUSES, type EmploymentType, type JobStatus } from "./types"
import { MAX_SEARCH_LENGTH, fieldErrorsFromIssues } from "./validation"
import { tokenize } from "./slug"

export const MAX_PUBLIC_LIMIT = 50
export const MAX_ADMIN_LIMIT = 100
export const MAX_PAGE = 1000
export const MAX_QUERY_SEARCH_TERMS = 6
export const DEFAULT_PUBLIC_LIMIT = 10
export const DEFAULT_ADMIN_LIMIT = 20

export const PUBLIC_SORT_FIELDS = ["publishedAt", "createdAt", "title"] as const
export const ADMIN_SORT_FIELDS = [
  "createdAt",
  "updatedAt",
  "publishedAt",
  "closedAt",
  "title",
  "department",
  "location",
  "status"
] as const
export const SORT_ORDERS = ["asc", "desc"] as const

export type PublicSortField = (typeof PUBLIC_SORT_FIELDS)[number]
export type AdminSortField = (typeof ADMIN_SORT_FIELDS)[number]
export type SortOrder = (typeof SORT_ORDERS)[number]

export interface PublicJobQuery {
  search: string
  searchTerms: string[]
  location: string | null
  department: string | null
  employmentType: EmploymentType | null
  featured: boolean | null
  page: number
  limit: number
  sort: PublicSortField
  order: SortOrder
}

export interface AdminJobQuery {
  search: string
  searchTerms: string[]
  status: JobStatus | null
  location: string | null
  department: string | null
  employmentType: EmploymentType | null
  archived: boolean | null
  page: number
  limit: number
  sort: AdminSortField
  order: SortOrder
}

function readPositiveIntegerEnv(name: string, fallback: number, max: number): number {
  if (typeof process === "undefined") {
    return fallback
  }
  const raw = process.env[name]
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return fallback
  }
  const parsed = Number.parseInt(raw.trim(), 10)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback
  }
  return Math.min(parsed, max)
}

export function getDefaultPublicLimit(): number {
  return readPositiveIntegerEnv("CAREERS_PAGE_SIZE", DEFAULT_PUBLIC_LIMIT, MAX_PUBLIC_LIMIT)
}

export function getDefaultAdminLimit(): number {
  return readPositiveIntegerEnv("CAREERS_ADMIN_PAGE_SIZE", DEFAULT_ADMIN_LIMIT, MAX_ADMIN_LIMIT)
}

function toSearchRecord(params: URLSearchParams): Record<string, string> {
  const record: Record<string, string> = {}
  params.forEach((value, key) => {
    const trimmed = value.trim()
    if (trimmed.length > 0) {
      record[key] = trimmed
    }
  })
  return record
}

function fieldErrors(error: { issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }> }): ValidationError {
  return new ValidationError("Invalid query parameters", { fieldErrors: fieldErrorsFromIssues(error.issues) })
}

const booleanFlagSchema = z
  .string()
  .trim()
  .toLowerCase()
  .refine((value) => value === "true" || value === "false", { message: "Expected true or false" })
  .transform((value) => value === "true")

const orderSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.enum(SORT_ORDERS))

const pageSchema = z.coerce.number().int().min(1).max(MAX_PAGE)
const searchSchema = z.string().trim().max(MAX_SEARCH_LENGTH)
const locationSchema = z.string().trim().min(1).max(80)
const departmentSchema = z.string().trim().min(1).max(80)

/**
 * Public query parameters come from the address bar, so a mistyped or
 * hand-edited value falls back to the default instead of failing the whole page.
 * The admin parser below stays strict so tooling mistakes surface as errors.
 */
function lenient<T extends z.ZodType>(schema: T): z.ZodOptional<T> {
  return schema.catch(undefined as never) as unknown as z.ZodOptional<T>
}

const publicJobQuerySchema = z.object({
  search: lenient(z.string().transform((value) => value.slice(0, MAX_SEARCH_LENGTH))),
  location: lenient(locationSchema),
  department: lenient(departmentSchema),
  employmentType: lenient(z.enum(EMPLOYMENT_TYPES)),
  featured: lenient(booleanFlagSchema),
  page: lenient(pageSchema),
  limit: lenient(z.coerce.number().int().min(1).max(MAX_PUBLIC_LIMIT)),
  sort: lenient(z.enum(PUBLIC_SORT_FIELDS)),
  order: lenient(orderSchema)
})

const adminJobQuerySchema = z.object({
  search: searchSchema.optional(),
  status: z.enum(JOB_STATUSES).optional(),
  location: locationSchema.optional(),
  department: departmentSchema.optional(),
  employmentType: z.enum(EMPLOYMENT_TYPES).optional(),
  archived: booleanFlagSchema.optional(),
  page: pageSchema.optional(),
  limit: z.coerce.number().int().min(1).max(MAX_ADMIN_LIMIT).optional(),
  sort: z.enum(ADMIN_SORT_FIELDS).optional(),
  order: orderSchema.optional()
})

export function parsePublicJobQuery(params: URLSearchParams): PublicJobQuery {
  const result = publicJobQuerySchema.safeParse(toSearchRecord(params))
  if (!result.success) {
    throw fieldErrors(result.error)
  }

  const search = result.data.search ?? ""

  return {
    search,
    searchTerms: tokenize(search).slice(0, MAX_QUERY_SEARCH_TERMS),
    location: result.data.location ?? null,
    department: result.data.department ?? null,
    employmentType: result.data.employmentType ?? null,
    featured: result.data.featured ?? null,
    page: result.data.page ?? 1,
    limit: result.data.limit ?? getDefaultPublicLimit(),
    sort: result.data.sort ?? "publishedAt",
    order: result.data.order ?? "desc"
  }
}
export function parseAdminJobQuery(params: URLSearchParams): AdminJobQuery {
  const result = adminJobQuerySchema.safeParse(toSearchRecord(params))
  if (!result.success) {
    throw fieldErrors(result.error)
  }

  const search = result.data.search ?? ""

  return {
    search,
    searchTerms: tokenize(search).slice(0, MAX_QUERY_SEARCH_TERMS),
    status: result.data.status ?? null,
    location: result.data.location ?? null,
    department: result.data.department ?? null,
    employmentType: result.data.employmentType ?? null,
    archived: result.data.archived ?? null,
    page: result.data.page ?? 1,
    limit: result.data.limit ?? getDefaultAdminLimit(),
    sort: result.data.sort ?? "updatedAt",
    order: result.data.order ?? "desc"
  }
}

export function toPublicJobQueryString(query: PublicJobQuery): string {
  const params = new URLSearchParams()

  if (query.search.trim().length > 0) {
    params.set("search", query.search)
  }
  if (query.location !== null) {
    params.set("location", query.location)
  }
  if (query.department !== null) {
    params.set("department", query.department)
  }
  if (query.employmentType !== null) {
    params.set("employmentType", query.employmentType)
  }
  if (query.featured !== null) {
    params.set("featured", query.featured ? "true" : "false")
  }
  if (query.page > 1) {
    params.set("page", String(query.page))
  }
  if (query.limit !== getDefaultPublicLimit()) {
    params.set("limit", String(query.limit))
  }
  if (query.sort !== "publishedAt" || query.order !== "desc") {
    params.set("sort", query.sort)
    params.set("order", query.order)
  }

  return params.toString()
}
