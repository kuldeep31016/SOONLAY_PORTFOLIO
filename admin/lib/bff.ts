import { NextRequest, NextResponse } from "next/server"
import { isSameOrigin, verifyCsrfToken } from "./csrf"
import { SESSION_COOKIE_NAME, requireSessionContext, UnauthorizedError, type SessionContext } from "./session"
import { EnvironmentConfigurationError } from "./env"
import { CareersNetworkError } from "./careers-api"

export class BffRequestError extends Error {
  status: number
  code: string

  constructor(status: number, message: string, code: string) {
    super(message)
    this.name = "BffRequestError"
    this.status = status
    this.code = code
  }
}

export async function requireBffSession(request: NextRequest, mutation: boolean): Promise<SessionContext> {
  if (mutation && !isSameOrigin(request)) {
    throw new BffRequestError(403, "Same-origin requests are required", "INVALID_ORIGIN")
  }
  if (mutation && !verifyCsrfToken(request)) {
    throw new BffRequestError(403, "CSRF validation failed", "INVALID_CSRF")
  }

  try {
    return await requireSessionContext(request.cookies.get(SESSION_COOKIE_NAME)?.value)
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new BffRequestError(401, "Authentication required", "UNAUTHENTICATED")
    }
    throw error
  }
}

export function bffErrorResponse(error: unknown) {
  const headers = { "Cache-Control": "no-store" }
  if (error instanceof BffRequestError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.status, headers })
  }
  if (error instanceof EnvironmentConfigurationError) {
    const isAuthConfiguration =
      error.message.includes("CAREERS_ADMIN_USERS") || error.message.includes("CAREERS_SESSION_SECRET")

    return NextResponse.json(
      {
        error: isAuthConfiguration
          ? "Admin authentication is not configured"
          : "The Careers API is not configured",
        code: isAuthConfiguration ? "ADMIN_NOT_CONFIGURED" : "API_NOT_CONFIGURED"
      },
      { status: 500, headers }
    )
  }
  if (error instanceof CareersNetworkError) {
    return NextResponse.json(
      { error: "The Careers API could not be reached", code: "API_UNAVAILABLE" },
      { status: 502, headers }
    )
  }
  return NextResponse.json({ error: "The admin request could not be completed", code: "ADMIN_ERROR" }, { status: 500, headers })
}
