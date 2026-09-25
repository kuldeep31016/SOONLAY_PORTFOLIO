import { z } from "zod"

import { ValidationError } from "./errors"
import { EMPLOYMENT_TYPES, JOB_STATUSES, type EmploymentType, type JobInput, type JobStatus } from "./types"

export const MAX_TITLE_LENGTH = 120
export const MAX_SHORT_DESCRIPTION_LENGTH = 400
export const MAX_DESCRIPTION_LENGTH = 20000
export const MAX_DEPARTMENT_LENGTH = 80
export const MAX_LOCATION_LENGTH = 80
export const MAX_EXPERIENCE_LEVEL_LENGTH = 60
export const MAX_APPLICATION_URL_LENGTH = 2048
export const MAX_SKILL_COUNT = 40
export const MAX_SKILL_LENGTH = 80
export const MAX_SECTION_COUNT = 30
export const MAX_SECTION_ITEM_LENGTH = 500
export const MAX_SEARCH_LENGTH = 160

export type JobUpdateInput = Partial<JobInput>

export interface ZodIssueLike {
  path: ReadonlyArray<PropertyKey>
  message: string
}

function normalizeList(values: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const value of values) {
    const normalized = value.trim()
    if (normalized.length === 0 || seen.has(normalized)) {
      continue
    }
    seen.add(normalized)
    result.push(normalized)
  }
  return result
}
function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "https:" && url.hostname.length > 0
  } catch {
    return false
  }
}

function sectionField(maxCount: number, maxLength: number) {
  return z
    .array(z.string().max(maxLength))
    .max(maxCount, `A maximum of ${maxCount} entries is allowed`)
    .transform(normalizeList)
}

const titleField = z.string().trim().min(1, "Title is required").max(MAX_TITLE_LENGTH)
const shortDescriptionField = z.string().trim().max(MAX_SHORT_DESCRIPTION_LENGTH)
const descriptionField = z.string().trim().min(1, "Description is required").max(MAX_DESCRIPTION_LENGTH)
const departmentField = z.string().trim().min(1, "Department is required").max(MAX_DEPARTMENT_LENGTH)
const locationField = z.string().trim().min(1, "Location is required").max(MAX_LOCATION_LENGTH)
const employmentTypeField = z.enum(EMPLOYMENT_TYPES)
const experienceLevelField = z.string().trim().max(MAX_EXPERIENCE_LEVEL_LENGTH).nullable()
const responsibilitiesField = sectionField(MAX_SECTION_COUNT, MAX_SECTION_ITEM_LENGTH)
const requirementsField = sectionField(MAX_SECTION_COUNT, MAX_SECTION_ITEM_LENGTH)
const niceToHaveField = sectionField(MAX_SECTION_COUNT, MAX_SECTION_ITEM_LENGTH)
const benefitsField = sectionField(MAX_SECTION_COUNT, MAX_SECTION_ITEM_LENGTH)
const skillsField = sectionField(MAX_SKILL_COUNT, MAX_SKILL_LENGTH)
const applicationUrlField = z
  .string()
  .trim()
  .min(1, "Application URL is required")
  .max(MAX_APPLICATION_URL_LENGTH)
  .refine(isHttpsUrl, "Application URL must be a valid https:// URL")
const statusField = z.enum(JOB_STATUSES)
const featuredField = z.boolean()

export const createJobInputSchema = z.object({
  title: titleField,
  shortDescription: shortDescriptionField.default(""),
  description: descriptionField,
  department: departmentField,
  location: locationField,
  employmentType: employmentTypeField,
  experienceLevel: experienceLevelField.default(null),
  responsibilities: responsibilitiesField.default([]),
  requirements: requirementsField.default([]),
  niceToHave: niceToHaveField.default([]),
  benefits: benefitsField.default([]),
  skills: skillsField.default([]),
  applicationUrl: applicationUrlField,
  status: statusField,
  featured: featuredField.default(false)
})

export const updateJobInputSchema = z
  .object({
    title: titleField.optional(),
    shortDescription: shortDescriptionField.optional(),
    description: descriptionField.optional(),
    department: departmentField.optional(),
    location: locationField.optional(),
    employmentType: employmentTypeField.optional(),
    experienceLevel: experienceLevelField.optional(),
    responsibilities: responsibilitiesField.optional(),
    requirements: requirementsField.optional(),
    niceToHave: niceToHaveField.optional(),
    benefits: benefitsField.optional(),
    skills: skillsField.optional(),
    applicationUrl: applicationUrlField.optional(),
    status: statusField.optional(),
    featured: featuredField.optional()
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one field to update"
  })

export const jobStatusInputSchema = z.object({
  status: statusField
})

export function fieldErrorsFromIssues(issues: ReadonlyArray<ZodIssueLike>): Record<string, string[]> {
  const errors: Record<string, string[]> = {}
  for (const issue of issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "request"
    const messages = errors[key] ?? (errors[key] = [])
    messages.push(issue.message)
  }
  return errors
}

function toValidationError(message: string, issues: ReadonlyArray<ZodIssueLike>): ValidationError {
  return new ValidationError(message, { fieldErrors: fieldErrorsFromIssues(issues) })
}

export function parseCreateJobInput(body: unknown): JobInput {
  const result = createJobInputSchema.safeParse(body)
  if (!result.success) {
    throw toValidationError("Invalid job payload", result.error.issues)
  }
  return result.data
}

export function parseUpdateJobInput(body: unknown): JobUpdateInput {
  const result = updateJobInputSchema.safeParse(body)
  if (!result.success) {
    throw toValidationError("Invalid job payload", result.error.issues)
  }
  return result.data
}

export function parseJobStatusInput(body: unknown): { status: JobStatus } {
  const result = jobStatusInputSchema.safeParse(body)
  if (!result.success) {
    throw toValidationError("Invalid status payload", result.error.issues)
  }
  return result.data
}

export const EMPLOYMENT_TYPE_VALUES: readonly EmploymentType[] = EMPLOYMENT_TYPES
export const JOB_STATUS_VALUES: readonly JobStatus[] = JOB_STATUSES
