"use client"

import { ensureCsrfToken } from "./csrf-client"

export class ClientRequestError extends Error {
  status: number
  code: string
  fieldErrors: Record<string, string>

  constructor(message: string, status: number, code = "REQUEST_ERROR", fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = "ClientRequestError"
    this.status = status
    this.code = code
    this.fieldErrors = fieldErrors
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function readFieldErrors(payload: unknown) {
  if (!isRecord(payload)) {
    return {}
  }
  const details = isRecord(payload.details) ? payload.details : undefined
  const candidate = payload.fieldErrors ?? details?.fieldErrors ?? payload.errors ?? payload.fields
  if (!isRecord(candidate)) {
    return {}
  }

  const fieldErrors: Record<string, string> = {}
  for (const [key, value] of Object.entries(candidate)) {
    if (typeof value === "string") {
      fieldErrors[key] = value
    } else if (Array.isArray(value) && typeof value[0] === "string") {
      fieldErrors[key] = value[0]
    }
  }
  return fieldErrors
}

export async function requestJson<T>(
  url: string,
  init: RequestInit = {},
  requireCsrf = false
): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set("Accept", "application/json")
  if (init.body !== undefined) {
    headers.set("Content-Type", "application/json")
  }
  if (requireCsrf) {
    headers.set("X-CSRF-Token", await ensureCsrfToken())
  }

  const response = await fetch(url, {
    ...init,
    headers,
    credentials: "same-origin",
    cache: "no-store"
  })
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const message = isRecord(payload) && typeof payload.error === "string"
      ? payload.error
      : "The request could not be completed"
    const code = isRecord(payload) && typeof payload.code === "string" ? payload.code : "REQUEST_ERROR"
    throw new ClientRequestError(message, response.status, code, readFieldErrors(payload))
  }

  return payload as T
}
