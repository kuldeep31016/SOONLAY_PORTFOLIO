import { NextRequest, NextResponse } from "next/server"
import { bffErrorResponse, requireBffSession } from "@/lib/bff"
import { forwardCareersApi } from "@/lib/careers-api"
import { readJsonBody, requestErrorResponse, zodFieldErrors } from "@/lib/http"
import { jobIdSchema, jobUpdateSchema } from "@/lib/schemas"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type RouteContext = { params: Promise<{ id: string }> }

async function getJobId(context: RouteContext) {
  const { id } = await context.params
  const parsed = jobIdSchema.safeParse(id)
  if (!parsed.success) {
    return null
  }
  return parsed.data
}

function validationResponse() {
  return NextResponse.json(
    { error: "A valid job id is required", code: "INVALID_JOB_ID" },
    { status: 400, headers: { "Cache-Control": "no-store" } }
  )
}

export async function GET(request: NextRequest, context: RouteContext) {
  const id = await getJobId(context)
  if (!id) return validationResponse()
  try {
    const session = await requireBffSession(request, false)
    return await forwardCareersApi(`/api/admin/jobs/${encodeURIComponent(id)}`, {}, session)
  } catch (error) {
    const requestResponse = requestErrorResponse(error)
    return requestResponse ?? bffErrorResponse(error)
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const id = await getJobId(context)
  if (!id) return validationResponse()
  try {
    const session = await requireBffSession(request, true)
    const body = await readJsonBody(request)
    const parsed = jobUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Review the highlighted fields", code: "VALIDATION_ERROR", fieldErrors: zodFieldErrors(parsed.error) },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      )
    }
    return await forwardCareersApi(`/api/admin/jobs/${encodeURIComponent(id)}`, { method: "PUT", body: parsed.data }, session)
  } catch (error) {
    const requestResponse = requestErrorResponse(error)
    return requestResponse ?? bffErrorResponse(error)
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const id = await getJobId(context)
  if (!id) return validationResponse()
  try {
    const session = await requireBffSession(request, true)
    return await forwardCareersApi(`/api/admin/jobs/${encodeURIComponent(id)}/restore`, { method: "POST" }, session)
  } catch (error) {
    const requestResponse = requestErrorResponse(error)
    return requestResponse ?? bffErrorResponse(error)
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const id = await getJobId(context)
  if (!id) return validationResponse()
  try {
    const session = await requireBffSession(request, true)
    return await forwardCareersApi(`/api/admin/jobs/${encodeURIComponent(id)}`, { method: "DELETE" }, session)
  } catch (error) {
    const requestResponse = requestErrorResponse(error)
    return requestResponse ?? bffErrorResponse(error)
  }
}
