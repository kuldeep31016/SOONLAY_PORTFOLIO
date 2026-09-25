import "server-only"

const DEFAULT_CAREERS_API_URL = "https://soonlay.tech"
const MINIMUM_SESSION_SECRET_LENGTH = 32
const ADMIN_USER_SEPARATOR = /[\s,]+/
const MAX_PASSWORD_LENGTH = 1024

export interface AdminUser {
  email: string
  passwordHash: string
}

export class EnvironmentConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "EnvironmentConfigurationError"
  }
}

function isLocalHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1"
}

export function getCareersApiUrl() {
  const configured = process.env.CAREERS_API_URL?.trim() || DEFAULT_CAREERS_API_URL

  try {
    const url = new URL(configured)
    if (url.protocol !== "https:" && !(url.protocol === "http:" && isLocalHostname(url.hostname))) {
      throw new Error("unsupported protocol")
    }
    return url.toString().replace(/\/+$/, "")
  } catch {
    throw new EnvironmentConfigurationError("CAREERS_API_URL must be a valid HTTPS URL")
  }
}

export function getCareersApiHost() {
  return new URL(getCareersApiUrl()).host
}

/**
 * Shared with the public site. The portal signs session tokens with it and the
 * public API verifies them, so both apps must hold the identical value. Rotating
 * it invalidates every outstanding session.
 */
export function getSessionSecret(): string {
  const secret = process.env.CAREERS_SESSION_SECRET?.trim()
  if (!secret || secret.length < MINIMUM_SESSION_SECRET_LENGTH) {
    throw new EnvironmentConfigurationError("CAREERS_SESSION_SECRET must be at least 32 characters")
  }
  return secret
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

/**
 * Credentials live in the environment as `email:scrypt$...` pairs rather than a
 * user database, so there is nothing to migrate and access changes on redeploy.
 */
export function getAdminUsers(): AdminUser[] {
  const configured = process.env.CAREERS_ADMIN_USERS?.trim()
  if (!configured) {
    throw new EnvironmentConfigurationError("CAREERS_ADMIN_USERS is not configured")
  }

  const users: AdminUser[] = []
  for (const entry of configured.split(ADMIN_USER_SEPARATOR).filter(Boolean)) {
    // Hashes use base64url and "$" separators, so the first colon is the split point.
    const separator = entry.indexOf(":")
    if (separator <= 0) {
      continue
    }
    const email = normalizeEmail(entry.slice(0, separator))
    // A scrypt hash contains "$", which Next.js expands as a variable reference
    // when it reads a .env file. Writing "\$" survives that expansion, while a
    // dashboard-style value arrives unescaped, so accept either form here.
    const passwordHash = entry.slice(separator + 1).replace(/\\\$/g, "$")
    if (email.includes("@") && passwordHash.startsWith("scrypt$")) {
      users.push({ email, passwordHash })
    }
  }

  if (users.length === 0) {
    throw new EnvironmentConfigurationError("CAREERS_ADMIN_USERS has no valid entries")
  }

  return users
}

export function findAdminUser(email: string): AdminUser | null {
  const normalized = normalizeEmail(email)
  try {
    return getAdminUsers().find((user) => user.email === normalized) ?? null
  } catch {
    return null
  }
}

export function isPasswordLengthValid(password: string) {
  return password.length > 0 && password.length <= MAX_PASSWORD_LENGTH
}
