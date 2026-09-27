import { beforeEach, describe, expect, it, vi } from "vitest"

const { saveLead, sendLeadNotification, isEmailConfigured } = vi.hoisted(() => ({
  saveLead: vi.fn(),
  sendLeadNotification: vi.fn(),
  isEmailConfigured: vi.fn()
}))

vi.mock("@/lib/leads/store", () => ({ saveLead }))
vi.mock("@/lib/leads/notify", () => ({ sendLeadNotification, isEmailConfigured }))

import { POST } from "@/app/api/leads/route"
import { formatInr, preliminaryEstimate } from "@/lib/leads/estimate"
import { prioritizeLead } from "@/lib/leads/qualify"
import { leadSchema, type LeadInput } from "@/lib/leads/schema"

const validLead = {
  productType: "mobile-app",
  idea: "Customers order food from our three restaurants, pay online and track delivery.",
  users: ["customers", "staff"],
  platforms: "both",
  features: ["auth", "payments"],
  orgType: "small-business",
  industry: "restaurant",
  stage: "idea",
  timeline: "1-3-months",
  budget: "3-7l",
  name: "Asha Rao",
  email: "asha@example.com",
  company: "",
  website: "",
  phone: "",
  preferredContact: "email",
  fax: ""
}

let ipCounter = 0
function request(body: unknown) {
  ipCounter += 1
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": `10.0.0.${ipCounter}` },
    body: JSON.stringify(body)
  })
}

describe("preliminaryEstimate", () => {
  it("grows with roles, platforms and features", () => {
    const small = preliminaryEstimate({ productType: "web-app", users: ["staff"], platforms: "web", features: [] })
    const large = preliminaryEstimate({
      productType: "web-app",
      users: ["customers", "staff", "admins"],
      platforms: "both",
      features: ["payments", "realtime"]
    })
    expect(large.low).toBeGreaterThan(small.high)
    expect(small.low).toBeLessThan(small.high)
    expect(small.weeksLow).toBeLessThan(small.weeksHigh)
  })

  it("ignores duplicate features", () => {
    const once = preliminaryEstimate({ productType: "saas", users: ["customers"], platforms: "web", features: ["ai"] })
    const twice = preliminaryEstimate({ productType: "saas", users: ["customers"], platforms: "web", features: ["ai", "ai"] })
    expect(twice).toEqual(once)
  })

  it("formats lakhs and thousands", () => {
    expect(formatInr(250_000)).toBe("₹2.5 lakh")
    expect(formatInr(300_000)).toBe("₹3 lakh")
    expect(formatInr(40_000)).toBe("₹40k")
  })
})

describe("prioritizeLead", () => {
  it("ranks a funded, near-term, detailed lead as high", () => {
    const lead = leadSchema.parse({ ...validLead, phone: "+91 98765 43210", company: "Asha Foods" }) as LeadInput
    expect(prioritizeLead(lead).level).toBe("High")
  })

  it("ranks a vague, low-budget, open-ended lead as low", () => {
    const lead = leadSchema.parse({ ...validLead, budget: "under-1l", timeline: "flexible", orgType: "other" }) as LeadInput
    expect(prioritizeLead(lead).level).toBe("Low")
  })
})

describe("POST /api/leads", () => {
  beforeEach(() => {
    saveLead.mockReset().mockResolvedValue("lead-123")
    sendLeadNotification.mockReset().mockResolvedValue(undefined)
    isEmailConfigured.mockReset().mockReturnValue(true)
  })

  it("stores and emails a valid lead", async () => {
    const response = await POST(request(validLead))
    expect(response.status).toBe(200)
    expect(saveLead).toHaveBeenCalledOnce()
    expect(sendLeadNotification).toHaveBeenCalledOnce()
    const stored = saveLead.mock.calls[0][0]
    expect(stored).not.toHaveProperty("fax")
    expect(stored.company).toBeUndefined()
  })

  it("rejects invalid input", async () => {
    const response = await POST(request({ ...validLead, email: "not-an-email" }))
    expect(response.status).toBe(400)
    expect(saveLead).not.toHaveBeenCalled()
  })

  it("silently drops honeypot submissions", async () => {
    const response = await POST(request({ ...validLead, fax: "spam" }))
    expect(response.status).toBe(200)
    expect(saveLead).not.toHaveBeenCalled()
    expect(sendLeadNotification).not.toHaveBeenCalled()
  })

  it("still succeeds when only email delivery works", async () => {
    saveLead.mockRejectedValue(new Error("firestore down"))
    const response = await POST(request(validLead))
    expect(response.status).toBe(200)
    expect(sendLeadNotification).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything(), null)
  })

  it("fails loudly when the lead cannot be stored or emailed", async () => {
    saveLead.mockRejectedValue(new Error("firestore down"))
    isEmailConfigured.mockReturnValue(false)
    const response = await POST(request(validLead))
    expect(response.status).toBe(500)
  })

  it("rate limits repeated submissions from one address", async () => {
    const make = () =>
      new Request("http://localhost/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "192.168.1.1" },
        body: JSON.stringify(validLead)
      })
    const statuses = []
    for (let i = 0; i < 6; i++) statuses.push((await POST(make())).status)
    expect(statuses.slice(0, 5).every((status) => status === 200)).toBe(true)
    expect(statuses[5]).toBe(429)
  })
})
