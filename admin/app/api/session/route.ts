import { NextRequest, NextResponse } from "next/server"
import {
  clearCsrfCookie,
  createCsrfToken,
  getRequestCsrfToken,
  isSameOrigin,
  setCsrfCookie,
  verifyCsrfToken
} from "@/lib/csrf"
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createAdminSessionToken,
  getSessionContext
} from "@/lib/session"
import { EnvironmentConfigurationError, findAdminUser, isPasswordLengthValid } from "@/lib/env"
import { clearFailedAttempts, getRetryAfterSeconds, recordFailedAttempt } from "@/lib/login-throttle"
import { verifyPassword } from "@/lib/password"
import { sessionCreateSchema } from "@/lib/schemas"
import { zodFieldErrors } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function jsonError(message: string, status: number, code: string) {
  return NextResponse.json({ error: message, code }, { status, headers: { "Cache-Control": "no-store" } })
}

function setSessionCookie(response: NextResponse, value: string) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS
  })
}

function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0
  })
}

export async function GET(request: NextRequest) {
  const response = NextResponse.json(
    { authenticated: false },
    { headers: { "Cache-Control": "no-store" } }
  )
  const csrfToken = getRequestCsrfToken(request) || createCsrfToken()
  setCsrfCookie(response, csrfToken)

  try {
    const session = getSessionContext(request.cookies.get(SESSION_COOKIE_NAME)?.value)
    if (session) {
      const authenticatedResponse = NextResponse.json(
        { authenticated: true },
        { headers: { "Cache-Control": "no-store" } }
      )
      setCsrfCookie(authenticatedResponse, csrfToken)
      return authenticatedResponse
    }
  } catch (error) {
    if (error instanceof EnvironmentConfigurationError) {
      return jsonError("Admin authentication is not configured", 500, "ADMIN_NOT_CONFIGURED")
    }
  }

  return response
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return jsonError("Same-origin requests are required", 403, "INVALID_ORIGIN")
  }
  if (!verifyCsrfToken(request)) {
    return jsonError("CSRF validation failed", 403, "INVALID_CSRF")
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonError("Request body must be valid JSON", 400, "INVALID_JSON")
  }

  const parsed = sessionCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter your email and password", code: "INVALID_CREDENTIALS", fieldErrors: zodFieldErrors(parsed.error) },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    )
  }

  const { email, password } = parsed.data

  const retryAfterSeconds = getRetryAfterSeconds(request, email)
  if (retryAfterSeconds > 0) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Please try again later.", code: "TOO_MANY_REQUESTS" },
      { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": String(retryAfterSeconds) } }
    )
  }

  if (!isPasswordLengthValid(password)) {
    recordFailedAttempt(request, email)
    return jsonError("The email or password is incorrect", 401, "INVALID_CREDENTIALS")
  }

  // Always run a verification so a wrong email and a wrong password take the
  // same amount of time, which avoids turning this into a user-enumeration oracle.
  const user = findAdminUser(email)
  const storedHash =
    user?.passwordHash ??
    // A fixed, valid hash of an unguessable value, used purely to equalize timing.
    "scrypt$32768$8$1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"

  let valid = false
  try {
    valid = await verifyPassword(password, storedHash)
  } catch {
    valid = false
  }

  if (!user || !valid) {
    recordFailedAttempt(request, email)
    return jsonError("The email or password is incorrect", 401, "INVALID_CREDENTIALS")
  }

  clearFailedAttempts(request, email)

  let sessionCookie: string
  try {
    sessionCookie = createAdminSessionToken(user.email)
  } catch (error) {
    if (error instanceof EnvironmentConfigurationError) {
      return jsonError("Admin authentication is not configured", 500, "ADMIN_NOT_CONFIGURED")
    }
    return jsonError("The secure session could not be created", 401, "SESSION_CREATE_FAILED")
  }

  const response = NextResponse.json(
    { authenticated: true },
    { headers: { "Cache-Control": "no-store" } }
  )
  setSessionCookie(response, sessionCookie)
  return response
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return jsonError("Same-origin requests are required", 403, "INVALID_ORIGIN")
  }
  if (!verifyCsrfToken(request)) {
    return jsonError("CSRF validation failed", 403, "INVALID_CSRF")
  }

  const response = NextResponse.json(
    { authenticated: false },
    { headers: { "Cache-Control": "no-store" } }
  )
  clearSessionCookie(response)
  clearCsrfCookie(response)
  return response
}
