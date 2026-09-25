export const JOB_STATUSES = ["DRAFT", "PUBLISHED", "CLOSED"] as const
export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Internship", "Contract"] as const

export type JobStatus = (typeof JOB_STATUSES)[number]
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]

export interface JobRecord {
  id: string
  title: string
  slug: string
  shortDescription: string
  description: string
  department: string
  location: string
  employmentType: EmploymentType
  experienceLevel: string | null
  responsibilities: string[]
  requirements: string[]
  niceToHave: string[]
  benefits: string[]
  skills: string[]
  applicationUrl: string
  status: JobStatus
  featured: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  closedAt: string | null
  archivedAt: string | null
}

export type PublicJob = Omit<JobRecord, "archivedAt">

export interface JobInput {
  title: string
  shortDescription: string
  description: string
  department: string
  location: string
  employmentType: EmploymentType
  experienceLevel: string | null
  responsibilities: string[]
  requirements: string[]
  niceToHave: string[]
  benefits: string[]
  skills: string[]
  applicationUrl: string
  status: JobStatus
  featured: boolean
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface JobFilters {
  locations: string[]
  departments: string[]
  employmentTypes: EmploymentType[]
}

export interface JobListResponse {
  jobs: JobRecord[]
  pagination: Pagination
  filters: JobFilters
  truncated: boolean
}

export interface JobStats {
  active: number
  draft: number
  closed: number
  total: number
  archived: number
}

export interface SessionResponse {
  authenticated: boolean
}
