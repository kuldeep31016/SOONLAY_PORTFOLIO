import "server-only"

import type { JobListResponse, JobRecord, JobStats } from "./types"
import { requestCareersJson } from "./careers-api"
import { jobIdSchema } from "./schemas"
import { toPublicJobQuery, type JobListQuery } from "./query"
import type { SessionContext } from "./session"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function assertJob(value: unknown): JobRecord {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.title !== "string") {
    throw new Error("The Careers API returned an invalid job")
  }
  return value as unknown as JobRecord
}

function assertJobList(value: unknown): JobListResponse {
  if (!isRecord(value) || !Array.isArray(value.jobs) || !isRecord(value.pagination) || !isRecord(value.filters)) {
    throw new Error("The Careers API returned an invalid job list")
  }
  if (typeof value.truncated !== "boolean") {
    throw new Error("The Careers API returned an unsupported job list")
  }
  return value as unknown as JobListResponse
}

function assertStats(value: unknown): JobStats {
  if (!isRecord(value)) {
    throw new Error("The Careers API returned invalid stats")
  }
  const keys: Array<keyof JobStats> = ["active", "draft", "closed", "total", "archived"]
  if (keys.some((key) => typeof value[key] !== "number")) {
    throw new Error("The Careers API returned invalid stats")
  }
  return value as unknown as JobStats
}

export async function getAdminStats(session: SessionContext) {
  const payload = await requestCareersJson<unknown>("/api/admin/stats", {}, session)
  const stats = isRecord(payload) && isRecord(payload.stats) ? payload.stats : payload
  return assertStats(stats)
}

export async function getAdminJobs(query: JobListQuery, session: SessionContext) {
  return assertJobList(
    await requestCareersJson<unknown>("/api/admin/jobs", { query: toPublicJobQuery(query) }, session)
  )
}

export async function getAdminJob(id: string, session: SessionContext) {
  const parsedId = jobIdSchema.safeParse(id)
  if (!parsedId.success) {
    throw new Error("Invalid job id")
  }
  const payload = await requestCareersJson<unknown>(`/api/admin/jobs/${encodeURIComponent(parsedId.data)}`, {}, session)
  const jobPayload = isRecord(payload) && payload.job ? payload.job : payload
  return assertJob(jobPayload)
}
