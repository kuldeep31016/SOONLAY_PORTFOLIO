import { describe, expect, it } from "vitest"
import { applicationConfirmation, firstName, leadConfirmation } from "@/lib/email/confirmation"

const lead = {
  name: "Asha Verma",
  productType: "Mobile app",
  timeline: "1–3 months",
  budget: "₹1–2 lakh",
  contactMethod: "WhatsApp"
}

describe("confirmation emails", () => {
  it("greets the visitor by first name and summarises their choices", () => {
    const email = leadConfirmation(lead)
    expect(email.subject).toContain("received your project request")
    expect(email.text).toContain("Hi Asha,")
    expect(email.text).toContain("Project type: Mobile app")
    expect(email.html).toContain("Hi Asha,")
    expect(email.html).toContain("₹1–2 lakh")
  })

  it("never echoes markup or links typed into the name field", () => {
    const email = leadConfirmation({ ...lead, name: "<a href='http://spam.example'>Win</a> big" })
    expect(email.html).not.toContain("spam.example")
    expect(email.html).not.toContain("<a href='http")
    expect(email.text).not.toContain("spam.example")
  })

  it("falls back to a neutral greeting", () => {
    expect(firstName("   ")).toBe("there")
    expect(firstName("José María")).toBe("José")
    expect(firstName("x".repeat(80))).toHaveLength(40)
  })

  it("acknowledges career applications", () => {
    const email = applicationConfirmation({ name: "Priya Shah", area: "Frontend Engineering" })
    expect(email.subject).toContain("received your application")
    expect(email.text).toContain("Frontend Engineering")
  })
})
