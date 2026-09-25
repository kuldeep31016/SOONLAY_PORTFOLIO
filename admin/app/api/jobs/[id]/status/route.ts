import { NextRequest, NextResponse } from "next/server"
import { bffErrorResponse, requireBffSession } from "@/lib/bff"
import { forwardCareersApi } from "@/lib/careers-api"
import { readJsonBody, requestErrorResponse, zodFieldErrors } from "@/lib/http"
import { jobIdSchema, jobStatusSchema } from "@/lib/schemas"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type RouteContext = { params: Promise<{ id: string }> }

function invalidIdResponse() {
  return NextResponse.json(
    { error: "A valid job id is required", code: "INVALID_JOB_ID" },
    { status: 400, headers: { "Cache-Control": "no-store" } }
  )
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params
  const parsedId = jobIdSchema.safeParse(id)
  if (!parsedId.success) return invalidIdResponse()

  try {
    const session = await requireBffSession(request, true)
    const body = await readJsonBody(request)
    const parsed = jobStatusSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Choose a valid job status", code: "VALIDATION_ERROR", fieldErrors: zodFieldErrors(parsed.error) },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      )
    }
    return await forwardCareersApi(
      `/api/admin/jobs/${encodeURIComponent(parsedId.data)}/status`,
      { method: "PATCH", body: parsed.data },
      session
    )
  } catch (error) {
    const requestResponse = requestErrorResponse(error)
    return requestResponse ?? bffErrorResponse(error)
  }
}
