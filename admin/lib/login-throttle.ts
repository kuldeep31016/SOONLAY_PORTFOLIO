import "server-only"

import { createHash } from "node:crypto"

/**
 * In-memory throttling for the credential login endpoint.
 *
 * Firebase used to absorb brute-force attempts on our behalf. Now that the
 * admin portal verifies passwords itself, the app has to do that. The counters
 * live in this module, so they reset on deploy or restart and are per-instance.
 * That is acceptable for a portal with a handful of admins behind the same
 * origin: it blunts casual password spraying without pretending to be a
 * distributed rate limiter. A shared store is the upgrade path if the portal
 * is ever exposed more widely.
 */

const MAX_ATTEMPTS = 8
const WINDOW_MS = 15 * 60 * 1000
const MAX_TRACKED_KEYS = 10_000

interface AttemptRecord {
  count: number
  resetAt: number
}

const attempts = new Map<string, AttemptRecord>()

/**
 * Buckets by normalized email and client address together, so one attacker
 * cannot lock every admin out by hammering a single address, and a shared
 * office NAT cannot let one machine grind through a whole address list.
 */
function getAttemptKey(email: string, address: string) {
  return createHash("sha256")
    .update(`${email.trim().toLowerCase()}\u0000${address}`)
    .digest("base64url")
}

function getClientAddress(request: { headers: Headers }) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  if (forwarded) {
    return forwarded
  }
  return request.headers.get("x-real-ip")?.trim() ?? "unknown"
}

function prune(now: number) {
  for (const [key, record] of attempts) {
    if (record.resetAt <= now) {
      attempts.delete(key)
    }
  }

  // Guard against unbounded growth from an attacker rotating addresses.
  if (attempts.size > MAX_TRACKED_KEYS) {
    const entries = [...attempts.entries()].sort((a, b) => a[1].resetAt - b[1].resetAt)
    for (const [key] of entries.slice(0, attempts.size - MAX_TRACKED_KEYS)) {
      attempts.delete(key)
    }
  }
}

export function getRetryAfterSeconds(request: Request & { headers: Headers }, email: string) {
  const now = Date.now()
  prune(now)

  const record = attempts.get(getAttemptKey(email, getClientAddress(request)))
  if (!record || record.resetAt <= now) {
    return 0
  }

  if (record.count < MAX_ATTEMPTS) {
    return 0
  }

  return Math.ceil((record.resetAt - now) / 1000)
}

/**
 * Call only after a failed attempt. Successful logins are not tracked, so a
 * legitimate admin is never throttled for their own typo.
 */
export function recordFailedAttempt(request: Request & { headers: Headers }, email: string) {
  const now = Date.now()
  prune(now)

  const key = getAttemptKey(email, getClientAddress(request))
  const record = attempts.get(key)

  if (!record || record.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return
  }

  record.count += 1
}

export function clearFailedAttempts(request: Request & { headers: Headers }, email: string) {
  attempts.delete(getAttemptKey(email, getClientAddress(request)))
}
