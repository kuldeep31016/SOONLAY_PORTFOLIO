import "server-only"

import { getAdminEmails, getSessionSecret, isNormalizedEmail, normalizeEmail } from "./env"
import { ConfigurationError, ForbiddenError, UnauthorizedError } from "./errors"
import { verifySessionToken } from "./session-token"
import type { AdminIdentity } from "./types"

const BEARER_PREFIX = "bearer"

export function extractBearerToken(request: Request): string {
  const header = request.headers.get("authorization")
  if (header === null) {
    throw new UnauthorizedError()
  }

  const separator = header.indexOf(" ")
  if (separator < 0) {
    throw new UnauthorizedError()
  }

  const scheme = header.slice(0, separator).trim().toLowerCase()
  const token = header.slice(separator + 1).trim()

  if (scheme !== BEARER_PREFIX || token.length === 0) {
    throw new UnauthorizedError()
  }

  return token
}

/**
 * Admin credentials arrive as a session token minted by the admin portal after
 * it verified an email and password. This app never sees a password: it checks
 * the HMAC signature and expiry against the shared `CAREERS_SESSION_SECRET`,
 * then confirms the email is on the allowlist. Rotating the secret revokes every
 * outstanding session.
 */
export function verifyAdminToken(token: string): AdminIdentity {
  const claims = verifySessionToken(token, getSessionSecret())
  if (claims === null) {
    throw new UnauthorizedError("Invalid or expired credentials")
  }

  const email = normalizeEmail(claims.email)
  if (!isNormalizedEmail(email)) {
    throw new ForbiddenError("A valid email address is required")
  }

  const allowed = getAdminEmails()
  if (allowed.length === 0) {
    throw new ConfigurationError("Careers administration is not configured")
  }
  if (!allowed.includes(email)) {
    throw new ForbiddenError("You are not authorized to manage careers content")
  }

  return { uid: claims.sub, email }
}

export function requireAdmin(request: Request): AdminIdentity {
  return verifyAdminToken(extractBearerToken(request))
}
