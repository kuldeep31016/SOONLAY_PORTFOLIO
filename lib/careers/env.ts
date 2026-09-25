import "server-only"

import { ConfigurationError } from "./errors"

const EMAIL_LIST_SPLIT = /[\s,;]+/
const EMAIL_PATTERN = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/
const MINIMUM_PREVIEW_SECRET_LENGTH = 32
const MINIMUM_SESSION_SECRET_LENGTH = 32

export interface FirebaseServiceCredentials {
  projectId: string
  clientEmail: string
  privateKey: string
}

function readEnv(name: string): string | null {
  const value = process.env[name]
  if (typeof value !== "string") {
    return null
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isNormalizedEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email)
}

export function getAdminEmails(): string[] {
  const configured = readEnv("CAREERS_ADMIN_EMAILS")
  if (configured === null) {
    return []
  }
  const emails = configured
    .split(EMAIL_LIST_SPLIT)
    .map(normalizeEmail)
    .filter((email) => email.length > 0 && isNormalizedEmail(email))
  return Array.from(new Set(emails))
}

/**
 * Shared with the admin portal. Both apps must hold the identical value, since
 * the portal signs session tokens with it and this app verifies them. Rotating
 * it invalidates every existing session.
 */
export function getSessionSecret(): string {
  const secret = readEnv("CAREERS_SESSION_SECRET")
  if (secret === null || secret.length < MINIMUM_SESSION_SECRET_LENGTH) {
    throw new ConfigurationError("Careers administration is not configured")
  }
  return secret
}

export function getPreviewSecret(): string {
  const secret = readEnv("CAREERS_PREVIEW_SECRET")
  if (secret === null) {
    throw new ConfigurationError("Career preview links are not configured")
  }
  if (secret.length < MINIMUM_PREVIEW_SECRET_LENGTH) {
    throw new ConfigurationError("Career preview links are not configured")
  }
  return secret
}

export function getFirebaseCredentials(): FirebaseServiceCredentials | null {
  const projectId = readEnv("FIREBASE_PROJECT_ID")
  const clientEmail = readEnv("FIREBASE_CLIENT_EMAIL")
  const privateKey = readEnv("FIREBASE_PRIVATE_KEY")

  const provided = [projectId, clientEmail, privateKey].filter((value) => value !== null).length
  if (provided === 0) {
    return null
  }
  if (provided < 3) {
    throw new ConfigurationError("Careers datastore credentials are incomplete")
  }

  return {
    projectId: projectId as string,
    clientEmail: clientEmail as string,
    privateKey: (privateKey as string).replace(/\\n/g, "\n")
  }
}

export function getProjectIdOverride(): string | null {
  return readEnv("FIREBASE_PROJECT_ID")
}

/**
 * Firestore database to talk to. The project's default database is named
 * "default" and lives in asia-south1; firebase-admin's implicit target is the
 * special "(default)" database, which does not exist here, so the id has to be
 * passed explicitly. Omit to use "(default)".
 */
export function getFirestoreDatabaseId(): string {
  const databaseId = readEnv("CAREERS_FIRESTORE_DATABASE_ID") ?? "default"
  if (!/^[A-Za-z0-9_-]{1,63}$/.test(databaseId)) {
    throw new ConfigurationError("CAREERS_FIRESTORE_DATABASE_ID is not a valid database id")
  }
  return databaseId
}
