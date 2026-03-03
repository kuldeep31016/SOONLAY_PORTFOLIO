import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const RECIPIENTS = [
  "syedayaan9376@gmail.com",
  "iamkuldeepraj55@gmail.com",
  "soonlay.tech@gmail.com"
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const projectTitle: string = body.projectTitle?.toString().trim()
    const techStack: string = body.techStack?.toString().trim() ?? ""
    const description: string = body.description?.toString().trim() ?? ""

    if (!projectTitle) {
      return NextResponse.json(
        { error: "Project title is required." },
        { status: 400 }
      )
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY environment variable")
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 }
      )
    }

    await resend.emails.send({
      from: "Soonlay <no-reply@soonlay.tech>",
      to: RECIPIENTS,
      subject: `New project inquiry: ${projectTitle}`,
      text: [
        `Project Title: ${projectTitle}`,
        techStack && `Preferred Tech Stack: ${techStack}`,
        description && `Description: ${description}`
      ]
        .filter(Boolean)
        .join("\n\n")
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error sending contact email", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}

