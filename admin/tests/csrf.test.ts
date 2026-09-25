import { describe, expect, it } from "vitest"
import { NextRequest } from "next/server"

import { createCsrfToken, getRequestCsrfToken, isSameOrigin, verifyCsrfToken } from "@/lib/csrf"
import { CSRF_COOKIE_NAME } from "@/lib/session"

function request(options: {
  url?: string
  origin?: string
  referer?: string
  headers?: Record<string, string>
  cookies?: Record<string, string>
} = {}) {
  const headers = new Headers(options.headers)
  if (options.origin) headers.set("origin", options.origin)
  if (options.referer) headers.set("referer", options.referer)
  if (options.cookies) {
    headers.set(
      "cookie",
      Object.entries(options.cookies)
        .map(([name, value]) => `${name}=${value}`)
        .join("; ")
    )
  }

  return new NextRequest(options.url ?? "https://admin.soonlay.tech/api/jobs", {
    method: "POST",
    headers
  })
}

describe("isSameOrigin", () => {
  it("accepts a matching Origin header", () => {
    expect(isSameOrigin(request({ origin: "https://admin.soonlay.tech" }))).toBe(true)
  })

  it("rejects a cross-site Origin header", () => {
    expect(isSameOrigin(request({ origin: "https://evil.example.com" }))).toBe(false)
  })

  it("rejects an http origin on the same host", () => {
    expect(isSameOrigin(request({ origin: "http://admin.soonlay.tech" }))).toBe(false)
  })

  it("falls back to the Referer when Origin is absent", () => {
    expect(isSameOrigin(request({ referer: "https://admin.soonlay.tech/jobs" }))).toBe(true)
    expect(isSameOrigin(request({ referer: "https://evil.example.com/jobs" }))).toBe(false)
  })

  it("prefers Origin over Referer", () => {
    expect(
      isSameOrigin(request({ origin: "https://evil.example.com", referer: "https://admin.soonlay.tech/jobs" }))
    ).toBe(false)
  })

  it("rejects a request with neither header", () => {
    expect(isSameOrigin(request())).toBe(false)
  })

  it("rejects a garbage Referer instead of throwing", () => {
    expect(isSameOrigin(request({ referer: "not a url" }))).toBe(false)
  })

  it("trusts the forwarded host and protocol behind a proxy", () => {
    const forwarded = request({
      url: "http://localhost:3000/api/jobs",
      origin: "https://admin.soonlay.tech",
      headers: { "x-forwarded-host": "admin.soonlay.tech", "x-forwarded-proto": "https" }
    })

    expect(isSameOrigin(forwarded)).toBe(true)
  })

  it("rejects an origin that only differs by a suffix", () => {
    expect(isSameOrigin(request({ origin: "https://admin.soonlay.tech.evil.com" }))).toBe(false)
  })
})

describe("verifyCsrfToken", () => {
  it("accepts a matching cookie and header pair", () => {
    const token = createCsrfToken()
    const csrf = request({
      cookies: { [CSRF_COOKIE_NAME]: token },
      headers: { "x-csrf-token": token }
    })

    expect(verifyCsrfToken(csrf)).toBe(true)
  })

  it("rejects a mismatched header", () => {
    const csrf = request({
      cookies: { [CSRF_COOKIE_NAME]: createCsrfToken() },
      headers: { "x-csrf-token": createCsrfToken() }
    })

    expect(verifyCsrfToken(csrf)).toBe(false)
  })

  it("rejects a missing header", () => {
    const csrf = request({ cookies: { [CSRF_COOKIE_NAME]: createCsrfToken() } })
    expect(verifyCsrfToken(csrf)).toBe(false)
  })

  it("rejects a missing cookie", () => {
    const csrf = request({ headers: { "x-csrf-token": createCsrfToken() } })
    expect(verifyCsrfToken(csrf)).toBe(false)
  })

  it("rejects an empty pair", () => {
    expect(verifyCsrfToken(request())).toBe(false)
  })

  it("rejects a header of a different length without throwing", () => {
    const csrf = request({
      cookies: { [CSRF_COOKIE_NAME]: createCsrfToken() },
      headers: { "x-csrf-token": "short" }
    })

    expect(verifyCsrfToken(csrf)).toBe(false)
  })

  it("issues unguessable, unique tokens", () => {
    const tokens = new Set(Array.from({ length: 50 }, () => createCsrfToken()))
    expect(tokens.size).toBe(50)
    expect([...tokens][0]).toMatch(/^[0-9a-f]{64}$/)
  })

  it("reads the token from the request cookie", () => {
    const token = createCsrfToken()
    expect(getRequestCsrfToken(request({ cookies: { [CSRF_COOKIE_NAME]: token } }))).toBe(token)
    expect(getRequestCsrfToken(request())).toBe("")
  })
})
