import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { NextRequest } from "next/server"

import { POST, GET, DELETE } from "@/app/api/session/route"
import { CSRF_COOKIE_NAME, SESSION_COOKIE_NAME } from "@/lib/session"
import { createCsrfToken } from "@/lib/csrf"
import { hashPassword } from "@/lib/password"
import { clearFailedAttempts } from "@/lib/login-throttle"

const SECRET = "shared-secret-value-that-is-long-enough-1234"
const ORIGIN = "https://admin.soonlay.tech"
const EMAIL = "admin@soonlay.com"
const PASSWORD = "correct horse battery staple"
const CLIENT_IP = "203.0.113.9"

const originalEnv = { ...process.env }

let passwordHash = ""

function buildRequest(options: {
  method?: string
  body?: unknown
  token?: string
  cookieToken?: string
  session?: string
  origin?: string | null
  forwardedFor?: string
} = {}) {
  const method = options.method ?? "POST"
  const headers = new Headers({
    "x-forwarded-for": options.forwardedFor ?? CLIENT_IP
  })

  if (options.origin === null) {
    // Send neither origin nor referer, as a cross-site form post would not.
  } else {
    headers.set("origin", options.origin ?? ORIGIN)
  }

  // verifyCsrfToken() requires the cookie and the header to agree.
  const cookies: string[] = []
  if (options.token) headers.set("x-csrf-token", options.token)
  const cookieToken = options.cookieToken ?? options.token
  if (cookieToken) cookies.push(`${CSRF_COOKIE_NAME}=${cookieToken}`)
  if (options.session) cookies.push(`${SESSION_COOKIE_NAME}=${options.session}`)
  if (cookies.length > 0) headers.set("cookie", cookies.join("; "))

  return new NextRequest(`${ORIGIN}/api/session`, {
    method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  })
}

beforeEach(async () => {
  passwordHash = await hashPassword(PASSWORD)
  process.env.CAREERS_SESSION_SECRET = SECRET
  process.env.CAREERS_ADMIN_USERS = `${EMAIL}:${passwordHash}`
  process.env.CAREERS_ADMIN_EMAILS = EMAIL
  clearFailedAttempts(buildRequest(), EMAIL)
})

afterEach(() => {
  process.env = { ...originalEnv }
})

describe("POST /api/session", () => {
  it("issues an HttpOnly session cookie for correct credentials", async () => {
    const token = createCsrfToken()
    const response = await POST(
      buildRequest({ token, body: { email: EMAIL, password: PASSWORD }, session: undefined })
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ authenticated: true })

    const cookie = response.cookies.get(SESSION_COOKIE_NAME)
    expect(cookie?.httpOnly).toBe(true)
    expect(cookie?.sameSite).toBe("strict")
    expect(cookie?.path).toBe("/")
    expect(cookie?.maxAge).toBeGreaterThan(0)
    expect(cookie?.value.split(".")).toHaveLength(2)
  })

  it("mints a token the public app can verify", async () => {
    const token = createCsrfToken()
    const response = await POST(buildRequest({ token, body: { email: EMAIL, password: PASSWORD } }))
    const { createSessionToken, verifySessionToken } = await import("@/lib/session-token")
    const value = response.cookies.get(SESSION_COOKIE_NAME)?.value ?? ""

    const claims = verifySessionToken(value, SECRET)
    expect(claims?.email).toBe(EMAIL)
    expect(createSessionToken).toBeTypeOf("function")
  })

  it("accepts a differently cased email", async () => {
    const token = createCsrfToken()
    const response = await POST(
      buildRequest({ token, body: { email: "  ADMIN@SOONLAY.COM ", password: PASSWORD } })
    )
    expect(response.status).toBe(200)
  })

  it("rejects a wrong password without a session cookie", async () => {
    const token = createCsrfToken()
    const response = await POST(buildRequest({ token, body: { email: EMAIL, password: "wrong" } }))

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toMatchObject({ code: "INVALID_CREDENTIALS" })
    expect(response.cookies.get(SESSION_COOKIE_NAME)).toBeUndefined()
  })

  it("gives the same answer for an unknown email as for a wrong password", async () => {
    const token = createCsrfToken()
    const unknown = await POST(
      buildRequest({ token, body: { email: "nobody@soonlay.com", password: PASSWORD } })
    )
    const wrong = await POST(buildRequest({ token, body: { email: EMAIL, password: "wrong" } }))

    expect(unknown.status).toBe(wrong.status)
    await expect(unknown.json()).resolves.toMatchObject({ code: "INVALID_CREDENTIALS" })
  })

  it("rejects cross-origin and missing-origin requests", async () => {
    const token = createCsrfToken()
    const body = { email: EMAIL, password: PASSWORD }

    const crossOrigin = await POST(
      buildRequest({ token, body, origin: "https://evil.example" })
    )
    expect(crossOrigin.status).toBe(403)
    await expect(crossOrigin.json()).resolves.toMatchObject({ code: "INVALID_ORIGIN" })

    const noOrigin = await POST(buildRequest({ token, body, origin: null }))
    expect(noOrigin.status).toBe(403)
  })

  it("rejects a request with a missing or wrong CSRF token", async () => {
    const body = { email: EMAIL, password: PASSWORD }

    const missing = await POST(buildRequest({ body }))
    expect(missing.status).toBe(403)
    await expect(missing.json()).resolves.toMatchObject({ code: "INVALID_CSRF" })

    const wrong = await POST(
      buildRequest({ token: "header-value", cookieToken: "cookie-value", body })
    )
    expect(wrong.status).toBe(403)
    await expect(wrong.json()).resolves.toMatchObject({ code: "INVALID_CSRF" })
  })

  it("rejects a body that is not valid JSON", async () => {
    const token = createCsrfToken()
    const request = new NextRequest(`${ORIGIN}/api/session`, {
      method: "POST",
      headers: { origin: ORIGIN, "x-csrf-token": token, cookie: `${CSRF_COOKIE_NAME}=${token}` },
      body: "not json"
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({ code: "INVALID_JSON" })
  })

  it("rejects a missing password instead of treating it as a blank", async () => {
    const token = createCsrfToken()
    const response = await POST(buildRequest({ token, body: { email: EMAIL } }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({ code: "INVALID_CREDENTIALS" })
  })

  it("does not issue a session when admin users are unconfigured", async () => {
    delete process.env.CAREERS_ADMIN_USERS
    const token = createCsrfToken()
    const response = await POST(buildRequest({ token, body: { email: EMAIL, password: PASSWORD } }))

    expect(response.status).toBe(401)
    expect(response.cookies.get(SESSION_COOKIE_NAME)).toBeUndefined()
  })

  it("never caches the response", async () => {
    const token = createCsrfToken()
    const response = await POST(buildRequest({ token, body: { email: EMAIL, password: PASSWORD } }))
    expect(response.headers.get("cache-control")).toBe("no-store")
  })

  it("throttles repeated failures", async () => {
    const token = createCsrfToken()
    let throttled = false

    for (let i = 0; i < 12; i += 1) {
      const response = await POST(
        buildRequest({ token, body: { email: EMAIL, password: `wrong-${i}` } })
      )
      if (response.status === 429) {
        throttled = true
        await expect(response.json()).resolves.toMatchObject({ code: "TOO_MANY_REQUESTS" })
        expect(response.headers.get("retry-after")).toBeTruthy()
        break
      }
    }

    expect(throttled).toBe(true)
  })
})

describe("GET /api/session", () => {
  it("reports an unauthenticated request and seeds a CSRF cookie", async () => {
    const response = await GET(buildRequest({ method: "GET" }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ authenticated: false })

    const cookie = response.cookies.get(CSRF_COOKIE_NAME)
    expect(cookie?.value).toBeTruthy()
    expect(cookie?.httpOnly).toBe(false)
    expect(cookie?.sameSite).toBe("strict")
  })

  it("reports an authenticated request for a valid session", async () => {
    const { createSessionToken } = await import("@/lib/session-token")
    const session = createSessionToken({ email: EMAIL }, SECRET, 3600)

    const response = await GET(buildRequest({ method: "GET", session }))
    await expect(response.json()).resolves.toEqual({ authenticated: true })
  })

  it("treats a tampered session as unauthenticated", async () => {
    const response = await GET(buildRequest({ method: "GET", session: "not.a.token" }))
    await expect(response.json()).resolves.toEqual({ authenticated: false })
  })
})

describe("DELETE /api/session", () => {
  it("clears the session and CSRF cookies", async () => {
    const token = createCsrfToken()
    const response = await DELETE(buildRequest({ method: "DELETE", token }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ authenticated: false })
    expect(response.cookies.get(SESSION_COOKIE_NAME)?.maxAge).toBe(0)
    expect(response.cookies.get(CSRF_COOKIE_NAME)?.maxAge).toBe(0)
  })

  it("refuses a cross-origin logout", async () => {
    const token = createCsrfToken()
    const response = await DELETE(
      buildRequest({ method: "DELETE", token, origin: "https://evil.example" })
    )
    expect(response.status).toBe(403)
  })
})
