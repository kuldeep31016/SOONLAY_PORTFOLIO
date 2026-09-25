import "server-only"

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto"

import { getPreviewSecret } from "./env"
import { NotFoundError } from "./errors"
import { getAdminJobById } from "./repository"

export const PREVIEW_TOKEN_VERSION = "v1"
export const PREVIEW_TOKEN_TTL_MS = 5 * 60 * 1000
export const PREVIEW_PATH_PREFIX = "/careers/preview"
export const PREVIEW_TOKEN_MAX_LENGTH = 2048

export interface PreviewTokenSubject {
  id: string
  slug: string
}

export type PreviewTokenFailureReason =
  | "malformed"
  | "unsupported"
  | "expired"
  | "mismatch"
  | "misconfigured"

export type PreviewTokenFailure = { ok: false; reason: PreviewTokenFailureReason }

export type PreviewTokenResult =
  | { ok: true; jobId: string; slug: string; expiresAt: string }
  | PreviewTokenFailure

export type VerifiedPreviewToken =
  | { ok: true; payload: PreviewTokenPayload }
  | PreviewTokenFailure

export interface PreviewTokenPayload {
  v: string
  jobId: string
  slug: string
  iat: number
  exp: number
  nonce: string
}

function toBase64Url(value: string | Buffer): string {
  return Buffer.from(value).toString("base64url")
}

function fromBase64Url(value: string): Buffer | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    return null
  }
  try {
    return Buffer.from(value, "base64url")
  } catch {
    return null
  }
}

function sign(payload: string): string {
  return createHmac("sha256", getPreviewSecret()).update(payload, "utf8").digest("base64url")
}

function secureEqual(a: string, b: string): boolean {
  const left = createHash("sha256").update(a, "utf8").digest()
  const right = createHash("sha256").update(b, "utf8").digest()
  return timingSafeEqual(left, right)
}

function isPreviewTokenPayload(value: unknown): value is PreviewTokenPayload {
  if (typeof value !== "object" || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate["v"] === "string" &&
    typeof candidate["jobId"] === "string" &&
    typeof candidate["slug"] === "string" &&
    typeof candidate["iat"] === "number" &&
    typeof candidate["exp"] === "number" &&
    typeof candidate["nonce"] === "string"
  )
}

function failure(reason: PreviewTokenFailureReason): PreviewTokenFailure {
  return { ok: false, reason }
}

export function buildPreviewUrl(slug: string, token: string): string {
  return `${PREVIEW_PATH_PREFIX}/${encodeURIComponent(slug)}?token=${encodeURIComponent(token)}`
}

export async function createPreviewToken(job: PreviewTokenSubject | string): Promise<string> {
  const subject = await resolveSubject(job)
  const issuedAt = Date.now()
  const payload: PreviewTokenPayload = {
    v: PREVIEW_TOKEN_VERSION,
    jobId: subject.id,
    slug: subject.slug,
    iat: issuedAt,
    exp: issuedAt + PREVIEW_TOKEN_TTL_MS,
    nonce: randomBytes(12).toString("base64url")
  }
  const body = toBase64Url(JSON.stringify(payload))
  return `${body}.${sign(body)}`
}

/**
 * Verifies everything that can be checked from the token alone: structure,
 * HMAC signature, payload shape, version and expiry.
 *
 * This deliberately does not take the job record so that callers can prove a
 * token is authentic BEFORE reading the job from the database. Verifying after
 * the read would let a forged token trigger a Firestore fetch whose result gets
 * serialized into the response even though rendering is rejected.
 */
export function verifyPreviewTokenSignature(token: string): VerifiedPreviewToken {
  if (typeof token !== "string" || token.length === 0 || token.length > PREVIEW_TOKEN_MAX_LENGTH) {
    return failure("malformed")
  }

  const separator = token.indexOf(".")
  if (separator <= 0) {
    return failure("malformed")
  }

  const body = token.slice(0, separator)
  const signature = token.slice(separator + 1)
  if (body.length === 0 || signature.length === 0 || fromBase64Url(body) === null) {
    return failure("malformed")
  }

  let expected: string
  try {
    expected = sign(body)
  } catch {
    return failure("misconfigured")
  }

  if (!secureEqual(signature, expected)) {
    return failure("malformed")
  }

  const decoded = fromBase64Url(body)
  if (decoded === null) {
    return failure("malformed")
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(decoded.toString("utf8")) as unknown
  } catch {
    return failure("malformed")
  }

  if (!isPreviewTokenPayload(parsed)) {
    return failure("malformed")
  }

  if (parsed.v !== PREVIEW_TOKEN_VERSION) {
    return failure("unsupported")
  }

  if (!Number.isFinite(parsed.exp) || Date.now() > parsed.exp) {
    return failure("expired")
  }

  return { ok: true, payload: parsed }
}

export function validatePreviewToken(token: string, job: PreviewTokenSubject): PreviewTokenResult {
  const verified = verifyPreviewTokenSignature(token)
  if (!verified.ok) {
    return verified
  }

  if (verified.payload.jobId !== job.id || verified.payload.slug !== job.slug) {
    return failure("mismatch")
  }

  return {
    ok: true,
    jobId: verified.payload.jobId,
    slug: verified.payload.slug,
    expiresAt: new Date(verified.payload.exp).toISOString()
  }
}

async function resolveSubject(job: PreviewTokenSubject | string): Promise<PreviewTokenSubject> {
  if (typeof job !== "string") {
    if (typeof job.id !== "string" || typeof job.slug !== "string" || job.id.length === 0 || job.slug.length === 0) {
      throw new NotFoundError("Job not found")
    }
    return { id: job.id, slug: job.slug }
  }

  const record = await getAdminJobById(job)
  if (record === null) {
    throw new NotFoundError("Job not found")
  }
  return { id: record.id, slug: record.slug }
}
