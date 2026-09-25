import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  extractBearerToken,
  requireAdmin,
  verifyAdminToken
} from "@/lib/careers/auth"
import { createSessionToken } from "@/lib/careers/session-token"
import {
  ConfigurationError,
  ForbiddenError,
  UnauthorizedError
} from "@/lib/careers/errors"

const SECRET = "a".repeat(48)
const MAX_AGE = 5 * 24 * 60 * 60

const originalSecret = process.env.CAREERS_SESSION_SECRET
const originalAdminEmails = process.env.CAREERS_ADMIN_EMAILS

beforeEach(() => {
  process.env.CAREERS_SESSION_SECRET = SECRET
  process.env.CAREERS_ADMIN_EMAILS = "owner@soonlay.tech,second@soonlay.tech"
})

afterEach(() => {
  if (originalSecret === undefined) {
    delete process.env.CAREERS_SESSION_SECRET
  } else {
    process.env.CAREERS_SESSION_SECRET = originalSecret
  }
  if (originalAdminEmails === undefined) {
    delete process.env.CAREERS_ADMIN_EMAILS
  } else {
    process.env.CAREERS_ADMIN_EMAILS = originalAdminEmails
  }
  vi.useRealTimers()
})

function token(email = "owner@soonlay.tech", secret = SECRET) {
  return createSessionToken({ email }, secret, MAX_AGE)
}

describe("extractBearerToken", () => {
  it("accepts a bearer token case-insensitively", () => {
    const request = new Request("https://soonlay.tech/api/admin/jobs", {
      headers: { authorization: "Bearer abc" }
    })
    expect(extractBearerToken(request)).toBe("abc")
  })

  it("rejects a missing or malformed header", () => {
    for (const authorization of ["", "abc", "Basic abc", "Bearer", "Bearer   "]) {
      const request = new Request("https://soonlay.tech/api/admin/jobs", {
        headers: { authorization }
      })
      expect(() => extractBearerToken(request)).toThrow(UnauthorizedError)
    }

    expect(() =>
      extractBearerToken(new Request("https://soonlay.tech/api/admin/jobs"))
    ).toThrow(UnauthorizedError)
  })
})

describe("verifyAdminToken", () => {
  it("accepts a correctly signed token for an allowlisted email", () => {
    const identity = verifyAdminToken(token())
    expect(identity.email).toBe("owner@soonlay.tech")
    expect(identity.uid).toBeTruthy()
  })

  it("normalizes the email before comparing it to the allowlist", () => {
    expect(verifyAdminToken(token("  OWNER@Soonlay.TECH  ")).email).toBe("owner@soonlay.tech")
  })

  it("rejects a token signed with a different secret", () => {
    expect(() => verifyAdminToken(token("owner@soonlay.tech", "b".repeat(48)))).toThrow(
      UnauthorizedError
    )
  })

  it("rejects a token whose payload was edited to a different email", () => {
    const issued = token()
    const [payload, signature] = issued.split(".")
    const forged = Buffer.from(
      JSON.stringify({ sub: "x", email: "attacker@evil.com", iat: 1, exp: 99999999999 })
    ).toString("base64url")

    expect(() => verifyAdminToken(`${forged}.${signature}`)).toThrow(UnauthorizedError)
    expect(() => verifyAdminToken(`${payload}.${signature.slice(0, -1)}x`)).toThrow(UnauthorizedError)
  })

  it("rejects garbage, empty, and structurally invalid tokens", () => {
    for (const candidate of ["", "nonsense", "a.b", ".", "a.", JSON.stringify({})]) {
      expect(() => verifyAdminToken(candidate)).toThrow(UnauthorizedError)
    }
  })

  it("rejects an expired token", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const issued = token()

    vi.setSystemTime(new Date("2026-01-06T00:00:01Z"))
    expect(() => verifyAdminToken(issued)).toThrow(UnauthorizedError)
  })

  it("accepts a token that has not expired yet", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const issued = token()

    vi.setSystemTime(new Date("2026-01-05T23:59:59Z"))
    expect(verifyAdminToken(issued).email).toBe("owner@soonlay.tech")
  })

  it("rejects a validly signed token for an email that is not allowlisted", () => {
    expect(() => verifyAdminToken(token("stranger@example.com"))).toThrow(ForbiddenError)
  })

  it("fails closed when the allowlist is unset", () => {
    process.env.CAREERS_ADMIN_EMAILS = "   "
    expect(() => verifyAdminToken(token())).toThrow(ConfigurationError)
  })

  it("fails closed when the session secret is too short", () => {
    process.env.CAREERS_SESSION_SECRET = "too-short"
    expect(() => verifyAdminToken(token())).toThrow(ConfigurationError)
  })

  it("fails closed when the session secret is unset", () => {
    delete process.env.CAREERS_SESSION_SECRET
    expect(() => verifyAdminToken(token())).toThrow(ConfigurationError)
  })
})

describe("requireAdmin", () => {
  it("authorizes a request carrying a valid session token", () => {
    const request = new Request("https://soonlay.tech/api/admin/jobs", {
      headers: { authorization: `Bearer ${token()}` }
    })

    expect(requireAdmin(request).email).toBe("owner@soonlay.tech")
  })

  it("rejects a request with no credentials", () => {
    const request = new Request("https://soonlay.tech/api/admin/jobs")
    expect(() => requireAdmin(request)).toThrow(UnauthorizedError)
  })
})
