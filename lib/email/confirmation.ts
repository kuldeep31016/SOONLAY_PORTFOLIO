import { CONTACT_EMAIL, SITE_URL } from "@/lib/site"

export interface ConfirmationEmail {
  subject: string
  text: string
  html: string
}

interface ConfirmationContent {
  subject: string
  name: string
  intro: string
  summary: [string, string][]
  nextSteps: string[]
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// Only the first name is echoed back. The confirmation goes to an address the
// visitor typed, so it must never repeat free text they could use to send
// arbitrary content through our mailbox.
export function firstName(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? ""
  return first.replace(/[^\p{L}\p{M}'.-]/gu, "").slice(0, 40) || "there"
}

function buildConfirmation({ subject, name, intro, summary, nextSteps }: ConfirmationContent): ConfirmationEmail {
  const greetingName = firstName(name)
  const site = SITE_URL.replace(/^https?:\/\//, "")

  const text = [
    `Hi ${greetingName},`,
    "",
    intro,
    "",
    ...(summary.length ? ["Your request", ...summary.map(([k, v]) => `- ${k}: ${v}`), ""] : []),
    "What happens next",
    ...nextSteps.map((step, i) => `${i + 1}. ${step}`),
    "",
    `If you need anything in the meantime, simply reply to this email or write to ${CONTACT_EMAIL}.`,
    "",
    "Warm regards,",
    "Team Soonlay",
    site
  ].join("\n")

  const summaryHtml = summary.length
    ? `<tr><td style="padding:0 32px 8px">
        <p style="margin:0 0 10px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5c7a73">Your request</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">
          ${summary
            .map(
              ([k, v]) =>
                `<tr><td style="padding:9px 0;border-bottom:1px solid #e6eeeb;color:#5c7a73;width:42%">${escapeHtml(k)}</td><td style="padding:9px 0;border-bottom:1px solid #e6eeeb;color:#0b1a17;font-weight:600">${escapeHtml(v)}</td></tr>`
            )
            .join("")}
        </table>
      </td></tr>`
    : ""

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#eef3f1">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef3f1;padding:28px 12px;font-family:Arial,Helvetica,sans-serif">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
        <tr><td style="background:#07110f;padding:26px 32px">
          <span style="font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#eaf2ef">Soonlay</span>
          <span style="display:block;margin-top:4px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8edcc2">Product Development Studio</span>
        </td></tr>
        <tr><td style="padding:32px 32px 8px;color:#0b1a17">
          <p style="margin:0 0 14px;font-size:18px;font-weight:600">Hi ${escapeHtml(greetingName)},</p>
          <p style="margin:0 0 22px;font-size:15px;line-height:1.65;color:#2b3f3a">${escapeHtml(intro)}</p>
        </td></tr>
        ${summaryHtml}
        <tr><td style="padding:18px 32px 8px">
          <p style="margin:0 0 10px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5c7a73">What happens next</p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.55;color:#2b3f3a">
            ${nextSteps
              .map(
                (step, i) =>
                  `<tr><td style="vertical-align:top;padding:6px 12px 6px 0"><span style="display:inline-block;width:24px;height:24px;line-height:24px;border-radius:12px;background:#9fe6cd;color:#051210;text-align:center;font-size:12px;font-weight:700">${i + 1}</span></td><td style="padding:8px 0">${escapeHtml(step)}</td></tr>`
              )
              .join("")}
          </table>
        </td></tr>
        <tr><td style="padding:22px 32px 30px">
          <p style="margin:0 0 22px;font-size:14px;line-height:1.6;color:#2b3f3a">If you need anything in the meantime, simply reply to this email or write to <a href="mailto:${CONTACT_EMAIL}" style="color:#1f7a63">${CONTACT_EMAIL}</a>.</p>
          <a href="${SITE_URL}" style="display:inline-block;background:#9fe6cd;color:#051210;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:999px">Visit ${site}</a>
          <p style="margin:26px 0 0;font-size:14px;color:#2b3f3a">Warm regards,<br><strong>Team Soonlay</strong></p>
        </td></tr>
        <tr><td style="background:#f4f8f6;padding:16px 32px;font-size:12px;color:#7f948d">You're receiving this because you submitted a form on ${site}. No further emails will be sent unless you reply.</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

  return { subject, text, html }
}

export function leadConfirmation(input: {
  name: string
  productType: string
  timeline: string
  budget: string
  contactMethod: string
}): ConfirmationEmail {
  return buildConfirmation({
    subject: "We've received your project request — Soonlay",
    name: input.name,
    intro:
      "Thank you for reaching out to Soonlay. We've received your project details, and a member of our team will review them personally.",
    summary: [
      ["Project type", input.productType],
      ["Timeline", input.timeline],
      ["Budget", input.budget],
      ["Preferred contact", input.contactMethod]
    ],
    nextSteps: [
      "We review your brief and reply within one business day.",
      `We get in touch (${input.contactMethod}) to set up a short discovery call.`,
      "You receive a clear written scope, timeline and price to approve before any work begins."
    ]
  })
}

export function applicationConfirmation(input: { name: string; area: string }): ConfirmationEmail {
  return buildConfirmation({
    subject: "We've received your application — Soonlay",
    name: input.name,
    intro: `Thank you for your interest in working with Soonlay. We've received your application for ${input.area}, and our team reviews every application personally.`,
    summary: [],
    nextSteps: [
      "We review your profile, resume and work samples.",
      "If there's a fit with a current or upcoming role, we'll contact you to arrange a conversation.",
      "We keep your details on file and reach out when a matching opportunity opens."
    ]
  })
}
