import { z } from "zod"
import {
  budgets,
  contactMethods,
  featureOptions,
  ids,
  industries,
  orgTypes,
  platformOptions,
  productTypes,
  stages,
  timelines,
  userTypes
} from "./options"

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined))

export const projectScopeSchema = z.object({
  productType: z.enum(ids(productTypes)),
  idea: z.string().trim().min(20, "Please describe your idea in a sentence or two.").max(3000),
  users: z.array(z.enum(ids(userTypes))).min(1).max(userTypes.length),
  platforms: z.enum(ids(platformOptions)),
  features: z.array(z.enum(ids(featureOptions))).max(featureOptions.length),
  industry: z.enum(ids(industries)).optional()
})

export const projectBriefSchema = z.object({
  projectName: z.string().max(120),
  summary: z.string().max(600),
  userRoles: z
    .array(z.object({ role: z.string().max(80), needs: z.string().max(300) }))
    .max(8),
  coreModules: z
    .array(z.object({ name: z.string().max(80), description: z.string().max(300) }))
    .max(16),
  integrations: z.array(z.string().max(120)).max(12),
  mvpScope: z.array(z.string().max(200)).max(12),
  laterScope: z.array(z.string().max(200)).max(12),
  openQuestions: z.array(z.string().max(250)).max(8)
})

export type ProjectBrief = z.infer<typeof projectBriefSchema>

export const leadSchema = projectScopeSchema.extend({
  orgType: z.enum(ids(orgTypes)),
  industry: z.enum(ids(industries)),
  stage: z.enum(ids(stages)),
  timeline: z.enum(ids(timelines)),
  budget: z.enum(ids(budgets)),
  name: z.string().trim().min(2).max(120),
  email: z.email().max(200),
  company: optionalText(160),
  website: optionalText(300),
  phone: optionalText(40),
  preferredContact: z.enum(ids(contactMethods)),
  brief: projectBriefSchema.optional(),
  source: optionalText(200),
  utm: z.record(z.string().max(40), z.string().max(200)).optional(),
  // Honeypot: real visitors never see or fill this field.
  fax: z.string().max(200).optional()
})

export type LeadInput = z.infer<typeof leadSchema>
export type ProjectScopeInput = z.infer<typeof projectScopeSchema>
