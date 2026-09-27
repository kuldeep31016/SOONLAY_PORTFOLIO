import { NextResponse } from "next/server"
import { FieldValue } from "firebase-admin/firestore"
import { getFirestore } from "@/lib/careers/firebase"
import { applicationSchema, readResume, sendApplicationEmail } from "@/lib/careers/application"
import { isEmailConfigured } from "@/lib/leads/notify"
import { clientKey, isRateLimited } from "@/lib/leads/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (isRateLimited(`apply:${clientKey(request)}`, 4, 30 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many applications. Please try again later." }, { status: 429 })
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const parsed = applicationSchema.safeParse({
    name: form.get("name") ?? "",
    email: form.get("email") ?? "",
    area: form.get("area") ?? "",
    link: form.get("link") ?? undefined,
    message: form.get("message") ?? undefined,
    jobSlug: form.get("jobSlug") ?? undefined,
    fax: form.get("fax") ?? undefined
  })
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check the form." }, { status: 400 })
  }

  const { fax, ...application } = parsed.data
  if (fax) return NextResponse.json({ ok: true })

  const file = form.get("resume")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Please attach your resume." }, { status: 400 })
  }
  const resume = await readResume(file)
  if (typeof resume === "string") {
    return NextResponse.json({ error: resume }, { status: 400 })
  }

  let recordId: string | null = null
  try {
    const doc = await getFirestore()
      .collection("applications")
      .add({
        ...JSON.parse(JSON.stringify(application)),
        resumeName: resume.filename,
        resumeBytes: resume.content.length,
        status: "NEW",
        createdAt: FieldValue.serverTimestamp()
      })
    recordId = doc.id
  } catch (error) {
    console.error("[careers/apply] failed to store application", error)
  }

  if (!isEmailConfigured()) {
    console.error("[careers/apply] email is not configured; resume cannot be delivered")
    return NextResponse.json(
      { error: "Applications are temporarily unavailable. Please email soonlay.tech@gmail.com." },
      { status: 503 }
    )
  }

  try {
    await sendApplicationEmail(application, resume, recordId)
  } catch (error) {
    console.error("[careers/apply] failed to send application email", error)
    return NextResponse.json(
      { error: "We couldn't send your application. Please email soonlay.tech@gmail.com." },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
