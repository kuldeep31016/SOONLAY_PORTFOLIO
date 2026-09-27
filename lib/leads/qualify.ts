import type { LeadInput } from "./schema"

export interface LeadPriority {
  level: "High" | "Medium" | "Low"
  score: number
  reasons: string[]
}

// Transparent triage signal for the team, never shown to the visitor.
export function prioritizeLead(lead: LeadInput): LeadPriority {
  let score = 0
  const reasons: string[] = []

  const budgetPoints: Record<LeadInput["budget"], number> = {
    "under-1l": 0,
    "1-3l": 2,
    "3-7l": 3,
    "7l-plus": 3,
    "not-sure": 1
  }
  score += budgetPoints[lead.budget]
  reasons.push(`Budget: ${lead.budget} (+${budgetPoints[lead.budget]})`)

  const timelinePoints: Record<LeadInput["timeline"], number> = {
    asap: 2,
    "1-3-months": 2,
    "3-6-months": 1,
    flexible: 0
  }
  score += timelinePoints[lead.timeline]
  reasons.push(`Timeline: ${lead.timeline} (+${timelinePoints[lead.timeline]})`)

  if (lead.orgType === "company" || lead.orgType === "small-business") {
    score += 1
    reasons.push("Operating business (+1)")
  }
  if (lead.idea.length >= 150) {
    score += 1
    reasons.push("Detailed description (+1)")
  }
  if (lead.phone) {
    score += 1
    reasons.push("Phone provided (+1)")
  }
  if (lead.website || lead.company) {
    score += 1
    reasons.push("Company or website provided (+1)")
  }

  const level = score >= 6 ? "High" : score >= 3 ? "Medium" : "Low"
  return { level, score, reasons }
}
