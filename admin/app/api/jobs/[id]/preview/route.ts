import { NextRequest, NextResponse } from "next/server"
import { bffErrorResponse, requireBffSession } from "@/lib/bff"
import { callCareersApi } from "@/lib/careers-api"
import { getCareersApiUrl } from "@/lib/env"
import { jobIdSchema } from "@/lib/schemas"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type RouteContext = { params: Promise<{ id: string }> }

function rawResponse(result: { rawBody: string; contentType: string | null; status: number }) {
  const headers = new Headers({ "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" })
  if (result.contentType) headers.set("Content-Type", result.contentType)
  return new NextResponse(result.rawBody || null, { status: result.status, headers })
}

function resolvePreviewUrl(value: string) {
  try {
    const url = new URL(value, `${getCareersApiUrl()}/`)
    if (url.protocol === "https:") return url
    if (process.env.NODE_ENV !== "production" && url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1")) {
      return url
    }
  } catch {
    return null
  }
  return null
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params
  const parsedId = jobIdSchema.safeParse(id)
  if (!parsedId.success) {
    return NextResponse.json({ error: "A valid job id is required", code: "INVALID_JOB_ID" }, { status: 400 })
  }

  try {
    const session = await requireBffSession(request, false)
    const result = await callCareersApi(`/api/admin/jobs/${encodeURIComponent(parsedId.data)}/preview`, {}, session)
    if (result.status < 200 || result.status >= 300) {
      return rawResponse(result)
    }

    const payload = result.payload
    const previewUrl = typeof payload === "object" && payload !== null && "url" in payload && typeof payload.url === "string"
      ? payload.url
      : ""
    const resolved = previewUrl ? resolvePreviewUrl(previewUrl) : null
    if (!resolved) {
      return NextResponse.json({ error: "The preview URL is invalid", code: "INVALID_PREVIEW_URL" }, { status: 502 })
    }

    const redirect = NextResponse.redirect(resolved, 302)
    redirect.headers.set("Cache-Control", "no-store")
    redirect.headers.set("X-Robots-Tag", "noindex, nofollow")
    redirect.headers.set("Content-Security-Policy", "frame-ancestors 'self'")
    redirect.headers.set("X-Frame-Options", "SAMEORIGIN")
    return redirect
  } catch (error) {
    return bffErrorResponse(error)
  }
}
