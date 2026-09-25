import { z } from "zod"
import { EMPLOYMENT_TYPES, JOB_STATUSES } from "./types"

const MAX_TITLE_LENGTH = 120
const MAX_SHORT_DESCRIPTION_LENGTH = 400
const MAX_DESCRIPTION_LENGTH = 20000
const MAX_DEPARTMENT_LENGTH = 80
const MAX_LOCATION_LENGTH = 80
const MAX_EXPERIENCE_LEVEL_LENGTH = 60
const MAX_APPLICATION_URL_LENGTH = 2048
const MAX_SKILL_COUNT = 40
const MAX_SKILL_LENGTH = 80
const MAX_SECTION_COUNT = 30
const MAX_SECTION_ITEM_LENGTH = 500

const requiredText = (label: string, maximum: number) =>
  z.string().trim().min(1, `${label} is required`).max(maximum, `${label} is too long`)

const shortDescriptionField = z
  .string()
  .trim()
  .max(MAX_SHORT_DESCRIPTION_LENGTH, "Short description is too long")

const shortDescriptionInputField = shortDescriptionField.default("")

const optionalText = (label: string, maximum: number) =>
  z.preprocess(
    (value) => (value === "" ? null : value),
    z.string().trim().max(maximum, `${label} is too long`).nullable()
  )

const listField = (label: string, maximumCount: number, maximumLength: number) =>
  z
    .array(
      z
        .string()
        .trim()
        .min(1, `${label} entries cannot be empty`)
        .max(maximumLength, `${label} entries are too long`)
    )
    .max(maximumCount, `${label} has too many entries`)

const isHttpsUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === "https:" && url.hostname.length > 0
  } catch {
    return false
  }
}

const applicationUrlField = z
  .string()
  .trim()
  .min(1, "Application URL is required")
  .max(MAX_APPLICATION_URL_LENGTH, "Application URL is too long")
  .refine(isHttpsUrl, "Enter a valid https:// application URL")

const jobFields = {
  title: requiredText("Title", MAX_TITLE_LENGTH),
  shortDescription: shortDescriptionInputField,
  description: requiredText("Description", MAX_DESCRIPTION_LENGTH),
  department: requiredText("Department", MAX_DEPARTMENT_LENGTH),
  location: requiredText("Location", MAX_LOCATION_LENGTH),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  experienceLevel: optionalText("Experience level", MAX_EXPERIENCE_LEVEL_LENGTH),
  responsibilities: listField("Responsibilities", MAX_SECTION_COUNT, MAX_SECTION_ITEM_LENGTH),
  requirements: listField("Requirements", MAX_SECTION_COUNT, MAX_SECTION_ITEM_LENGTH),
  niceToHave: listField("Nice-to-have", MAX_SECTION_COUNT, MAX_SECTION_ITEM_LENGTH),
  benefits: listField("Benefits", MAX_SECTION_COUNT, MAX_SECTION_ITEM_LENGTH),
  skills: listField("Skills", MAX_SKILL_COUNT, MAX_SKILL_LENGTH),
  applicationUrl: applicationUrlField,
  status: z.enum(JOB_STATUSES),
  featured: z.boolean()
}

export const jobInputSchema = z.object(jobFields).strict()

export const jobUpdateSchema = z
  .object({
    title: jobFields.title.optional(),
    shortDescription: shortDescriptionField.optional(),
    description: jobFields.description.optional(),
    department: jobFields.department.optional(),
    location: jobFields.location.optional(),
    employmentType: jobFields.employmentType.optional(),
    experienceLevel: jobFields.experienceLevel.optional(),
    responsibilities: jobFields.responsibilities.optional(),
    requirements: jobFields.requirements.optional(),
    niceToHave: jobFields.niceToHave.optional(),
    benefits: jobFields.benefits.optional(),
    skills: jobFields.skills.optional(),
    applicationUrl: jobFields.applicationUrl.optional(),
    status: jobFields.status.optional(),
    featured: jobFields.featured.optional()
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one field to update"
  })

export const sessionCreateSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email address").max(254, "Email is too long"),
    password: z.string().min(1, "Password is required").max(1024, "Password is too long")
  })
  .strict()

export const jobStatusSchema = z
  .object({
    status: z.enum(JOB_STATUSES)
  })
  .strict()

export const jobIdSchema = z
  .string()
  .trim()
  .min(1, "Job id is required")
  .max(200, "Job id is invalid")
  .regex(/^[A-Za-z0-9_-]+$/, "Job id is invalid")

export type ValidatedJobInput = z.infer<typeof jobInputSchema>
export type ValidatedJobUpdate = z.infer<typeof jobUpdateSchema>
