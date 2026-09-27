import "server-only"

import { FieldValue } from "firebase-admin/firestore"
import { getFirestore } from "@/lib/careers/firebase"
import type { PreliminaryEstimate } from "./estimate"
import type { LeadPriority } from "./qualify"
import type { LeadInput } from "./schema"

export const LEAD_STATUSES = [
  "NEW",
  "RESEARCHING",
  "QUALIFIED",
  "CONTACTED",
  "REPLIED",
  "MEETING",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST"
] as const

export async function saveLead(
  lead: Omit<LeadInput, "fax">,
  estimate: PreliminaryEstimate,
  priority: LeadPriority
): Promise<string> {
  const doc = await getFirestore()
    .collection("leads")
    .add({
      ...JSON.parse(JSON.stringify(lead)),
      estimate,
      priority,
      status: "NEW",
      notes: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    })
  return doc.id
}
