import { beforeEach, describe, expect, it, vi } from "vitest"

import type { FakeFirestore } from "./helpers/fake-firestore"

const firestore = { current: null as FakeFirestore | null }

vi.mock("@/lib/careers/firebase", async () => {
  const { installFakeFirestore } = await import("./helpers/fake-firestore")
  return {
    getFirestore: () => {
      if (firestore.current === null) {
        firestore.current = installFakeFirestore()
      }
      return firestore.current
    }
  }
})

const repository = await import("@/lib/careers/repository")
const { installFakeFirestore } = await import("./helpers/fake-firestore")
const { parseAdminJobQuery, parsePublicJobQuery } = await import("@/lib/careers/query")
const { NotFoundError } = await import("@/lib/careers/errors")

const JOBS = "jobs"
const SLUGS = "jobSlugs"

function publicQuery(search: string) {
  return parsePublicJobQuery(new URLSearchParams(search))
}

function adminQuery(search: string) {
  return parseAdminJobQuery(new URLSearchParams(search))
}

function jobDocument(overrides: Record<string, unknown> = {}) {
  return {
    title: "Senior Frontend Engineer",
    shortDescription: "Ship great work.",
    description: "Own the design system.",
    department: "Engineering",
    location: "Remote — India",
    employmentType: "Full-time",
    experienceLevel: "5+ years",
    responsibilities: [],
    requirements: [],
    niceToHave: [],
    benefits: [],
    skills: ["React"],
    applicationUrl: "https://jobs.example.com/apply/1",
    status: "PUBLISHED",
    featured: false,
    slug: "senior-frontend-engineer",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides
  }
}

beforeEach(() => {
  firestore.current = installFakeFirestore()
})

describe("published visibility", () => {
  beforeEach(() => {
    firestore.current?.seed(JOBS, [
      { id: "published", data: jobDocument({ slug: "published-role", publishedAt: "2026-02-01T00:00:00.000Z" }) },
      { id: "draft", data: jobDocument({ slug: "draft-role", status: "DRAFT" }) },
      { id: "closed", data: jobDocument({ slug: "closed-role", status: "CLOSED", closedAt: "2026-03-01T00:00:00.000Z" }) },
      { id: "archived", data: jobDocument({ slug: "archived-role", archivedAt: "2026-04-01T00:00:00.000Z" }) }
    ])
  })

  it("lists only published, non-archived jobs", async () => {
    const result = await repository.listPublishedJobs(publicQuery(""))

    expect(result.jobs.map((job) => job.id)).toEqual(["published"])
    expect(result.pagination.total).toBe(1)
  })

  it("never exposes archivedAt on a public job", async () => {
    const result = await repository.listPublishedJobs(publicQuery(""))
    expect(result.jobs[0]).not.toHaveProperty("archivedAt")
  })

  it("serves a published job by slug", async () => {
    const job = await repository.getPublishedJobBySlug("published-role")
    expect(job?.title).toBe("Senior Frontend Engineer")
  })

  it("hides drafts, closed jobs, and archived jobs by slug", async () => {
    expect(await repository.getPublishedJobBySlug("draft-role")).toBeNull()
    expect(await repository.getPublishedJobBySlug("closed-role")).toBeNull()
    expect(await repository.getPublishedJobBySlug("archived-role")).toBeNull()
  })

  it("matches slugs case-insensitively", async () => {
    expect(await repository.getPublishedJobBySlug("Published-Role")).not.toBeNull()
  })

  it("returns null for an unknown slug", async () => {
    expect(await repository.getPublishedJobBySlug("nope")).toBeNull()
    expect(await repository.getPublishedJobBySlug("   ")).toBeNull()
  })

  it("lists only published slugs for the sitemap", async () => {
    expect(await repository.getPublishedJobSlugs()).toEqual(["published-role"])
  })
})

describe("search and filters on the public list", () => {
  beforeEach(() => {
    firestore.current?.seed(JOBS, [
      {
        id: "react",
        data: jobDocument({
          slug: "react-role",
          title: "React Engineer",
          skills: ["React", "Next.js"],
          publishedAt: "2026-02-01T00:00:00.000Z"
        })
      },
      {
        id: "devops",
        data: jobDocument({
          slug: "devops-role",
          title: "DevOps Engineer",
          department: "Platform",
          location: "Berlin",
          skills: ["Kubernetes"],
          publishedAt: "2026-01-01T00:00:00.000Z"
        })
      }
    ])
  })

  it("searches titles, departments, locations, and skills", async () => {
    expect((await repository.listPublishedJobs(publicQuery("search=kubernetes"))).jobs.map((j) => j.id)).toEqual([
      "devops"
    ])
    expect((await repository.listPublishedJobs(publicQuery("search=platform"))).jobs.map((j) => j.id)).toEqual([
      "devops"
    ])
    expect((await repository.listPublishedJobs(publicQuery("search=berlin"))).jobs.map((j) => j.id)).toEqual([
      "devops"
    ])
    expect((await repository.listPublishedJobs(publicQuery("search=nextjs"))).jobs.map((j) => j.id)).toEqual([
      "react"
    ])
  })

  it("requires every term to match", async () => {
    expect((await repository.listPublishedJobs(publicQuery("search=react+kubernetes"))).jobs).toEqual([])
  })

  it("combines search with filters", async () => {
    const result = await repository.listPublishedJobs(publicQuery("search=engineer&department=Platform"))
    expect(result.jobs.map((job) => job.id)).toEqual(["devops"])
  })

  it("offers filter options from all published jobs, not just the matches", async () => {
    const result = await repository.listPublishedJobs(publicQuery("search=kubernetes"))
    expect(result.jobs).toHaveLength(1)
    expect(result.filters.locations).toEqual(["Berlin", "Remote — India"])
    expect(result.filters.departments).toEqual(["Engineering", "Platform"])
  })

  it("sorts by the requested field and direction", async () => {
    const newest = await repository.listPublishedJobs(publicQuery("sort=publishedAt&order=desc"))
    expect(newest.jobs.map((job) => job.id)).toEqual(["react", "devops"])

    const oldest = await repository.listPublishedJobs(publicQuery("sort=publishedAt&order=asc"))
    expect(oldest.jobs.map((job) => job.id)).toEqual(["devops", "react"])
  })

  it("paginates and reports totals", async () => {
    const result = await repository.listPublishedJobs(publicQuery("limit=1&page=2&sort=title&order=asc"))
    expect(result.jobs).toHaveLength(1)
    expect(result.pagination).toEqual({ page: 2, limit: 1, total: 2, totalPages: 2 })
  })

  it("clamps a page beyond the last one instead of rendering nothing", async () => {
    const result = await repository.listPublishedJobs(publicQuery("limit=1&page=99"))
    expect(result.jobs).toHaveLength(1)
    expect(result.pagination.page).toBe(2)
  })
})

describe("admin list", () => {
  beforeEach(() => {
    firestore.current?.seed(JOBS, [
      { id: "published", data: jobDocument({ slug: "published-role" }) },
      { id: "draft", data: jobDocument({ slug: "draft-role", status: "DRAFT" }) },
      { id: "closed", data: jobDocument({ slug: "closed-role", status: "CLOSED" }) },
      { id: "archived", data: jobDocument({ slug: "archived-role", archivedAt: "2026-04-01T00:00:00.000Z" }) }
    ])
  })

  it("hides archived jobs by default", async () => {
    const result = await repository.listAdminJobs(adminQuery(""))
    expect(result.jobs.map((job) => job.id).sort()).toEqual(["closed", "draft", "published"])
    expect(result.jobs.every((job) => job.archivedAt === null)).toBe(true)
  })

  it("can show archived jobs only", async () => {
    const result = await repository.listAdminJobs(adminQuery("archived=true"))
    expect(result.jobs.map((job) => job.id)).toEqual(["archived"])
  })

  it("filters by lifecycle status", async () => {
    const result = await repository.listAdminJobs(adminQuery("status=DRAFT"))
    expect(result.jobs.map((job) => job.id)).toEqual(["draft"])
  })

  it("exposes archivedAt to administrators", async () => {
    const result = await repository.listAdminJobs(adminQuery("archived=true"))
    expect(result.jobs[0].archivedAt).toBe("2026-04-01T00:00:00.000Z")
  })
})

describe("createJob", () => {
  const input = {
    title: "Senior Frontend Engineer",
    shortDescription: "Build the platform.",
    description: "Own the design system.",
    department: "Engineering",
    location: "Remote — India",
    employmentType: "Full-time" as const,
    experienceLevel: "5+ years",
    responsibilities: [],
    requirements: [],
    niceToHave: [],
    benefits: [],
    skills: [],
    applicationUrl: "https://jobs.example.com/apply/1",
    status: "DRAFT" as const,
    featured: false
  }

  it("derives a slug from the title and reserves it", async () => {
    const job = await repository.createJob(input)

    expect(job.slug).toBe("senior-frontend-engineer")
    expect(job.status).toBe("DRAFT")
    expect(job.publishedAt).toBeNull()
    expect(job.closedAt).toBeNull()
    expect(firestore.current?.read(SLUGS)).toEqual([
      { jobId: job.id, slug: "senior-frontend-engineer", createdAt: expect.any(String) }
    ])
  })

  it("adds a numeric suffix when the slug is taken", async () => {
    await repository.createJob(input)
    const second = await repository.createJob(input)

    expect(second.slug).toBe("senior-frontend-engineer-2")
    expect(firestore.current?.read(SLUGS)).toHaveLength(2)
  })

  it("keeps the slug stable across edits", async () => {
    const created = await repository.createJob(input)
    const renamed = await repository.updateJob(created.id, { title: "Staff Frontend Engineer" })

    expect(renamed.slug).toBe("senior-frontend-engineer")
    expect(renamed.title).toBe("Staff Frontend Engineer")
  })

  it("sets publishedAt when created directly as published", async () => {
    const job = await repository.createJob({ ...input, status: "PUBLISHED" })
    expect(job.publishedAt).toEqual(expect.any(String))
  })

  it("omits rather than deletes the lifecycle timestamps on a new draft", async () => {
    // Firestore rejects FieldValue.delete() inside create(), so a draft must be
    // written without publishedAt/closedAt rather than with delete sentinels.
    const job = await repository.createJob({ ...input, status: "DRAFT" })
    const stored = firestore.current?.read(JOBS)[0]

    expect(job.publishedAt).toBeNull()
    expect(job.closedAt).toBeNull()
    expect(stored).not.toHaveProperty("publishedAt")
    expect(stored).not.toHaveProperty("closedAt")
  })

  it("creates a job directly in any status without a delete sentinel", async () => {
    for (const status of ["DRAFT", "PUBLISHED", "CLOSED"] as const) {
      firestore.current = installFakeFirestore()
      await expect(repository.createJob({ ...input, status })).resolves.toMatchObject({ status })
    }
  })

  it("sets closedAt when created directly as closed", async () => {
    const job = await repository.createJob({ ...input, status: "CLOSED" })
    expect(job.closedAt).toEqual(expect.any(String))
    expect(job.publishedAt).toBeNull()
  })

  it("does not write the legacy search index fields", async () => {
    const job = await repository.createJob(input)
    const stored = firestore.current?.read(JOBS)[0]

    expect(stored?.slug).toBe(job.slug)
    expect(stored).not.toHaveProperty("searchTerms")
    expect(stored).not.toHaveProperty("searchKeys")
  })

  it("removes legacy search index fields when a job is edited", async () => {
    firestore.current?.seed(JOBS, [
      {
        id: "legacy",
        data: jobDocument({
          slug: "senior-frontend-engineer",
          searchTerms: ["legacy"],
          searchKeys: { legacy: true }
        })
      }
    ])

    const updated = await repository.updateJob("legacy", { title: "Staff Frontend Engineer" })
    const stored = firestore.current?.read(JOBS)[0]

    expect(updated.title).toBe("Staff Frontend Engineer")
    expect(stored).not.toHaveProperty("searchTerms")
    expect(stored).not.toHaveProperty("searchKeys")
  })
})

describe("updateJob", () => {
  const input = {
    title: "Senior Frontend Engineer",
    shortDescription: "",
    description: "Own the design system.",
    department: "Engineering",
    location: "Remote — India",
    employmentType: "Full-time" as const,
    experienceLevel: null,
    responsibilities: [],
    requirements: [],
    niceToHave: [],
    benefits: [],
    skills: [],
    applicationUrl: "https://jobs.example.com/apply/1",
    status: "DRAFT" as const,
    featured: false
  }

  it("merges a partial update and leaves other fields alone", async () => {
    const created = await repository.createJob(input)
    const updated = await repository.updateJob(created.id, { skills: ["React", "TypeScript"] })

    expect(updated.skills).toEqual(["React", "TypeScript"])
    expect(updated.title).toBe("Senior Frontend Engineer")
    expect(updated.department).toBe("Engineering")
  })

  it("records the status transition timestamps", async () => {
    const created = await repository.createJob(input)
    const published = await repository.updateJobStatus(created.id, "PUBLISHED")

    expect(published.status).toBe("PUBLISHED")
    expect(published.publishedAt).toEqual(expect.any(String))
    expect(published.closedAt).toBeNull()

    const closed = await repository.updateJobStatus(created.id, "CLOSED")
    expect(closed.closedAt).toEqual(expect.any(String))
    expect(closed.publishedAt).toEqual(expect.any(String))

    const reopened = await repository.updateJobStatus(created.id, "PUBLISHED")
    expect(reopened.closedAt).toBeNull()
  })

  it("clears publishedAt when a published job returns to draft", async () => {
    const created = await repository.createJob({ ...input, status: "PUBLISHED" })
    const draft = await repository.updateJobStatus(created.id, "DRAFT")

    expect(draft.publishedAt).toBeNull()
  })

  it("throws for an unknown job", async () => {
    await expect(repository.updateJob("missing", { title: "x" })).rejects.toBeInstanceOf(NotFoundError)
    await expect(repository.updateJobStatus("missing", "PUBLISHED")).rejects.toBeInstanceOf(NotFoundError)
    await expect(repository.archiveJob("missing")).rejects.toBeInstanceOf(NotFoundError)
    await expect(repository.restoreJob("missing")).rejects.toBeInstanceOf(NotFoundError)
  })
})

describe("archive and restore", () => {
  const input = {
    title: "Senior Frontend Engineer",
    shortDescription: "",
    description: "Own the design system.",
    department: "Engineering",
    location: "Remote — India",
    employmentType: "Full-time" as const,
    experienceLevel: null,
    responsibilities: [],
    requirements: [],
    niceToHave: [],
    benefits: [],
    skills: [],
    applicationUrl: "https://jobs.example.com/apply/1",
    status: "PUBLISHED" as const,
    featured: false
  }

  it("removes a job from the public site when archived", async () => {
    const created = await repository.createJob(input)
    const archived = await repository.archiveJob(created.id)

    expect(archived.archivedAt).toEqual(expect.any(String))
    expect((await repository.listPublishedJobs(publicQuery(""))).jobs).toEqual([])
    expect(await repository.getPublishedJobBySlug(created.slug)).toBeNull()
  })

  it("is idempotent", async () => {
    const created = await repository.createJob(input)
    const first = await repository.archiveJob(created.id)
    const second = await repository.archiveJob(created.id)

    expect(second.archivedAt).toBe(first.archivedAt)
  })

  it("brings an archived job back to the public site", async () => {
    const created = await repository.createJob(input)
    await repository.archiveJob(created.id)
    const restored = await repository.restoreJob(created.id)

    expect(restored.archivedAt).toBeNull()
    expect(restored.status).toBe("PUBLISHED")
    expect((await repository.listPublishedJobs(publicQuery(""))).jobs.map((job) => job.id)).toEqual([
      created.id
    ])
  })

  it("restoring a non-archived job is a no-op", async () => {
    const created = await repository.createJob(input)
    const restored = await repository.restoreJob(created.id)
    expect(restored.archivedAt).toBeNull()
  })
})

describe("getJobStats", () => {
  it("counts every lifecycle bucket", async () => {
    firestore.current?.seed(JOBS, [
      { id: "a", data: jobDocument({ status: "PUBLISHED" }) },
      { id: "b", data: jobDocument({ status: "PUBLISHED" }) },
      { id: "c", data: jobDocument({ status: "DRAFT" }) },
      { id: "d", data: jobDocument({ status: "CLOSED" }) },
      { id: "e", data: jobDocument({ status: "PUBLISHED", archivedAt: "2026-04-01T00:00:00.000Z" }) },
      { id: "f", data: jobDocument({ status: "DRAFT", archivedAt: "2026-04-01T00:00:00.000Z" }) }
    ])

    expect(await repository.getJobStats()).toEqual({
      total: 6,
      active: 2,
      draft: 1,
      closed: 1,
      archived: 2
    })
  })

  it("reports zeroes for an empty collection", async () => {
    expect(await repository.getJobStats()).toEqual({
      total: 0,
      active: 0,
      draft: 0,
      closed: 0,
      archived: 0
    })
  })
})
