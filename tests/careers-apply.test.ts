import { beforeEach, describe, expect, it, vi } from "vitest"

const { add, sendApplicationEmail, sendApplicationConfirmation, isEmailConfigured } = vi.hoisted(() => ({
  add: vi.fn(),
  sendApplicationEmail: vi.fn(),
  sendApplicationConfirmation: vi.fn(),
  isEmailConfigured: vi.fn()
}))

vi.mock("@/lib/careers/firebase", () => ({
  getFirestore: () => ({ collection: () => ({ add }) })
}))
vi.mock("@/lib/leads/notify", () => ({ isEmailConfigured }))
vi.mock("@/lib/careers/application", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/careers/application")>()
  return { ...actual, sendApplicationEmail, sendApplicationConfirmation }
})

import { POST } from "@/app/api/careers/apply/route"

const PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37])

let ip = 0
function request(fields: Record<string, string>, file?: File) {
  const form = new FormData()
  for (const [key, value] of Object.entries(fields)) form.set(key, value)
  if (file) form.set("resume", file)
  ip += 1
  return new Request("http://localhost/api/careers/apply", {
    method: "POST",
    headers: { "x-forwarded-for": `10.1.0.${ip}` },
    body: form
  })
}

const valid = { name: "Priya Shah", email: "priya@example.com", area: "Frontend Engineering" }

describe("POST /api/careers/apply", () => {
  beforeEach(() => {
    add.mockReset().mockResolvedValue({ id: "app-1" })
    sendApplicationEmail.mockReset().mockResolvedValue(undefined)
    sendApplicationConfirmation.mockReset().mockResolvedValue(undefined)
    isEmailConfigured.mockReset().mockReturnValue(true)
  })

  it("accepts a valid application with a PDF resume", async () => {
    const response = await POST(request(valid, new File([PDF], "resume.pdf", { type: "application/pdf" })))
    expect(response.status).toBe(200)
    expect(sendApplicationEmail).toHaveBeenCalledOnce()
    const [, resume, recordId] = sendApplicationEmail.mock.calls[0]
    expect(resume.filename).toBe("resume.pdf")
    expect(recordId).toBe("app-1")
    expect(sendApplicationConfirmation).toHaveBeenCalledOnce()
    expect(sendApplicationConfirmation.mock.calls[0][0].email).toBe(valid.email)
  })

  it("still succeeds when the confirmation email fails", async () => {
    sendApplicationConfirmation.mockRejectedValue(new Error("smtp down"))
    const response = await POST(request(valid, new File([PDF], "resume.pdf", { type: "application/pdf" })))
    expect(response.status).toBe(200)
  })

  it("rejects a file that only pretends to be a PDF", async () => {
    const fake = new File([new TextEncoder().encode("<script>")], "resume.pdf", { type: "application/pdf" })
    const response = await POST(request(valid, fake))
    expect(response.status).toBe(400)
    expect(sendApplicationEmail).not.toHaveBeenCalled()
  })

  it("rejects unsupported file types", async () => {
    const response = await POST(request(valid, new File([PDF], "resume.exe")))
    expect(response.status).toBe(400)
  })

  it("rejects files over 5 MB", async () => {
    const big = new Uint8Array(5 * 1024 * 1024 + 1)
    big.set(PDF)
    const response = await POST(request(valid, new File([big], "resume.pdf")))
    expect(response.status).toBe(400)
  })

  it("requires a resume", async () => {
    const response = await POST(request(valid))
    expect(response.status).toBe(400)
  })

  it("validates the portfolio link", async () => {
    const response = await POST(
      request({ ...valid, link: "not a url" }, new File([PDF], "resume.pdf", { type: "application/pdf" }))
    )
    expect(response.status).toBe(400)
  })

  it("silently drops honeypot submissions", async () => {
    const response = await POST(
      request({ ...valid, fax: "spam" }, new File([PDF], "resume.pdf", { type: "application/pdf" }))
    )
    expect(response.status).toBe(200)
    expect(sendApplicationEmail).not.toHaveBeenCalled()
    expect(add).not.toHaveBeenCalled()
  })

  it("reports unavailability when email isn't configured", async () => {
    isEmailConfigured.mockReturnValue(false)
    const response = await POST(request(valid, new File([PDF], "resume.pdf", { type: "application/pdf" })))
    expect(response.status).toBe(503)
  })
})
