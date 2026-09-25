import { NextResponse } from "next/server"

import { ApiError, ValidationError } from "./errors"

export const NO_STORE_CACHE_CONTROL = "private, no-store, max-age=0"
export const PUBLIC_CACHE_CONTROL = "no-store"
export const INTERNAL_ERROR_MESSAGE = "Something went wrong. Please try again."

const URL_PATTERN = /https?:\/\/\S+/gi
const LOG_MESSAGE_LIMIT = 300

export interface ErrorPayload {
  error: string
  details?: Record<string, unknown>
}

function headersFor(cacheControl: string | undefined): Record<string, string> | undefined {
  return cacheControl === undefined ? undefined : { "Cache-Control": cacheControl }
}

export function publicResponse(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: headersFor(PUBLIC_CACHE_CONTROL) })
}

export function publicErrorResponse(error: unknown): NextResponse {
  return toErrorResponse(error, PUBLIC_CACHE_CONTROL)
}

export function adminResponse(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: headersFor(NO_STORE_CACHE_CONTROL) })
}

export function adminErrorResponse(error: unknown): NextResponse {
  return toErrorResponse(error, NO_STORE_CACHE_CONTROL)
}

export function toErrorResponse(error: unknown, cacheControl: string | undefined): NextResponse {
  if (error instanceof ApiError) {
    const payload: ErrorPayload = { error: error.message }
    if (error.details !== undefined) {
      payload.details = error.details
    }
    return NextResponse.json(payload, { status: error.status, headers: headersFor(cacheControl) })
  }

  console.error("[careers]", describeErrorForLog(error))

  const payload: ErrorPayload = { error: INTERNAL_ERROR_MESSAGE }
  return NextResponse.json(payload, { status: 500, headers: headersFor(cacheControl) })
}

export function describeErrorForLog(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${redact(error.message)}`
  }
  return `UnknownError: ${redact(String(error))}`
}

export async function readJsonBody(request: Request): Promise<unknown> {
  let text: string
  try {
    text = await request.text()
  } catch {
    throw new ValidationError("Request body could not be read", {
      fieldErrors: { request: ["Request body could not be read"] }
    })
  }

  if (text.trim().length === 0) {
    throw new ValidationError("Request body is required", {
      fieldErrors: { request: ["Request body is required"] }
    })
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new ValidationError("Request body must be valid JSON", {
      fieldErrors: { request: ["Request body must be valid JSON"] }
    })
  }
}

function redact(message: string): string {
  return message.replace(URL_PATTERN, "[redacted-url]").slice(0, LOG_MESSAGE_LIMIT)
}
