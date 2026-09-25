import "server-only"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { EnvironmentConfigurationError, getSessionSecret } from "./env"
import { createSessionToken, verifySessionToken } from "./session-token"

export const SESSION_COOKIE_NAME = "careers_session"
export const CSRF_COOKIE_NAME = "careers_csrf"
export const SESSION_MAX_AGE_SECONDS = 5 * 24 * 60 * 60

export class UnauthorizedError extends Error {
  constructor(message = "Authentication required") {
    super(message)
    this.name = "UnauthorizedError"
  }
}

export interface SessionContext {
  /** Random per-session identifier. Carries no personal data. */
  sessionId: string
  email: string
  sessionCookie: string
}

export function createAdminSessionToken(email: string): string {
  return createSessionToken({ email }, getSessionSecret(), SESSION_MAX_AGE_SECONDS)
}

export function getSessionContext(rawCookie?: string): SessionContext | null {
  const cookieValue = rawCookie
  if (!cookieValue) {
    return null
  }

  const claims = verifySessionToken(cookieValue, getSessionSecret())
  if (claims === null) {
    return null
  }

  return {
    sessionId: claims.sub,
    email: claims.email,
    sessionCookie: cookieValue
  }
}

export async function readSessionCookie(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value
}

export async function getCurrentSession(): Promise<SessionContext | null> {
  return getSessionContext(await readSessionCookie())
}

export function requireSessionContext(rawCookie: string | undefined) {
  const context = getSessionContext(rawCookie)
  if (!context) {
    throw new UnauthorizedError()
  }
  return context
}

export async function requirePortalSession() {
  const context = await getCurrentSession()
  if (!context) {
    redirect("/login")
  }
  return context
}

export { EnvironmentConfigurationError }
