import { NextResponse } from "next/server"
import { BriefUnavailableError, generateProjectBrief } from "@/lib/leads/brief"
import { clientKey, isRateLimited } from "@/lib/leads/rate-limit"
import { projectScopeSchema } from "@/lib/leads/schema"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (isRateLimited(`brief:${clientKey(request)}`, 6, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const parsed = projectScopeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete the earlier steps first." }, { status: 400 })
  }

  try {
    const brief = await generateProjectBrief(parsed.data)
    return NextResponse.json({ brief })
  } catch (error) {
    if (error instanceof BriefUnavailableError) {
      return NextResponse.json({ error: "AI brief is unavailable right now." }, { status: 503 })
    }
    console.error("[project-brief] unexpected error", error)
    return NextResponse.json({ error: "AI brief is unavailable right now." }, { status: 503 })
  }
}
