import { describe, expect, it } from "vitest"

import {
  buildFilterOptions,
  buildPagination,
  matchesFilters,
  matchesSearch,
  paginateRecords,
  sortRecords
} from "@/lib/careers/listing"
import type { JobRecord } from "@/lib/careers/types"

function job(overrides: Partial<JobRecord> = {}): JobRecord {
  return {
    id: "job-1",
    title: "Senior Frontend Engineer",
    slug: "senior-frontend-engineer",
    shortDescription: "Build the Soonlay web platform.",
    description: "You will own the design system and the product surface.",
    department: "Engineering",
    location: "Remote — India",
    employmentType: "Full-time",
    experienceLevel: "5+ years",
    responsibilities: ["Ship production React"],
    requirements: ["Strong TypeScript"],
    niceToHave: ["Next.js"],
    benefits: ["Remote budget"],
    skills: ["React", "TypeScript", "Next.js"],
    applicationUrl: "https://jobs.example.com/apply/1",
    status: "PUBLISHED",
    featured: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
    publishedAt: "2026-01-02T00:00:00.000Z",
    closedAt: null,
    archivedAt: null,
    ...overrides
  }
}

describe("matchesSearch", () => {
  it("matches everything when there are no terms", () => {
    expect(matchesSearch(job(), [])).toBe(true)
  })

  it("matches the title case-insensitively", () => {
    expect(matchesSearch(job(), ["FRONTEND"])).toBe(true)
    expect(matchesSearch(job(), ["frontend"])).toBe(true)
  })

  it("matches partial words", () => {
    expect(matchesSearch(job(), ["engineer"])).toBe(true)
    expect(matchesSearch(job(), ["engine"])).toBe(true)
  })

  it("searches the description, skills, and requirement bullets", () => {
    expect(matchesSearch(job(), ["typescript"])).toBe(true)
    expect(matchesSearch(job(), ["nextjs"])).toBe(true)
    expect(matchesSearch(job(), ["design system"])).toBe(true)
    expect(matchesSearch(job(), ["remote budget"])).toBe(true)
  })

  it("matches across a separator the query omits", () => {
    const role = job({ skills: ["Node.js", "GraphQL"] })
    expect(matchesSearch(role, ["nodejs"])).toBe(true)
    expect(matchesSearch(role, ["node"])).toBe(true)
    expect(matchesSearch(role, ["node js"])).toBe(true)
  })

  it("ignores diacritics in both the job text and the query", () => {
    const role = job({ title: "Ingénieur DevOps" })
    expect(matchesSearch(role, ["ingenieur"])).toBe(true)
  })

  it("requires every term to match", () => {
    expect(matchesSearch(job(), ["react", "typescript"])).toBe(true)
    expect(matchesSearch(job(), ["react", "kubernetes"])).toBe(false)
  })

  it("returns nothing for terms that appear nowhere", () => {
    expect(matchesSearch(job(), ["rust"])).toBe(false)
  })

  it("does not match on internal fields such as the application URL", () => {
    expect(matchesSearch(job(), ["jobs.example.com"])).toBe(false)
  })
})

describe("matchesFilters", () => {
  it("accepts a record when no filters are set", () => {
    expect(
      matchesFilters(job(), {
        status: null,
        location: null,
        department: null,
        employmentType: null,
        featured: null,
        archived: null
      })
    ).toBe(true)
  })

  it("filters by status", () => {
    const filters = {
      status: "DRAFT" as const,
      location: null,
      department: null,
      employmentType: null,
      featured: null,
      archived: null
    }
    expect(matchesFilters(job(), filters)).toBe(false)
    expect(matchesFilters(job({ status: "DRAFT" }), filters)).toBe(true)
  })

  it("treats archived as a tri-state", () => {
    const base = {
      status: null,
      location: null,
      department: null,
      employmentType: null,
      featured: null,
      archived: null
    }
    const archived = job({ archivedAt: "2026-02-01T00:00:00.000Z" })

    expect(matchesFilters(job(), { ...base, archived: false })).toBe(true)
    expect(matchesFilters(job(), { ...base, archived: true })).toBe(false)
    expect(matchesFilters(archived, { ...base, archived: false })).toBe(false)
    expect(matchesFilters(archived, { ...base, archived: true })).toBe(true)
  })

  it("filters by location, department, employment type, and featured", () => {
    const base = {
      status: null,
      location: null,
      department: null,
      employmentType: null,
      featured: null,
      archived: null
    }

    expect(matchesFilters(job(), { ...base, location: "Remote — India" })).toBe(true)
    expect(matchesFilters(job(), { ...base, location: "Berlin" })).toBe(false)
    expect(matchesFilters(job(), { ...base, department: "Engineering" })).toBe(true)
    expect(matchesFilters(job({ department: "Design" }), { ...base, department: "Engineering" })).toBe(false)
    expect(matchesFilters(job(), { ...base, employmentType: "Full-time" })).toBe(true)
    expect(matchesFilters(job(), { ...base, employmentType: "Contract" })).toBe(false)
    expect(matchesFilters(job({ featured: true }), { ...base, featured: true })).toBe(true)
    expect(matchesFilters(job(), { ...base, featured: true })).toBe(false)
  })
})

describe("buildFilterOptions", () => {
  it("deduplicates and sorts locations and departments", () => {
    const options = buildFilterOptions([
      job({ id: "a", location: "Remote", department: "Design" }),
      job({ id: "b", location: "Remote", department: "Engineering" }),
      job({ id: "c", location: "Berlin", department: "Design" })
    ])

    expect(options.locations).toEqual(["Berlin", "Remote"])
    expect(options.departments).toEqual(["Design", "Engineering"])
  })

  it("returns employment types in the canonical order, not discovery order", () => {
    const options = buildFilterOptions([
      job({ id: "a", employmentType: "Contract" }),
      job({ id: "b", employmentType: "Full-time" }),
      job({ id: "c", employmentType: "Internship" })
    ])

    expect(options.employmentTypes).toEqual(["Full-time", "Internship", "Contract"])
  })

  it("ignores blank locations and departments", () => {
    const options = buildFilterOptions([job({ location: "  ", department: " " })])
    expect(options.locations).toEqual([])
    expect(options.departments).toEqual([])
  })

  it("returns empty options for no records", () => {
    expect(buildFilterOptions([])).toEqual({
      locations: [],
      departments: [],
      employmentTypes: []
    })
  })
})

describe("sortRecords", () => {
  const records = [
    job({ id: "b", title: "Backend Engineer", publishedAt: "2026-03-01T00:00:00.000Z" }),
    job({ id: "a", title: "Android Engineer", publishedAt: null }),
    job({ id: "c", title: "Frontend Engineer", publishedAt: "2026-01-01T00:00:00.000Z" })
  ]

  it("sorts by a text field in both directions", () => {
    expect(sortRecords(records, "title", "asc").map((r) => r.id)).toEqual(["a", "b", "c"])
    expect(sortRecords(records, "title", "desc").map((r) => r.id)).toEqual(["c", "b", "a"])
  })

  it("keeps records with no timestamp last in both directions", () => {
    expect(sortRecords(records, "publishedAt", "desc").map((r) => r.id)).toEqual(["b", "c", "a"])
    expect(sortRecords(records, "publishedAt", "asc").map((r) => r.id)).toEqual(["c", "b", "a"])
  })

  it("breaks ties by id so ordering is stable across requests", () => {
    const tied = [
      job({ id: "z", title: "Engineer" }),
      job({ id: "a", title: "Engineer" }),
      job({ id: "m", title: "Engineer" })
    ]
    expect(sortRecords(tied, "title", "asc").map((r) => r.id)).toEqual(["a", "m", "z"])
  })

  it("does not mutate the input array", () => {
    const input = [...records]
    sortRecords(input, "title", "asc")
    expect(input.map((r) => r.id)).toEqual(["b", "a", "c"])
  })

  it("treats an unknown sort field as empty values", () => {
    expect(sortRecords(records, "nope", "asc").map((r) => r.id)).toEqual(["a", "b", "c"])
  })
})

describe("buildPagination", () => {
  it("computes the page count", () => {
    expect(buildPagination(1, 10, 25)).toEqual({ page: 1, limit: 10, total: 25, totalPages: 3 })
    expect(buildPagination(1, 10, 0)).toEqual({ page: 1, limit: 10, total: 0, totalPages: 0 })
  })
})

describe("paginateRecords", () => {
  const records = Array.from({ length: 25 }, (_, index) => job({ id: `job-${index}` }))

  it("returns the requested slice", () => {
    const { page, pagination } = paginateRecords(records, 2, 10)
    expect(page.map((r) => r.id)).toEqual([
      "job-10",
      "job-11",
      "job-12",
      "job-13",
      "job-14",
      "job-15",
      "job-16",
      "job-17",
      "job-18",
      "job-19"
    ])
    expect(pagination).toEqual({ page: 2, limit: 10, total: 25, totalPages: 3 })
  })

  it("clamps an out-of-range page to the last page", () => {
    const { page, pagination } = paginateRecords(records, 99, 10)
    expect(page).toHaveLength(5)
    expect(pagination.page).toBe(3)
  })

  it("clamps a page below one to the first page", () => {
    const { page, pagination } = paginateRecords(records, 0, 10)
    expect(page.map((r) => r.id)).toEqual(records.slice(0, 10).map((r) => r.id))
    expect(pagination.page).toBe(1)
  })

  it("returns an empty page for an empty result set", () => {
    const { page, pagination } = paginateRecords([], 4, 10)
    expect(page).toEqual([])
    expect(pagination).toEqual({ page: 1, limit: 10, total: 0, totalPages: 0 })
  })
})
