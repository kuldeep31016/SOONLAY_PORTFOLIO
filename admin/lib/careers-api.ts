import "server-only"

import { NextResponse } from "next/server"
import { EnvironmentConfigurationError, getCareersApiUrl } from "./env"
import type { SessionContext } from "./session"

export interface CareersCallOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  query?: Record<string, string>
}

export interface CareersCallResult {
  status: number
  rawBody: string
  contentType: string | null
  payload: unknown
}

export class CareersNetworkError extends Error {
  constructor() {
    super("The Careers API could not be reached")
    this.name = "CareersNetworkError"
  }
}

export class CareersResponseError extends Error {
  status: number
  payload: unknown

  constructor(status: number, payload: unknown) {
    super("The Careers API returned an error")
    this.name = "CareersResponseError"
    this.status = status
    this.payload = payload
  }
}

export function buildCareersUrl(path: string, query?: Record<string, string>) {
  const base = new URL(getCareersApiUrl())
  const basePath = base.pathname.replace(/\/+$/, "")
  const normalizedPath = path.replace(/^\/+/, "")
  base.pathname = `${basePath}/${normalizedPath}` || "/"
  base.search = ""

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value) {
      base.searchParams.set(key, value)
    }
  }

  return base
}

export async function callCareersApi(
  path: string,
  options: CareersCallOptions,
  session: SessionContext
): Promise<CareersCallResult> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${session.sessionCookie}`
  }
  const method = options.method ?? "GET"
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json"
  }

  let response: Response
  try {
    response = await fetch(buildCareersUrl(path, options.query), {
      method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store",
      redirect: "manual"
    })
  } catch {
    throw new CareersNetworkError()
  }

  const rawBody = await response.text()
  let payload: unknown = null
  if (rawBody) {
    try {
      payload = JSON.parse(rawBody)
    } catch {
      payload = rawBody
    }
  }

  return {
    status: response.status,
    rawBody,
    contentType: response.headers.get("content-type"),
    payload
  }
}

export async function forwardCareersApi(
  path: string,
  options: CareersCallOptions,
  session: SessionContext
) {
  const result = await callCareersApi(path, options, session)
  const headers = new Headers()
  if (result.contentType) {
    headers.set("Content-Type", result.contentType)
  } else if (result.rawBody) {
    headers.set("Content-Type", "application/json")
  }
  headers.set("Cache-Control", "no-store")
  headers.set("X-Content-Type-Options", "nosniff")
  return new NextResponse(result.rawBody || null, { status: result.status, headers })
}

export async function requestCareersJson<T>(
  path: string,
  options: CareersCallOptions,
  session: SessionContext
) {
  const result = await callCareersApi(path, options, session)
  if (result.status < 200 || result.status >= 300) {
    throw new CareersResponseError(result.status, result.payload)
  }
  return result.payload as T
}

export function isCareersConfigurationError(error: unknown) {
  return error instanceof EnvironmentConfigurationError
}
