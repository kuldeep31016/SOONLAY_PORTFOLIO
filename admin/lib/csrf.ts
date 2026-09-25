import { randomBytes, timingSafeEqual } from "node:crypto"
import type { NextRequest, NextResponse } from "next/server"
import { CSRF_COOKIE_NAME } from "./session"

const CSRF_HEADER_NAME = "x-csrf-token"

function getFirstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() ?? ""
}

function getExpectedOrigins(request: NextRequest) {
  const origins = new Set<string>()

  try {
    origins.add(new URL(request.url).origin)
  } catch {
    return origins
  }

  const forwardedHost = getFirstHeaderValue(request.headers.get("x-forwarded-host"))
  const host = forwardedHost || getFirstHeaderValue(request.headers.get("host"))
  const forwardedProtocol = getFirstHeaderValue(request.headers.get("x-forwarded-proto"))
  const protocol = forwardedProtocol || new URL(request.url).protocol.replace(":", "")

  if (host && protocol) {
    origins.add(`${protocol}://${host}`)
  }

  return origins
}

export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin")
  const referer = request.headers.get("referer")
  const expectedOrigins = getExpectedOrigins(request)
  const suppliedOrigin = origin || (() => {
    if (!referer) {
      return ""
    }
    try {
      return new URL(referer).origin
    } catch {
      return ""
    }
  })()

  return Boolean(suppliedOrigin && expectedOrigins.has(suppliedOrigin))
}

export function createCsrfToken() {
  return randomBytes(32).toString("hex")
}

export function getRequestCsrfToken(request: NextRequest) {
  return request.cookies.get(CSRF_COOKIE_NAME)?.value ?? ""
}

export function verifyCsrfToken(request: NextRequest) {
  const cookieToken = getRequestCsrfToken(request)
  const headerToken = request.headers.get(CSRF_HEADER_NAME) ?? ""
  if (!cookieToken || !headerToken) {
    return false
  }

  const cookieBuffer = Buffer.from(cookieToken)
  const headerBuffer = Buffer.from(headerToken)
  return cookieBuffer.length === headerBuffer.length && timingSafeEqual(cookieBuffer, headerBuffer)
}

export function setCsrfCookie(response: NextResponse, value: string) {
  response.cookies.set({
    name: CSRF_COOKIE_NAME,
    value,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 5 * 24 * 60 * 60
  })
}

export function clearCsrfCookie(response: NextResponse) {
  response.cookies.set({
    name: CSRF_COOKIE_NAME,
    value: "",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0
  })
}
