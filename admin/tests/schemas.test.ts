import { describe, expect, it } from "vitest"

import { jobIdSchema, jobInputSchema, jobStatusSchema, jobUpdateSchema, sessionCreateSchema } from "@/lib/schemas"

const validJob = {
  title: "Senior Frontend Engineer",
  shortDescription: "Ship great work.",
  description: "Own the design system.",
  department: "Engineering",
  location: "Remote — India",
  employmentType: "Full-time",
  experienceLevel: "5+ years",
  responsibilities: ["Ship features"],
  requirements: ["Strong TypeScript"],
  niceToHave: ["Next.js"],
  benefits: ["Learning budget"],
  skills: ["React", "TypeScript"],
  applicationUrl: "https://jobs.example.com/apply/frontend",
  status: "DRAFT",
  featured: false
}

function issues(run: () => unknown) {
  try {
    run()
  } catch (error) {
    if (error && typeof error === "object" && "issues" in error) {
      return (error as { issues: Array<{ path: unknown[]; message: string }> }).issues
    }
    throw error
  }
  throw new Error("Expected validation to fail")
}

describe("jobInputSchema", () => {
  it("accepts a complete job", () => {
    expect(jobInputSchema.safeParse(validJob).success).toBe(true)
  })

  it("requires an https application URL", () => {
    for (const applicationUrl of [
      "http://jobs.example.com/apply",
      "javascript:alert(1)",
      "not-a-url",
      ""
    ]) {
      expect(jobInputSchema.safeParse({ ...validJob, applicationUrl }).success).toBe(false)
    }
  })

  it("rejects unknown fields so a typo cannot silently drop data", () => {
    const result = jobInputSchema.safeParse({ ...validJob, slug: "hand-edited" })
    expect(result.success).toBe(false)
  })

  it("rejects an employment type or status outside the allowed sets", () => {
    expect(jobInputSchema.safeParse({ ...validJob, employmentType: "Freelance" }).success).toBe(false)
    expect(jobInputSchema.safeParse({ ...validJob, status: "ARCHIVED" }).success).toBe(false)
  })

  it("rejects blank list entries", () => {
    expect(jobInputSchema.safeParse({ ...validJob, skills: ["React", "  "] }).success).toBe(false)
  })

  it("treats an empty experience level as null", () => {
    expect(jobInputSchema.safeParse({ ...validJob, experienceLevel: "" }).data?.experienceLevel).toBeNull()
  })

  it("reports a human-readable message per field", () => {
    const reported = issues(() => jobInputSchema.parse({ ...validJob, title: "" }))
    expect(reported[0].message).toBe("Title is required")
    expect(reported[0].path).toEqual(["title"])
  })
})

describe("jobUpdateSchema", () => {
  it("accepts a single field", () => {
    expect(jobUpdateSchema.safeParse({ title: "Staff Engineer" }).success).toBe(true)
  })

  it("rejects an empty update", () => {
    expect(jobUpdateSchema.safeParse({}).success).toBe(false)
  })

  it("rejects unknown fields", () => {
    expect(jobUpdateSchema.safeParse({ archivedAt: "2026-01-01" }).success).toBe(false)
  })

  it("rejects an invalid application URL", () => {
    expect(jobUpdateSchema.safeParse({ applicationUrl: "http://insecure.example.com" }).success).toBe(false)
  })
})

describe("jobStatusSchema", () => {
  it("accepts the three lifecycle states", () => {
    for (const status of ["DRAFT", "PUBLISHED", "CLOSED"]) {
      expect(jobStatusSchema.safeParse({ status }).success).toBe(true)
    }
  })

  it("rejects anything else", () => {
    expect(jobStatusSchema.safeParse({ status: "ARCHIVED" }).success).toBe(false)
    expect(jobStatusSchema.safeParse({ status: "archived" }).success).toBe(false)
    expect(jobStatusSchema.safeParse({}).success).toBe(false)
    expect(jobStatusSchema.safeParse({ status: "DRAFT", force: true }).success).toBe(false)
  })
})

describe("jobIdSchema", () => {
  it("accepts Firestore-style document ids", () => {
    for (const id of ["abc123", "a-b_c", "A1", "x".repeat(200)]) {
      expect(jobIdSchema.safeParse(id).success).toBe(true)
    }
  })

  it("rejects anything that could traverse a path or inject a header", () => {
    for (const id of ["", "   ", "../admin", "a/b", "a b", "a?b", "a#b", "a%2Fb", "x".repeat(201)]) {
      expect(jobIdSchema.safeParse(id).success).toBe(false)
    }
  })
})

describe("sessionCreateSchema", () => {
  it("accepts an email and password", () => {
    expect(sessionCreateSchema.safeParse({ email: "admin@soonlay.com", password: "password123" }).success).toBe(true)
  })

  it("trims surrounding whitespace from the email", () => {
    const parsed = sessionCreateSchema.safeParse({ email: "  admin@soonlay.com  ", password: "password123" })
    expect(parsed.success).toBe(true)
    expect(parsed.data?.email).toBe("admin@soonlay.com")
  })

  it("rejects a missing or malformed email", () => {
    expect(sessionCreateSchema.safeParse({ password: "password123" }).success).toBe(false)
    expect(sessionCreateSchema.safeParse({ email: "not-an-email", password: "password123" }).success).toBe(false)
    expect(sessionCreateSchema.safeParse({ email: "", password: "password123" }).success).toBe(false)
    expect(sessionCreateSchema.safeParse({ email: "a".repeat(250) + "@soonlay.com", password: "x" }).success).toBe(false)
  })

  it("rejects a missing or implausible password", () => {
    expect(sessionCreateSchema.safeParse({ email: "admin@soonlay.com" }).success).toBe(false)
    expect(sessionCreateSchema.safeParse({ email: "admin@soonlay.com", password: "" }).success).toBe(false)
    expect(sessionCreateSchema.safeParse({ email: "admin@soonlay.com", password: "x".repeat(1025) }).success).toBe(false)
  })

  it("rejects a missing password rather than defaulting it", () => {
    const parsed = sessionCreateSchema.safeParse({ email: "admin@soonlay.com" })
    expect(parsed.success).toBe(false)
    expect(parsed.data?.password).toBeUndefined()
  })

  it("rejects extra properties such as an injected role", () => {
    expect(
      sessionCreateSchema.safeParse({ email: "admin@soonlay.com", password: "password123", role: "admin" }).success
    ).toBe(false)
  })
})
