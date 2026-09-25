import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  clearFailedAttempts,
  getRetryAfterSeconds,
  recordFailedAttempt
} from "@/lib/login-throttle"

function request(ip: string) {
  return new Request("https://admin.soonlay.tech/api/session", {
    headers: { "x-forwarded-for": ip }
  })
}

const EMAIL = "admin@soonlay.com"

beforeEach(() => {
  vi.useRealTimers()
  clearFailedAttempts(request("203.0.113.1"), EMAIL)
})

describe("login throttle", () => {
  it("allows eight attempts and blocks the ninth", () => {
    for (let i = 0; i < 7; i += 1) {
      recordFailedAttempt(request("203.0.113.1"), EMAIL)
    }
    // Seven failures so far: the eighth attempt may still be made.
    expect(getRetryAfterSeconds(request("203.0.113.1"), EMAIL)).toBe(0)

    recordFailedAttempt(request("203.0.113.1"), EMAIL)
    // The eighth attempt has now been used up, so the ninth is blocked.
    expect(getRetryAfterSeconds(request("203.0.113.1"), EMAIL)).toBeGreaterThan(0)
  })

  it("locks out after too many failures and reports a retry delay", () => {
    for (let i = 0; i < 9; i += 1) {
      recordFailedAttempt(request("203.0.113.1"), EMAIL)
    }
    const retryAfter = getRetryAfterSeconds(request("203.0.113.1"), EMAIL)
    expect(retryAfter).toBeGreaterThan(0)
    expect(retryAfter).toBeLessThanOrEqual(15 * 60)
  })

  it("expires the lockout after the window", () => {
    vi.useFakeTimers()
    for (let i = 0; i < 9; i += 1) {
      recordFailedAttempt(request("203.0.113.2"), EMAIL)
    }
    expect(getRetryAfterSeconds(request("203.0.113.2"), EMAIL)).toBeGreaterThan(0)

    vi.advanceTimersByTime(15 * 60 * 1000 + 1000)
    expect(getRetryAfterSeconds(request("203.0.113.2"), EMAIL)).toBe(0)
  })

  it("buckets by email, so one attacker cannot lock out a different address", () => {
    for (let i = 0; i < 9; i += 1) {
      recordFailedAttempt(request("203.0.113.3"), "attacker@evil.com")
    }
    expect(getRetryAfterSeconds(request("203.0.113.3"), "attacker@evil.com")).toBeGreaterThan(0)
    expect(getRetryAfterSeconds(request("203.0.113.3"), EMAIL)).toBe(0)
  })

  it("buckets by address, so one address cannot lock out an email used elsewhere", () => {
    for (let i = 0; i < 9; i += 1) {
      recordFailedAttempt(request("203.0.113.4"), EMAIL)
    }
    expect(getRetryAfterSeconds(request("203.0.113.4"), EMAIL)).toBeGreaterThan(0)
    expect(getRetryAfterSeconds(request("198.51.100.9"), EMAIL)).toBe(0)
  })

  it("treats email case and surrounding whitespace as the same bucket", () => {
    for (let i = 0; i < 9; i += 1) {
      recordFailedAttempt(request("203.0.113.5"), EMAIL)
    }
    expect(getRetryAfterSeconds(request("203.0.113.5"), "  ADMIN@Soonlay.COM ")).toBeGreaterThan(0)
  })

  it("clears the record after a successful sign-in", () => {
    for (let i = 0; i < 9; i += 1) {
      recordFailedAttempt(request("203.0.113.6"), EMAIL)
    }
    clearFailedAttempts(request("203.0.113.6"), EMAIL)
    expect(getRetryAfterSeconds(request("203.0.113.6"), EMAIL)).toBe(0)
  })

  it("reads only the first forwarded address", () => {
    const forwarded = new Request("https://admin.soonlay.tech/api/session", {
      headers: { "x-forwarded-for": "203.0.113.7, 70.41.3.18, 150.172.238.178" }
    })
    for (let i = 0; i < 9; i += 1) {
      recordFailedAttempt(forwarded, EMAIL)
    }
    expect(getRetryAfterSeconds(forwarded, EMAIL)).toBeGreaterThan(0)
    expect(getRetryAfterSeconds(request("70.41.3.18"), EMAIL)).toBe(0)
  })
})
