import { z } from "zod"
import type { NextRequest } from "next/server"

export class HttpRequestError extends Error {
  status: number
  code: string
  fieldErrors: Record<string, string>

  constructor(status: number, message: string, code = "REQUEST_ERROR", fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = "HttpRequestError"
    this.status = status
    this.code = code
    this.fieldErrors = fieldErrors
  }
}

export async function readJsonBody(request: NextRequest) {
  try {
    return await request.json()
  } catch {
    throw new HttpRequestError(400, "Request body must be valid JSON", "INVALID_JSON")
  }
}

export function zodFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "form"
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message
    }
  }
  return fieldErrors
}

export function requestErrorResponse(error: unknown) {
  if (error instanceof HttpRequestError) {
    return Response.json(
      { error: error.message, code: error.code, fieldErrors: error.fieldErrors },
      { status: error.status }
    )
  }
  return null
}
