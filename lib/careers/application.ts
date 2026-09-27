import "server-only"

import nodemailer from "nodemailer"
import { z } from "zod"
import { APPLICATION_AREAS, MAX_RESUME_MB } from "./areas"

export const MAX_RESUME_BYTES = MAX_RESUME_MB * 1024 * 1024

const optionalUrl = z
  .string()
  .trim()
  .max(300)
  .optional()
  .transform((value) => (value ? value : undefined))
  .refine((value) => !value || /^https?:\/\/\S+\.\S+/i.test(value), "Enter a full link starting with https://")

export const applicationSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.email("Please enter a valid email address.").max(200),
  area: z.enum(APPLICATION_AREAS, "Choose a role or area."),
  link: optionalUrl,
  message: z
    .string()
    .trim()
    .max(3000)
    .optional()
    .transform((value) => (value ? value : undefined)),
  jobSlug: z
    .string()
    .trim()
    .max(160)
    .optional()
    .transform((value) => (value ? value : undefined)),
  fax: z.string().max(200).optional()
})

export type ApplicationInput = z.infer<typeof applicationSchema>

const RESUME_TYPES: { ext: string; mime: string; magic: number[] }[] = [
  { ext: "pdf", mime: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46] },
  {
    ext: "docx",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    magic: [0x50, 0x4b, 0x03, 0x04]
  },
  { ext: "doc", mime: "application/msword", magic: [0xd0, 0xcf, 0x11, 0xe0] }
]

export interface ResumeFile {
  filename: string
  contentType: string
  content: Buffer
}

export async function readResume(file: File): Promise<ResumeFile | string> {
  if (file.size === 0) return "Please attach your resume."
  if (file.size > MAX_RESUME_BYTES) return "Resume must be 5 MB or smaller."
  const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
  const type = RESUME_TYPES.find((candidate) => candidate.ext === ext)
  if (!type) return "Resume must be a PDF or Word document."
  const content = Buffer.from(await file.arrayBuffer())
  if (!type.magic.every((byte, index) => content[index] === byte)) {
    return "That file doesn't look like a valid PDF or Word document."
  }
  const safeName = file.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120)
  return { filename: safeName, contentType: type.mime, content }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function sendApplicationEmail(
  application: Omit<ApplicationInput, "fax">,
  resume: ResumeFile,
  recordId: string | null
): Promise<void> {
  const to =
    process.env.CAREERS_NOTIFY_EMAILS?.trim() ||
    process.env.LEAD_NOTIFY_EMAILS?.trim() ||
    "syedayaan9376@gmail.com, iamkuldeepraj55@gmail.com"

  const rows: [string, string][] = [
    ["Name", application.name],
    ["Email", application.email],
    ["Role / area", application.area],
    ["Applying for", application.jobSlug ?? "General application"],
    ["Portfolio / GitHub / LinkedIn", application.link ?? "—"],
    ["Record ID", recordId ?? "not stored"]
  ]

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  })

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    replyTo: application.email,
    subject: `[Careers] ${application.area} — ${application.name}`,
    text: [...rows.map(([k, v]) => `${k}: ${v}`), "", "Message:", application.message ?? "—"].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:20px;border:1px solid #e5e5e5;border-radius:10px">
        <h2 style="margin:0 0 12px">New career application</h2>
        <table style="border-collapse:collapse;width:100%;font-size:14px">
          ${rows
            .map(
              ([k, v]) =>
                `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;color:#666;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee">${escapeHtml(v)}</td></tr>`
            )
            .join("")}
        </table>
        <h3 style="margin:18px 0 6px">Message</h3>
        <p style="white-space:pre-wrap;background:#f7f7f7;padding:12px;border-radius:6px">${escapeHtml(application.message ?? "—")}</p>
        <p style="color:#666;font-size:12px">Resume attached: ${escapeHtml(resume.filename)}</p>
      </div>`,
    attachments: [{ filename: resume.filename, content: resume.content, contentType: resume.contentType }]
  })
}
