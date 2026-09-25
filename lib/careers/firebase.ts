import "server-only"

import { cert, getApps, initializeApp, type App } from "firebase-admin/app"
import { getFirestore as createFirestore, type Firestore } from "firebase-admin/firestore"

import { getFirebaseCredentials, getFirestoreDatabaseId, getProjectIdOverride } from "./env"
import { ConfigurationError } from "./errors"

const DEFAULT_APP_NAME = "[DEFAULT]"

interface FirebaseServices {
  app: App
  firestore: Firestore
}

let cached: FirebaseServices | null = null

function createApp(): App {
  const existing = getApps().find((candidate) => candidate.name === DEFAULT_APP_NAME)
  if (existing !== undefined) {
    return existing
  }

  const credentials = getFirebaseCredentials()

  try {
    if (credentials === null) {
      return initializeApp()
    }
    return initializeApp({
      credential: cert({
        projectId: credentials.projectId,
        clientEmail: credentials.clientEmail,
        privateKey: credentials.privateKey
      }),
      projectId: getProjectIdOverride() ?? credentials.projectId
    })
  } catch {
    throw new ConfigurationError("Careers datastore is not configured")
  }
}

function buildServices(): FirebaseServices {
  const app = createApp()
  return {
    app,
    // The database id is the second positional argument. Passing it inside a
    // settings object silently falls back to "(default)", which is not the
    // database this project uses.
    firestore: createFirestore(app, getFirestoreDatabaseId())
  }
}

function resolveServices(): FirebaseServices {
  if (cached === null) {
    cached = buildServices()
  }
  return cached
}

export function getFirebaseApp(): App {
  return resolveServices().app
}

export function getFirestore(): Firestore {
  return resolveServices().firestore
}
