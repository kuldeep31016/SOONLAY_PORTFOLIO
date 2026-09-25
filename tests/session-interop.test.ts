import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { createSessionToken as createAdminToken, verifySessionToken as verifyAdminToken } from "../admin/lib/session-token"
import { createSessionToken as createPublicToken, verifySessionToken as verifyPublicToken } from "../lib/careers/session-token"

const SECRET = "a-shared-secret-that-is-at-least-32-characters"
const MAX_AGE = 5 * 24 * 60 * 60

function readModule(path: string) {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8")
}

describe("admin and public session token modules", () => {
  it("stays byte-identical, because the two apps cannot share a module", () => {
    expect(readModule("../lib/careers/session-token.ts")).toBe(
      readModule("../admin/lib/session-token.ts")
    )
  })
})

describe("cross-app session interoperability", () => {
  it("accepts a token minted by the admin app in the public app", () => {
    const issued = createAdminToken({ email: "admin@soonlay.com" }, SECRET, MAX_AGE)
    const claims = verifyPublicToken(issued, SECRET, Math.floor(Date.now() / 1000) + 1)

    expect(claims?.email).toBe("admin@soonlay.com")
    expect(claims?.sub).toBeTruthy()
  })

  it("accepts a token minted by the public app in the admin app", () => {
    const issued = createPublicToken({ email: "admin@soonlay.com" }, SECRET, MAX_AGE)
    expect(verifyAdminToken(issued, SECRET, Math.floor(Date.now() / 1000) + 1)?.email).toBe(
      "admin@soonlay.com"
    )
  })

  it("produces the same bytes from either module for the same claims", () => {
    const claims = { email: "admin@soonlay.com", iat: 1_800_000_000, sub: "session-id" }
    expect(createAdminToken(claims, SECRET, MAX_AGE)).toBe(
      createPublicToken(claims, SECRET, MAX_AGE)
    )
  })

  it("rejects a token when the two apps disagree on the secret", () => {
    const issued = createAdminToken({ email: "admin@soonlay.com" }, SECRET, MAX_AGE)
    expect(verifyPublicToken(issued, "a-different-secret-of-at-least-32-chars")).toBeNull()
  })

  it("preserves the five-day expiry across apps", () => {
    const issued = createAdminToken({ email: "admin@soonlay.com", iat: 1_800_000_000 }, SECRET, MAX_AGE)
    expect(verifyPublicToken(issued, SECRET, 1_800_000_000 + MAX_AGE)).toBeNull()
    expect(verifyAdminToken(issued, SECRET, 1_800_000_000 + MAX_AGE)).toBeNull()
  })
})
