import "server-only"

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"

/**
 * Self-contained admin session tokens.
 *
 * The admin portal signs in with an email and password, then mints a compact
 * HMAC-signed token. This app only ever *verifies* those tokens, so it never
 * needs a password verifier or a user store here.
 *
 * NOTE: `admin/lib/session-token.ts` is a deliberate copy of this file. The two
 * apps are deployed independently, so they cannot share a module. Any change
 * here must be mirrored there.
 */

export interface AdminSessionClaims {
  /** Random per-session identifier. Carries no personal data. */
  sub: string
  email: string
  /** Issued-at, seconds since epoch. */
  iat: number
  /** Expiry, seconds since epoch. */
  exp: number
}

const SEPARATOR = "."
const MAX_TOKEN_LENGTH = 4096
const MAX_EMAIL_LENGTH = 254

function base64UrlEncode(value: Buffer | string): string {
  return Buffer.from(value).toString("base64url")
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url")
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}

function nowInSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

function isValidClaims(value: unknown): value is AdminSessionClaims {
  if (value === null || typeof value !== "object") {
    return false
  }
  const claims = value as Record<string, unknown>
  return (
    typeof claims.sub === "string" &&
    claims.sub.length > 0 &&
    typeof claims.email === "string" &&
    claims.email.length > 0 &&
    claims.email.length <= MAX_EMAIL_LENGTH &&
    Number.isInteger(claims.iat) &&
    Number.isInteger(claims.exp)
  )
}

export function createSessionId(): string {
  return randomBytes(18).toString("base64url")
}

export function createSessionToken(
  claims: { email: string; iat?: number; sub?: string },
  secret: string,
  maxAgeSeconds: number
): string {
  const issuedAt = claims.iat ?? nowInSeconds()
  const payload: AdminSessionClaims = {
    sub: claims.sub ?? createSessionId(),
    email: claims.email,
    iat: issuedAt,
    exp: issuedAt + maxAgeSeconds
  }

  const encoded = base64UrlEncode(JSON.stringify(payload))
  return `${encoded}${SEPARATOR}${sign(encoded, secret)}`
}

/**
 * Returns the claims for a structurally valid, correctly signed, unexpired
 * token, or null for anything else. Never throws on malformed input, so callers
 * can treat a bad token as simply unauthenticated.
 */
export function verifySessionToken(
  token: string,
  secret: string,
  nowSeconds: number = nowInSeconds()
): AdminSessionClaims | null {
  if (typeof token !== "string" || token.length === 0 || token.length > MAX_TOKEN_LENGTH) {
    return null
  }

  const separator = token.lastIndexOf(SEPARATOR)
  if (separator <= 0) {
    return null
  }

  const encoded = token.slice(0, separator)
  const signature = token.slice(separator + 1)
  if (signature.length === 0) {
    return null
  }

  // Verify before decoding so malformed payloads never reach JSON.parse.
  if (!safeEqual(signature, sign(encoded, secret))) {
    return null
  }

  let claims: unknown
  try {
    claims = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"))
  } catch {
    return null
  }

  if (!isValidClaims(claims)) {
    return null
  }

  if (claims.exp <= nowSeconds) {
    return null
  }

  return claims
}
