import { describe, expect, it } from "vitest"

import { ValidationError } from "@/lib/careers/errors"
import {
  parseCreateJobInput,
  parseJobStatusInput,
  parseUpdateJobInput
} from "@/lib/careers/validation"
import type { JobInput } from "@/lib/careers/types"

const validJob = {
  title: "Senior Frontend Engineer",
  shortDescription: "Build the Soonlay web platform.",
  description: "You will own the design system and ship production React.",
  department: "Engineering",
  location: "Remote — India",
  employmentType: "Full-time",
  experienceLevel: "5+ years",
  responsibilities: ["Ship features", "Review code"],
  requirements: ["Strong TypeScript"],
  niceToHave: ["Next.js"],
  benefits: ["Learning budget"],
  skills: ["React", "TypeScript"],
  applicationUrl: "https://jobs.example.com/apply/frontend",
  status: "DRAFT",
  featured: false
} satisfies JobInput

function fieldErrors(run: () => unknown): Record<string, string[]> {
  try {
    run()
  } catch (error) {
    if (error instanceof ValidationError) {
      const details = error.details as { fieldErrors?: Record<string, string[]> } | undefined
      return details?.fieldErrors ?? {}
    }
    throw error
  }
  throw new Error("Expected a ValidationError")
}

describe("parseCreateJobInput", () => {
  it("accepts a complete payload", () => {
    expect(parseCreateJobInput(validJob)).toEqual(validJob)
  })

  it("trims strings and drops blank list entries", () => {
    const input = parseCreateJobInput({
      ...validJob,
      title: "  Senior Frontend Engineer  ",
      skills: [" React ", "", "   ", "TypeScript", "React"]
    })

    expect(input.title).toBe("Senior Frontend Engineer")
    expect(input.skills).toEqual(["React", "TypeScript"])
  })

  it("fills in optional defaults", () => {
    const input = parseCreateJobInput({
      title: "Engineer",
      description: "A role.",
      department: "Engineering",
      location: "Remote",
      employmentType: "Full-time",
      applicationUrl: "https://jobs.example.com/apply/1",
      status: "DRAFT"
    })

    expect(input.shortDescription).toBe("")
    expect(input.experienceLevel).toBeNull()
    expect(input.responsibilities).toEqual([])
    expect(input.requirements).toEqual([])
    expect(input.niceToHave).toEqual([])
    expect(input.benefits).toEqual([])
    expect(input.skills).toEqual([])
    expect(input.featured).toBe(false)
  })

  it("requires an https application URL", () => {
    expect(fieldErrors(() => parseCreateJobInput({ ...validJob, applicationUrl: "http://jobs.example.com/apply" }))).toHaveProperty(
      "applicationUrl"
    )
    expect(fieldErrors(() => parseCreateJobInput({ ...validJob, applicationUrl: "javascript:alert(1)" }))).toHaveProperty(
      "applicationUrl"
    )
    expect(fieldErrors(() => parseCreateJobInput({ ...validJob, applicationUrl: "not a url" }))).toHaveProperty(
      "applicationUrl"
    )
    expect(fieldErrors(() => parseCreateJobInput({ ...validJob, applicationUrl: "" }))).toHaveProperty(
      "applicationUrl"
    )
  })

  it("rejects an unknown employment type or status", () => {
    expect(fieldErrors(() => parseCreateJobInput({ ...validJob, employmentType: "Freelance" }))).toHaveProperty(
      "employmentType"
    )
    expect(fieldErrors(() => parseCreateJobInput({ ...validJob, status: "ARCHIVED" }))).toHaveProperty("status")
  })

  it("rejects blank required fields", () => {
    expect(fieldErrors(() => parseCreateJobInput({ ...validJob, title: "   " }))).toHaveProperty("title")
    expect(fieldErrors(() => parseCreateJobInput({ ...validJob, description: "" }))).toHaveProperty("description")
    expect(fieldErrors(() => parseCreateJobInput({ ...validJob, department: "" }))).toHaveProperty("department")
    expect(fieldErrors(() => parseCreateJobInput({ ...validJob, location: "" }))).toHaveProperty("location")
  })

  it("rejects oversized fields", () => {
    expect(fieldErrors(() => parseCreateJobInput({ ...validJob, title: "a".repeat(121) }))).toHaveProperty("title")
    expect(fieldErrors(() => parseCreateJobInput({ ...validJob, description: "a".repeat(20001) }))).toHaveProperty(
      "description"
    )
    expect(
      fieldErrors(() => parseCreateJobInput({ ...validJob, skills: Array.from({ length: 41 }, () => "React") }))
    ).toHaveProperty("skills")
  })

  it("rejects a body that is not an object", () => {
    expect(fieldErrors(() => parseCreateJobInput("nope"))).toHaveProperty("request")
    expect(fieldErrors(() => parseCreateJobInput(null))).toHaveProperty("request")
  })
})

describe("parseUpdateJobInput", () => {
  it("accepts a partial payload", () => {
    expect(parseUpdateJobInput({ title: "Staff Engineer" })).toEqual({ title: "Staff Engineer" })
  })

  it("requires at least one field", () => {
    expect(fieldErrors(() => parseUpdateJobInput({}))).toHaveProperty("request")
  })

  it("still validates the fields that are present", () => {
    expect(fieldErrors(() => parseUpdateJobInput({ applicationUrl: "http://insecure.example.com" }))).toHaveProperty(
      "applicationUrl"
    )
    expect(fieldErrors(() => parseUpdateJobInput({ status: "REMOVED" }))).toHaveProperty("status")
  })

  it("cannot clear a field by sending undefined", () => {
    expect(parseUpdateJobInput({ experienceLevel: null })).toEqual({ experienceLevel: null })
  })
})

describe("parseJobStatusInput", () => {
  it("accepts every lifecycle status", () => {
    expect(parseJobStatusInput({ status: "DRAFT" })).toEqual({ status: "DRAFT" })
    expect(parseJobStatusInput({ status: "PUBLISHED" })).toEqual({ status: "PUBLISHED" })
    expect(parseJobStatusInput({ status: "CLOSED" })).toEqual({ status: "CLOSED" })
  })

  it("rejects anything else", () => {
    expect(fieldErrors(() => parseJobStatusInput({ status: "ARCHIVED" }))).toHaveProperty("status")
    expect(fieldErrors(() => parseJobStatusInput({}))).toHaveProperty("status")
    expect(fieldErrors(() => parseJobStatusInput("PUBLISHED"))).toHaveProperty("request")
  })
})
