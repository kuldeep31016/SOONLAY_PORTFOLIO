import { FieldValue, Timestamp } from "firebase-admin/firestore"
import type { CollectionReference, DocumentData, DocumentReference } from "firebase-admin/firestore"

import { ConflictError, NotFoundError, UpstreamError } from "./errors"
import { getFirestore } from "./firebase"
import {
  buildFilterOptions,
  matchesFilters,
  matchesSearch,
  paginateRecords,
  sortRecords
} from "./listing"
import type { AdminJobQuery, PublicJobQuery } from "./query"
import { buildSlugCandidates, slugify } from "./slug"
import { EMPLOYMENT_TYPES } from "./types"
import type {
  AdminJobListResponse,
  EmploymentType,
  JobInput,
  JobListResponse,
  JobRecord,
  JobStats,
  JobStatus,
  PublicJob
} from "./types"
import type { JobUpdateInput } from "./validation"

export const JOBS_COLLECTION_ID = "jobs"
export const SLUGS_COLLECTION_ID = "jobSlugs"
export const SLUG_VARIANT_LIMIT = 20
export const MAX_SCAN_DOCUMENTS = 2000

interface JobSnapshotLike {
  id: string
  exists: boolean
  data: () => unknown
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {}
}

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

function readNullableString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null
}

function readBoolean(value: unknown): boolean {
  return value === true
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }
  return value.filter((item): item is string => typeof item === "string")
}

function readTimestampIso(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null
  }
  if (value instanceof Timestamp) {
    return value.toDate().toISOString()
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (typeof value === "string") {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
  }
  return null
}

function readStatus(value: unknown): JobStatus {
  return value === "PUBLISHED" || value === "CLOSED" || value === "DRAFT" ? value : "DRAFT"
}

function readEmploymentType(value: unknown): EmploymentType {
  return EMPLOYMENT_TYPES.find((candidate) => candidate === value) ?? "Full-time"
}

function toJobRecord(snapshot: JobSnapshotLike): JobRecord {
  const data = asRecord(snapshot.data())
  const title = readString(data["title"])

  return {
    id: snapshot.id,
    title,
    slug: readString(data["slug"]) || slugify(title),
    shortDescription: readString(data["shortDescription"]),
    description: readString(data["description"]),
    department: readString(data["department"]),
    location: readString(data["location"]),
    employmentType: readEmploymentType(data["employmentType"]),
    experienceLevel: readNullableString(data["experienceLevel"]),
    responsibilities: readStringArray(data["responsibilities"]),
    requirements: readStringArray(data["requirements"]),
    niceToHave: readStringArray(data["niceToHave"]),
    benefits: readStringArray(data["benefits"]),
    skills: readStringArray(data["skills"]),
    applicationUrl: readString(data["applicationUrl"]),
    status: readStatus(data["status"]),
    featured: readBoolean(data["featured"]),
    createdAt: readTimestampIso(data["createdAt"]) ?? "",
    updatedAt: readTimestampIso(data["updatedAt"]) ?? "",
    publishedAt: readTimestampIso(data["publishedAt"]),
    closedAt: readTimestampIso(data["closedAt"]),
    archivedAt: readTimestampIso(data["archivedAt"])
  }
}

function toPublicJob(record: JobRecord): PublicJob {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    shortDescription: record.shortDescription,
    description: record.description,
    department: record.department,
    location: record.location,
    employmentType: record.employmentType,
    experienceLevel: record.experienceLevel,
    responsibilities: record.responsibilities,
    requirements: record.requirements,
    niceToHave: record.niceToHave,
    benefits: record.benefits,
    skills: record.skills,
    applicationUrl: record.applicationUrl,
    status: record.status,
    featured: record.featured,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    publishedAt: record.publishedAt,
    closedAt: record.closedAt
  }
}

function getJobsCollection(): CollectionReference<DocumentData> {
  return getFirestore().collection(JOBS_COLLECTION_ID)
}

/**
 * Jobs are read in a single bounded scan and filtered, sorted, and paginated in
 * the application. A studio careers board is a small collection, and doing the
 * work here keeps the feature free of composite index combinations that would
 * otherwise have to be provisioned for every filter, search term, and sort
 * field pairing. Only Firestore's default single-field indexes are required.
 */
async function readJobRecords(): Promise<{ records: JobRecord[]; truncated: boolean }> {
  const snapshot = await getJobsCollection().limit(MAX_SCAN_DOCUMENTS + 1).get()
  const truncated = snapshot.docs.length > MAX_SCAN_DOCUMENTS
  const documents = truncated ? snapshot.docs.slice(0, MAX_SCAN_DOCUMENTS) : snapshot.docs

  if (truncated) {
    console.warn(
      `[careers] Job collection exceeds the ${MAX_SCAN_DOCUMENTS} document scan limit; results are partial`
    )
  }

  return { records: documents.map((document) => toJobRecord(document)), truncated }
}

export async function listPublishedJobs(query: PublicJobQuery): Promise<JobListResponse> {
  const { records, truncated } = await readJobRecords()
  const published = records.filter(
    (record) => record.status === "PUBLISHED" && record.archivedAt === null
  )
  const filters = buildFilterOptions(published)
  const matched = published.filter(
    (record) =>
      matchesSearch(record, query.searchTerms) &&
      matchesFilters(record, {
        status: null,
        location: query.location,
        department: query.department,
        employmentType: query.employmentType,
        featured: query.featured,
        archived: null
      })
  )
  const { page, pagination } = paginateRecords(
    sortRecords(matched, query.sort, query.order),
    query.page,
    query.limit
  )

  return {
    jobs: page.map(toPublicJob),
    pagination,
    filters,
    truncated
  }
}

export async function getPublishedJobBySlug(slug: string): Promise<PublicJob | null> {
  const normalized = slug.trim().toLowerCase()
  if (normalized.length === 0) {
    return null
  }

  const snapshot = await getJobsCollection().where("slug", "==", normalized).limit(1).get()
  const first = snapshot.docs.at(0)

  if (first === undefined) {
    return null
  }

  const record = toJobRecord(first)
  if (record.status !== "PUBLISHED" || record.archivedAt !== null) {
    return null
  }

  return toPublicJob(record)
}

export async function getPublishedJobSlugs(): Promise<string[]> {
  const { records } = await readJobRecords()
  const published = records.filter(
    (record) => record.status === "PUBLISHED" && record.archivedAt === null
  )

  return sortRecords(published, "publishedAt", "desc")
    .map((record) => record.slug)
    .filter((slug) => slug.length > 0)
}

export async function listAdminJobs(query: AdminJobQuery): Promise<AdminJobListResponse> {
  const { records, truncated } = await readJobRecords()
  const filters = buildFilterOptions(records.filter((record) => record.archivedAt === null))
  const matched = records.filter(
    (record) =>
      matchesSearch(record, query.searchTerms) &&
      matchesFilters(record, {
        status: query.status,
        location: query.location,
        department: query.department,
        employmentType: query.employmentType,
        featured: null,
        archived: query.archived ?? false
      })
  )
  const { page, pagination } = paginateRecords(
    sortRecords(matched, query.sort, query.order),
    query.page,
    query.limit
  )

  return { jobs: page, pagination, filters, truncated }
}

export async function getAdminJobById(id: string): Promise<JobRecord | null> {
  const normalized = id.trim()
  if (normalized.length === 0) {
    return null
  }
  const snapshot = await getJobsCollection().doc(normalized).get()
  return snapshot.exists ? toJobRecord(snapshot) : null
}

function toDocumentFields(input: JobInput): Record<string, unknown> {
  return {
    title: input.title,
    shortDescription: input.shortDescription,
    description: input.description,
    department: input.department,
    location: input.location,
    employmentType: input.employmentType,
    experienceLevel: input.experienceLevel,
    responsibilities: input.responsibilities,
    requirements: input.requirements,
    niceToHave: input.niceToHave,
    benefits: input.benefits,
    skills: input.skills,
    applicationUrl: input.applicationUrl,
    status: input.status,
    featured: input.featured
  }
}

function mergeJobInput(existing: JobRecord, input: JobUpdateInput): JobInput {
  return {
    title: input.title ?? existing.title,
    shortDescription: input.shortDescription ?? existing.shortDescription,
    description: input.description ?? existing.description,
    department: input.department ?? existing.department,
    location: input.location ?? existing.location,
    employmentType: input.employmentType ?? existing.employmentType,
    experienceLevel: input.experienceLevel === undefined ? existing.experienceLevel : input.experienceLevel,
    responsibilities: input.responsibilities ?? existing.responsibilities,
    requirements: input.requirements ?? existing.requirements,
    niceToHave: input.niceToHave ?? existing.niceToHave,
    benefits: input.benefits ?? existing.benefits,
    skills: input.skills ?? existing.skills,
    applicationUrl: input.applicationUrl ?? existing.applicationUrl,
    status: input.status ?? existing.status,
    featured: input.featured ?? existing.featured
  }
}

function createTimestampFields(status: JobStatus, existing: JobRecord | null): Record<string, unknown> {
  if (status === "DRAFT") {
    return { publishedAt: FieldValue.delete(), closedAt: FieldValue.delete() }
  }

  if (status === "CLOSED") {
    return existing !== null && existing.closedAt !== null ? {} : { closedAt: FieldValue.serverTimestamp() }
  }

  const fields: Record<string, unknown> = { closedAt: FieldValue.delete() }
  if (existing === null || existing.publishedAt === null) {
    fields["publishedAt"] = FieldValue.serverTimestamp()
  }
  return fields
}

/**
 * Timestamps for a brand-new document. Firestore rejects FieldValue.delete()
 * in create() because there is no existing document to remove the field from,
 * so the absent timestamps are simply left out instead.
 */
function initialTimestampFields(status: JobStatus): Record<string, unknown> {
  if (status === "DRAFT") {
    return {}
  }

  if (status === "CLOSED") {
    return { closedAt: FieldValue.serverTimestamp() }
  }

  return { publishedAt: FieldValue.serverTimestamp() }
}

async function readJobOrThrow(reference: DocumentReference<DocumentData>): Promise<JobRecord> {
  const snapshot = await reference.get()
  if (!snapshot.exists) {
    throw new UpstreamError("The job could not be read after the write completed")
  }
  return toJobRecord(snapshot)
}

export async function createJob(input: JobInput): Promise<JobRecord> {
  const firestore = getFirestore()
  const jobReference = firestore.collection(JOBS_COLLECTION_ID).doc()
  const candidates = buildSlugCandidates(slugify(input.title), SLUG_VARIANT_LIMIT)
  const slugReferences = candidates.map((candidate) =>
    firestore.collection(SLUGS_COLLECTION_ID).doc(candidate)
  )
  const now = FieldValue.serverTimestamp()

  await firestore.runTransaction(async (transaction) => {
    const snapshots = await transaction.getAll(...slugReferences)
    const taken = new Set<string>()
    for (const snapshot of snapshots) {
      if (snapshot.exists) {
        taken.add(snapshot.id)
      }
    }

    const index = candidates.findIndex((candidate) => !taken.has(candidate))
    if (index < 0) {
      throw new ConflictError("Could not allocate a unique slug for this job. Please retry with another title.")
    }

    const slug = candidates[index]
    transaction.create(jobReference, {
      ...toDocumentFields(input),
      ...initialTimestampFields(input.status),
      slug,
      createdAt: now,
      updatedAt: now
    })
    transaction.set(slugReferences[index], { jobId: jobReference.id, slug, createdAt: now })
  })

  return readJobOrThrow(jobReference)
}

export async function updateJob(id: string, input: JobUpdateInput): Promise<JobRecord> {
  const reference = getJobsCollection().doc(id.trim())
  const snapshot = await reference.get()
  if (!snapshot.exists) {
    throw new NotFoundError("Job not found")
  }

  const existing = toJobRecord(snapshot)
  const next = mergeJobInput(existing, input)
  const patch: Record<string, unknown> = {
    ...toDocumentFields(next),
    // Remove the legacy denormalized search index fields if present.
    searchTerms: FieldValue.delete(),
    searchKeys: FieldValue.delete(),
    updatedAt: FieldValue.serverTimestamp()
  }

  if (next.status !== existing.status) {
    Object.assign(patch, createTimestampFields(next.status, existing))
  }

  await reference.update(patch)

  return readJobOrThrow(reference)
}

export async function updateJobStatus(id: string, status: JobStatus): Promise<JobRecord> {
  const reference = getJobsCollection().doc(id.trim())
  const snapshot = await reference.get()
  if (!snapshot.exists) {
    throw new NotFoundError("Job not found")
  }

  const existing = toJobRecord(snapshot)
  await reference.update({
    status,
    updatedAt: FieldValue.serverTimestamp(),
    ...createTimestampFields(status, existing)
  })

  return readJobOrThrow(reference)
}

export async function archiveJob(id: string): Promise<JobRecord> {
  const reference = getJobsCollection().doc(id.trim())
  const snapshot = await reference.get()
  if (!snapshot.exists) {
    throw new NotFoundError("Job not found")
  }

  const existing = toJobRecord(snapshot)
  if (existing.archivedAt !== null) {
    return existing
  }

  await reference.update({
    archivedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  })

  return readJobOrThrow(reference)
}

export async function restoreJob(id: string): Promise<JobRecord> {
  const reference = getJobsCollection().doc(id.trim())
  const snapshot = await reference.get()
  if (!snapshot.exists) {
    throw new NotFoundError("Job not found")
  }

  const existing = toJobRecord(snapshot)
  if (existing.archivedAt === null) {
    return existing
  }

  await reference.update({
    archivedAt: FieldValue.delete(),
    updatedAt: FieldValue.serverTimestamp()
  })

  return readJobOrThrow(reference)
}

export async function getJobStats(): Promise<JobStats> {
  const { records } = await readJobRecords()
  const count = (predicate: (record: JobRecord) => boolean) =>
    records.filter(predicate).length

  return {
    total: records.length,
    archived: count((record) => record.archivedAt !== null),
    active: count(
      (record) => record.status === "PUBLISHED" && record.archivedAt === null
    ),
    draft: count((record) => record.status === "DRAFT" && record.archivedAt === null),
    closed: count((record) => record.status === "CLOSED" && record.archivedAt === null)
  }
}

export { parseAdminJobQuery, parsePublicJobQuery } from "./query"
export type { AdminJobQuery, PublicJobQuery, SortOrder } from "./query"
export type { JobUpdateInput } from "./validation"
