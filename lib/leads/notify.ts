import "server-only"

import nodemailer from "nodemailer"
import { leadConfirmation } from "@/lib/email/confirmation"
import { CONTACT_EMAIL } from "@/lib/site"
import { formatInr, type PreliminaryEstimate } from "./estimate"
import {
  budgets,
  contactMethods,
  featureOptions,
  industries,
  labelFor,
  orgTypes,
  platformOptions,
  productTypes,
  stages,
  timelines,
  userTypes
} from "./options"
import type { LeadPriority } from "./qualify"
import type { LeadInput } from "./schema"

const FALLBACK_RECIPIENTS = "syedayaan9376@gmail.com, iamkuldeepraj55@gmail.com"

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function recipients(): string {
  return process.env.LEAD_NOTIFY_EMAILS?.trim() || FALLBACK_RECIPIENTS
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS)
}

function transport() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  })
}

/** Sends the visitor an acknowledgement so they know the request arrived. */
export async function sendLeadConfirmation(lead: Omit<LeadInput, "fax">): Promise<void> {
  const email = leadConfirmation({
    name: lead.name,
    productType: labelFor(productTypes, lead.productType),
    timeline: labelFor(timelines, lead.timeline),
    budget: labelFor(budgets, lead.budget),
    contactMethod: labelFor(contactMethods, lead.preferredContact)
  })
  await transport().sendMail({
    from: `Soonlay <${process.env.EMAIL_USER}>`,
    to: lead.email,
    replyTo: CONTACT_EMAIL,
    ...email
  })
}

export async function sendLeadNotification(
  lead: Omit<LeadInput, "fax">,
  estimate: PreliminaryEstimate,
  priority: LeadPriority,
  leadId: string | null
): Promise<void> {
  const rows: [string, string][] = [
    ["Priority", `${priority.level} (score ${priority.score}) — ${priority.reasons.join("; ")}`],
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone / WhatsApp", lead.phone ?? "—"],
    ["Preferred contact", labelFor(contactMethods, lead.preferredContact)],
    ["Company", lead.company ?? "—"],
    ["Website", lead.website ?? "—"],
    ["Organization", labelFor(orgTypes, lead.orgType)],
    ["Industry", labelFor(industries, lead.industry)],
    ["Building", labelFor(productTypes, lead.productType)],
    ["Users", lead.users.map((user) => labelFor(userTypes, user)).join(", ")],
    ["Platforms", labelFor(platformOptions, lead.platforms)],
    ["Features", lead.features.map((feature) => labelFor(featureOptions, feature)).join(", ") || "—"],
    ["Stage", labelFor(stages, lead.stage)],
    ["Timeline", labelFor(timelines, lead.timeline)],
    ["Budget", labelFor(budgets, lead.budget)],
    [
      "Preliminary estimate (shown to visitor)",
      `${formatInr(estimate.low)} – ${formatInr(estimate.high)}, ${estimate.weeksLow}–${estimate.weeksHigh} weeks`
    ],
    ["Source page", lead.source ?? "—"],
    ["UTM", lead.utm ? Object.entries(lead.utm).map(([k, v]) => `${k}=${v}`).join(" ") : "—"],
    ["Lead ID (Firestore)", leadId ?? "not stored"]
  ]

  const briefText = lead.brief
    ? [
        `AI DRAFT BRIEF — ${lead.brief.projectName}`,
        lead.brief.summary,
        `User roles: ${lead.brief.userRoles.map((r) => `${r.role} (${r.needs})`).join("; ")}`,
        `Core modules: ${lead.brief.coreModules.map((m) => m.name).join(", ")}`,
        `Integrations: ${lead.brief.integrations.join(", ") || "—"}`,
        `MVP: ${lead.brief.mvpScope.join("; ")}`,
        `Later: ${lead.brief.laterScope.join("; ")}`,
        `Open questions: ${lead.brief.openQuestions.join("; ")}`
      ].join("\n")
    : "No AI brief generated."

  const text = [
    ...rows.map(([key, value]) => `${key}: ${value}`),
    "",
    "Idea:",
    lead.idea,
    "",
    briefText
  ].join("\n")

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:20px;border:1px solid #e5e5e5;border-radius:10px">
      <h2 style="margin:0 0 4px">New project lead — ${escapeHtml(priority.level)} priority</h2>
      <p style="margin:0 0 16px;color:#666">Reply to this email to answer ${escapeHtml(lead.name)} directly.</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .map(
            ([key, value]) =>
              `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;color:#666;white-space:nowrap;vertical-align:top">${escapeHtml(key)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee">${escapeHtml(value)}</td></tr>`
          )
          .join("")}
      </table>
      <h3 style="margin:20px 0 6px">Idea</h3>
      <p style="white-space:pre-wrap;background:#f7f7f7;padding:12px;border-radius:6px">${escapeHtml(lead.idea)}</p>
      <h3 style="margin:20px 0 6px">AI draft brief (unverified)</h3>
      <p style="white-space:pre-wrap;background:#f3fbf7;padding:12px;border-radius:6px">${escapeHtml(briefText)}</p>
    </div>`

  await transport().sendMail({
    from: process.env.EMAIL_USER,
    to: recipients(),
    replyTo: lead.email,
    subject: `[${priority.level}] New project lead: ${labelFor(productTypes, lead.productType)} — ${lead.name}`,
    text,
    html
  })
}
