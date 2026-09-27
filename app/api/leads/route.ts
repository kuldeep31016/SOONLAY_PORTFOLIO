import { NextResponse } from "next/server"
import { preliminaryEstimate } from "@/lib/leads/estimate"
import { isEmailConfigured, sendLeadNotification } from "@/lib/leads/notify"
import { prioritizeLead } from "@/lib/leads/qualify"
import { clientKey, isRateLimited } from "@/lib/leads/rate-limit"
import { leadSchema } from "@/lib/leads/schema"
import { saveLead } from "@/lib/leads/store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (isRateLimited(`lead:${clientKey(request)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many submissions. Please email us directly." }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Some details are missing or invalid.", issues: parsed.error.issues.map((i) => i.path.join(".")) },
      { status: 400 }
    )
  }

  const { fax, ...lead } = parsed.data
  if (fax) {
    return NextResponse.json({ ok: true })
  }

  const estimate = preliminaryEstimate(lead)
  const priority = prioritizeLead(parsed.data)

  let leadId: string | null = null
  try {
    leadId = await saveLead(lead, estimate, priority)
  } catch (error) {
    console.error("[leads] failed to store lead", error)
  }

  let emailed = false
  if (isEmailConfigured()) {
    try {
      await sendLeadNotification(lead, estimate, priority, leadId)
      emailed = true
    } catch (error) {
      console.error("[leads] failed to send notification", error)
    }
  }

  if (!leadId && !emailed) {
    return NextResponse.json(
      { error: "We couldn't submit your request. Please email soonlay.tech@gmail.com." },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, estimate })
}
