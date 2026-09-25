import { describe, expect, it } from "vitest"

import { parseJobListQuery, toPublicJobQuery, toSearchParams } from "@/lib/query"

function query(search: string) {
  return parseJobListQuery(new URLSearchParams(search))
}

describe("parseJobListQuery", () => {
  it("defaults to the newest jobs with no filters", () => {
    expect(query("")).toEqual({
      q: "",
      status: "",
      location: "",
      department: "",
      employmentType: "",
      sort: "newest",
      page: 1,
      limit: 20,
      archived: false
    })
  })

  it("reads the filters from the URL", () => {
    expect(
      query("search=react&status=DRAFT&location=Remote&department=Engineering&employmentType=Full-time&sort=title")
    ).toEqual({
      q: "react",
      status: "DRAFT",
      location: "Remote",
      department: "Engineering",
      employmentType: "Full-time",
      sort: "title",
      page: 1,
      limit: 20,
      archived: false
    })
  })

  it("accepts the legacy q and includeArchived parameter names", () => {
    expect(query("q=react").q).toBe("react")
    expect(query("includeArchived=1").archived).toBe(true)
  })

  it("normalizes case and trims values", () => {
    expect(query("status=published&sort=TITLE").status).toBe("PUBLISHED")
    expect(query("sort=TITLE").sort).toBe("title")
    expect(query("location=%20Remote%20").location).toBe("Remote")
  })

  it("discards values that are not part of the allowed sets", () => {
    expect(query("status=ARCHIVED").status).toBe("")
    expect(query("sort=salary").sort).toBe("newest")
  })

  it("clamps pagination values", () => {
    expect(query("page=0").page).toBe(1)
    expect(query("page=-4").page).toBe(1)
    expect(query("page=abc").page).toBe(1)
    expect(query("page=99999").page).toBe(1000)
    expect(query("limit=9999").limit).toBe(100)
    expect(query("limit=0").limit).toBe(20)
  })

  it("truncates an overlong search term", () => {
    expect(query(`search=${"a".repeat(500)}`).q).toHaveLength(160)
  })
})

describe("toSearchParams", () => {
  it("omits defaults so URLs stay clean", () => {
    expect(toSearchParams(query("")).toString()).toBe("")
  })

  it("round-trips the filters it was given", () => {
    const source = query("search=react&status=PUBLISHED&location=Remote&archived=true&page=3")
    expect(parseJobListQuery(toSearchParams(source))).toEqual(source)
  })
})

describe("toPublicJobQuery", () => {
  it("always sends a concrete sort, page, limit, and archived flag", () => {
    expect(toPublicJobQuery(query(""))).toEqual({
      sort: "createdAt",
      order: "desc",
      page: "1",
      limit: "20",
      archived: "false"
    })
  })

  it("maps each sort option to a distinct field", () => {
    expect(toPublicJobQuery(query("sort=newest"))).toMatchObject({ sort: "createdAt", order: "desc" })
    expect(toPublicJobQuery(query("sort=oldest"))).toMatchObject({ sort: "createdAt", order: "asc" })
    expect(toPublicJobQuery(query("sort=updated"))).toMatchObject({ sort: "updatedAt", order: "desc" })
    expect(toPublicJobQuery(query("sort=title"))).toMatchObject({ sort: "title", order: "asc" })
  })

  it("forwards the filters the public API understands", () => {
    expect(
      toPublicJobQuery(query("search=react&status=DRAFT&location=Remote&department=Design&employmentType=Contract&archived=true"))
    ).toEqual({
      search: "react",
      status: "DRAFT",
      location: "Remote",
      department: "Design",
      employmentType: "Contract",
      sort: "createdAt",
      order: "desc",
      page: "1",
      limit: "20",
      archived: "true"
    })
  })
})
