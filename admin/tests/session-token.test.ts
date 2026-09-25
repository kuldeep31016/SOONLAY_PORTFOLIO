import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { createHmac } from "node:crypto"

import { createSessionToken, verifySessionToken } from "@/lib/session-token"
import { EnvironmentConfigurationError, getAdminUsers, getSessionSecret, findAdminUser, isPasswordLengthValid } from "@/lib/env"

const SECRET = "s".repeat(48)
const HASH = "scrypt$32768$8$1$AAAAAAAAAAAAAAAAAAAAAA$AAAA"
const MAX_AGE = 3600

const originalSecret = process.env.CAREERS_SESSION_SECRET
const originalUsers = process.env.CAREERS_ADMIN_USERS

afterEach(() => {
  if (originalSecret === undefined) delete process.env.CAREERS_SESSION_SECRET
  else process.env.CAREERS_SESSION_SECRET = originalSecret
  if (originalUsers === undefined) delete process.env.CAREERS_ADMIN_USERS
  else process.env.CAREERS_ADMIN_USERS = originalUsers
})

describe("session tokens", () => {
  it("round-trips the email and expiry", () => {
    const issued = createSessionToken({ email: "admin@soonlay.com" }, SECRET, MAX_AGE)
    const claims = verifySessionToken(issued, SECRET)

    expect(claims?.email).toBe("admin@soonlay.com")
    expect(claims?.sub).toBeTruthy()
    expect(claims?.exp).toBe((claims?.iat ?? 0) + MAX_AGE)
  })

  it("issues a unique session id per token", () => {
    const first = verifySessionToken(createSessionToken({ email: "a@b.com" }, SECRET, MAX_AGE), SECRET)
    const second = verifySessionToken(createSessionToken({ email: "a@b.com" }, SECRET, MAX_AGE), SECRET)
    expect(first?.sub).not.toBe(second?.sub)
  })

  it("produces the identical token for the same claims, so both apps can verify it", () => {
    const claims = { email: "admin@soonlay.com", iat: 1_800_000_000, sub: "fixed-session-id" }
    expect(createSessionToken(claims, SECRET, MAX_AGE)).toBe(
      createSessionToken(claims, SECRET, MAX_AGE)
    )
  })

  it("rejects a token verified against a different secret", () => {
    const issued = createSessionToken({ email: "admin@soonlay.com" }, SECRET, MAX_AGE)
    expect(verifySessionToken(issued, "x".repeat(48))).toBeNull()
  })

  it("rejects a payload edited to swap the email", () => {
    const [payload, signature] = createSessionToken({ email: "a@b.com" }, SECRET, MAX_AGE).split(".")
    const forged = Buffer.from(
      JSON.stringify({ sub: "s", email: "attacker@evil.com", iat: 1, exp: 99999999999 })
    ).toString("base64url")

    expect(verifySessionToken(`${forged}.${signature}`, SECRET)).toBeNull()
    expect(payload).toBeTruthy()
  })

  it("rejects a token that has expired", () => {
    const issued = createSessionToken({ email: "a@b.com", iat: 1_800_000_000 }, SECRET, MAX_AGE)
    expect(verifySessionToken(issued, SECRET, 1_800_000_000 + MAX_AGE)).toBeNull()
    expect(verifySessionToken(issued, SECRET, 1_800_000_000 + MAX_AGE - 1)).not.toBeNull()
  })

  it("rejects malformed input without throwing", () => {
    for (const candidate of ["", "x", "a.b", ".", "..", "a.", ".b", "x".repeat(5000)]) {
      expect(verifySessionToken(candidate, SECRET)).toBeNull()
    }
  })

  it("rejects a correctly signed token whose claims are the wrong shape", () => {
    // Signed with the real secret, so this exercises claim validation, not the signature check.
    for (const claims of [
      { email: "a@b.com" },
      { email: "a@b.com", iat: 1, exp: 99999999999 },
      { sub: "s", email: "", iat: 1, exp: 99999999999 },
      { sub: "", email: "a@b.com", iat: 1, exp: 99999999999 },
      { sub: "s", email: "a@b.com", iat: "1", exp: "99999999999" },
      { sub: "s", email: `${"a".repeat(300)}@b.com`, iat: 1, exp: 99999999999 },
      null
    ]) {
      const payload = Buffer.from(JSON.stringify(claims)).toString("base64url")
      const signature = createHmac("sha256", SECRET).update(payload).digest("base64url")
      expect(verifySessionToken(`${payload}.${signature}`, SECRET)).toBeNull()
    }
  })
})

describe("getSessionSecret", () => {
  it("returns the configured secret", () => {
    process.env.CAREERS_SESSION_SECRET = SECRET
    expect(getSessionSecret()).toBe(SECRET)
  })

  it("rejects a missing or too-short secret", () => {
    for (const value of ["", "   ", "too-short", undefined]) {
      if (value === undefined) delete process.env.CAREERS_SESSION_SECRET
      else process.env.CAREERS_SESSION_SECRET = value
      expect(() => getSessionSecret()).toThrow(EnvironmentConfigurationError)
    }
  })
})

describe("getAdminUsers", () => {
  it("parses email and hash pairs", () => {
    process.env.CAREERS_ADMIN_USERS = `admin@soonlay.com:${HASH}, second@soonlay.com:${HASH}`
    const users = getAdminUsers()

    expect(users).toHaveLength(2)
    expect(users[0].email).toBe("admin@soonlay.com")
    expect(users[0].passwordHash).toBe(HASH)
  })

  it("normalizes the email and tolerates whitespace", () => {
    process.env.CAREERS_ADMIN_USERS = `  ADMIN@Soonlay.com:${HASH}  `
    expect(getAdminUsers()[0].email).toBe("admin@soonlay.com")
  })

  it("keeps the $ separators inside the hash intact", () => {
    process.env.CAREERS_ADMIN_USERS = `admin@soonlay.com:${HASH}`
    expect(getAdminUsers()[0].passwordHash).toBe(HASH)
  })

  it("accepts a hash whose $ separators were escaped for a .env file", () => {
    // Next.js expands $NAME while reading .env files, so a pasted hash has to be
    // written as \$. The parser normalises both forms to the same value.
    process.env.CAREERS_ADMIN_USERS = `admin@soonlay.com:${HASH.replaceAll("$", "\\$")}`
    expect(getAdminUsers()[0].passwordHash).toBe(HASH)
  })

  it("rejects a hash that env expansion truncated", () => {
    // The failure mode this guards against: "admin@soonlay.com:scrypt".
    process.env.CAREERS_ADMIN_USERS = "admin@soonlay.com:scrypt"
    expect(() => getAdminUsers()).toThrow(EnvironmentConfigurationError)
  })

  it("skips malformed entries", () => {
    process.env.CAREERS_ADMIN_USERS = `no-colon, missing-hash@x.com:plaintext, admin@soonlay.com:${HASH}`
    const users = getAdminUsers()

    expect(users).toHaveLength(1)
    expect(users[0].email).toBe("admin@soonlay.com")
  })

  it("throws when unset or entirely invalid", () => {
    for (const value of ["", "   ", "garbage", "a:b", undefined]) {
      if (value === undefined) delete process.env.CAREERS_ADMIN_USERS
      else process.env.CAREERS_ADMIN_USERS = value
      expect(() => getAdminUsers()).toThrow(EnvironmentConfigurationError)
    }
  })
})

describe("findAdminUser", () => {
  beforeEach(() => {
    process.env.CAREERS_ADMIN_USERS = `admin@soonlay.com:${HASH}`
  })

  it("finds a user case-insensitively", () => {
    expect(findAdminUser("ADMIN@SOONLAY.COM")?.passwordHash).toBe(HASH)
  })

  it("returns null for an unknown email", () => {
    expect(findAdminUser("stranger@evil.com")).toBeNull()
  })

  it("returns null instead of throwing when unconfigured", () => {
    delete process.env.CAREERS_ADMIN_USERS
    expect(findAdminUser("admin@soonlay.com")).toBeNull()
  })
})

describe("isPasswordLengthValid", () => {
  it("accepts a reasonable password and rejects empty or absurd ones", () => {
    expect(isPasswordLengthValid("password123")).toBe(true)
    expect(isPasswordLengthValid("")).toBe(false)
    expect(isPasswordLengthValid("a".repeat(1025))).toBe(false)
  })
})
