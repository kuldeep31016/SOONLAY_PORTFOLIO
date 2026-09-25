import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { ValidationError } from "@/lib/careers/errors"
import {
  MAX_ADMIN_LIMIT,
  MAX_PUBLIC_LIMIT,
  parseAdminJobQuery,
  parsePublicJobQuery
} from "@/lib/careers/query"

function params(query: string): URLSearchParams {
  return new URLSearchParams(query)
}

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

describe("parsePublicJobQuery", () => {
  it("applies sensible defaults for an empty query", () => {
    const query = parsePublicJobQuery(params(""))

    expect(query).toMatchObject({
      search: "",
      searchTerms: [],
      location: null,
      department: null,
      employmentType: null,
      featured: null,
      page: 1,
      sort: "publishedAt",
      order: "desc"
    })
    expect(query.limit).toBeGreaterThan(0)
    expect(query.limit).toBeLessThanOrEqual(MAX_PUBLIC_LIMIT)
  })

  it("tokenizes the search query for matching", () => {
    expect(parsePublicJobQuery(params("search=React+Native")).searchTerms).toEqual(["react", "native"])
  })

  it("caps the number of search terms", () => {
    const many = Array.from({ length: 20 }, (_, index) => `term${index}`).join("+")
    expect(parsePublicJobQuery(params(`search=${many}`)).searchTerms.length).toBeLessThanOrEqual(6)
  })

  it("treats blank parameters as absent", () => {
    const query = parsePublicJobQuery(params("search=&location=&department="))

    expect(query.search).toBe("")
    expect(query.location).toBeNull()
    expect(query.department).toBeNull()
  })

  it("parses the featured flag case-insensitively", () => {
    expect(parsePublicJobQuery(params("featured=TRUE")).featured).toBe(true)
    expect(parsePublicJobQuery(params("featured=false")).featured).toBe(false)
  })

  it("falls back to defaults instead of failing the page for bad values", () => {
    const query = parsePublicJobQuery(
      params("page=abc&limit=0&sort=salary&order=sideways&employmentType=Freelance&featured=maybe")
    )

    expect(query).toMatchObject({
      page: 1,
      sort: "publishedAt",
      order: "desc",
      employmentType: null,
      featured: null
    })
    expect(query.limit).toBeGreaterThan(0)
  })

  it("clamps an out-of-range page or limit to the default", () => {
    expect(parsePublicJobQuery(params("page=0")).page).toBe(1)
    expect(parsePublicJobQuery(params("page=99999")).page).toBe(1)
    expect(parsePublicJobQuery(params(`limit=${MAX_PUBLIC_LIMIT + 1}`)).limit).toBeLessThanOrEqual(MAX_PUBLIC_LIMIT)
  })

  it("ignores a non-numeric page", () => {
    expect(parsePublicJobQuery(params("page=abc")).page).toBe(1)
  })

  it("truncates an overlong search instead of rejecting it", () => {
    const query = parsePublicJobQuery(params(`search=${"a".repeat(400)}`))
    expect(query.search.length).toBe(160)
  })
})

describe("parseAdminJobQuery", () => {
  it("defaults to recently updated, non-archived jobs", () => {
    const query = parseAdminJobQuery(params(""))

    expect(query).toMatchObject({
      search: "",
      status: null,
      archived: null,
      page: 1,
      sort: "updatedAt",
      order: "desc"
    })
  })

  it("parses the archived tri-state", () => {
    expect(parseAdminJobQuery(params("archived=true")).archived).toBe(true)
    expect(parseAdminJobQuery(params("archived=false")).archived).toBe(false)
    expect(parseAdminJobQuery(params("")).archived).toBeNull()
  })

  it("supports archived-only queries", () => {
    const query = parseAdminJobQuery(params("archived=true&status=CLOSED"))
    expect(query.archived).toBe(true)
    expect(query.status).toBe("CLOSED")
  })

  it("rejects a status that is not part of the lifecycle", () => {
    expect(fieldErrors(() => parseAdminJobQuery(params("status=ARCHIVED")))).toHaveProperty("status")
  })

  it("allows a larger page size than the public site", () => {
    expect(parseAdminJobQuery(params(`limit=${MAX_ADMIN_LIMIT}`)).limit).toBe(MAX_ADMIN_LIMIT)
    expect(fieldErrors(() => parseAdminJobQuery(params(`limit=${MAX_ADMIN_LIMIT + 1}`)))).toHaveProperty("limit")
  })

  it("ignores parameters that belong to the public site", () => {
    const query = parseAdminJobQuery(params("featured=true&nonsense=1"))
    expect(query).toEqual(expect.objectContaining({ status: null, archived: null }))
    expect("featured" in query).toBe(false)
  })
})

describe("page size configuration", () => {
  const original = process.env.CAREERS_PAGE_SIZE

  beforeEach(() => {
    delete process.env.CAREERS_PAGE_SIZE
  })

  afterEach(() => {
    if (original === undefined) {
      delete process.env.CAREERS_PAGE_SIZE
    } else {
      process.env.CAREERS_PAGE_SIZE = original
    }
  })

  it("reads the configured page size", () => {
    process.env.CAREERS_PAGE_SIZE = "6"
    expect(parsePublicJobQuery(params("")).limit).toBe(6)
  })

  it("falls back to the default for unusable values", () => {
    process.env.CAREERS_PAGE_SIZE = "lots"
    expect(parsePublicJobQuery(params("")).limit).toBeGreaterThan(0)
  })

  it("never exceeds the hard maximum", () => {
    process.env.CAREERS_PAGE_SIZE = "5000"
    expect(parsePublicJobQuery(params("")).limit).toBe(MAX_PUBLIC_LIMIT)
  })
})
