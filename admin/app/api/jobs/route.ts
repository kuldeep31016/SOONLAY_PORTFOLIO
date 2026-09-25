import { NextRequest, NextResponse } from "next/server"
import { bffErrorResponse, requireBffSession } from "@/lib/bff"
import { forwardCareersApi } from "@/lib/careers-api"
import { readJsonBody, requestErrorResponse, zodFieldErrors } from "@/lib/http"
import { parseJobListQuery, toPublicJobQuery } from "@/lib/query"
import { jobInputSchema } from "@/lib/schemas"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await requireBffSession(request, false)
    const query = toPublicJobQuery(parseJobListQuery(request.nextUrl.searchParams))
    return await forwardCareersApi("/api/admin/jobs", { query }, session)
  } catch (error) {
    const requestResponse = requestErrorResponse(error)
    return requestResponse ?? bffErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireBffSession(request, true)
    const body = await readJsonBody(request)
    const parsed = jobInputSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Review the highlighted fields", code: "VALIDATION_ERROR", fieldErrors: zodFieldErrors(parsed.error) },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      )
    }
    return await forwardCareersApi("/api/admin/jobs", { method: "POST", body: parsed.data }, session)
  } catch (error) {
    const requestResponse = requestErrorResponse(error)
    return requestResponse ?? bffErrorResponse(error)
  }
}
