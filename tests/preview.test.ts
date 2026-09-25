import { afterEach, beforeEach, describe, expect, it } from "vitest"

import {
  PREVIEW_TOKEN_TTL_MS,
  buildPreviewUrl,
  createPreviewToken,
  validatePreviewToken,
  verifyPreviewTokenSignature
} from "@/lib/careers/preview"

const SECRET = "test-preview-secret-that-is-long-enough-123456"
const subject = { id: "job-123", slug: "senior-frontend-engineer" }

const originalSecret = process.env.CAREERS_PREVIEW_SECRET

beforeEach(() => {
  process.env.CAREERS_PREVIEW_SECRET = SECRET
})

afterEach(() => {
  if (originalSecret === undefined) {
    delete process.env.CAREERS_PREVIEW_SECRET
  } else {
    process.env.CAREERS_PREVIEW_SECRET = originalSecret
  }
})

describe("createPreviewToken", () => {
  it("issues a verifiable token for the given job", async () => {
    const token = await createPreviewToken(subject)
    const result = validatePreviewToken(token, subject)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.jobId).toBe("job-123")
      expect(result.slug).toBe("senior-frontend-engineer")
    }
  })

  it("issues a different token every time", async () => {
    const first = await createPreviewToken(subject)
    const second = await createPreviewToken(subject)
    expect(first).not.toBe(second)
  })
})

describe("validatePreviewToken", () => {
  it("rejects a tampered payload", async () => {
    const token = await createPreviewToken(subject)
    const [body, signature] = token.split(".")
    const forged = Buffer.from(JSON.stringify({ ...subject, slug: "ceo" })).toString("base64url")

    expect(validatePreviewToken(`${forged}.${signature}`, subject).ok).toBe(false)
    expect(validatePreviewToken(`${body}x.${signature}`, subject).ok).toBe(false)
    expect(validatePreviewToken(body, subject).ok).toBe(false)
  })

  it("rejects a token signed with a different secret", async () => {
    const token = await createPreviewToken(subject)
    process.env.CAREERS_PREVIEW_SECRET = "a-completely-different-secret-value-987654"

    expect(validatePreviewToken(token, subject).ok).toBe(false)
  })

  it("rejects a token minted for a different job", async () => {
    const token = await createPreviewToken(subject)

    expect(validatePreviewToken(token, { id: "job-999", slug: subject.slug }).ok).toBe(false)
    expect(validatePreviewToken(token, { id: subject.id, slug: "other-slug" }).ok).toBe(false)
  })

  it("rejects an expired token", async () => {
    const token = await createPreviewToken(subject)
    const [body] = token.split(".")
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      iat: number
      exp: number
    }
    const now = Date.now()
    const realNow = Date.now

    Date.now = () => now + PREVIEW_TOKEN_TTL_MS + 1_000
    try {
      const result = validatePreviewToken(token, subject)
      expect(result).toEqual({ ok: false, reason: "expired" })
    } finally {
      Date.now = realNow
    }

    expect(JSON.stringify(payload.exp - payload.iat)).toBe(String(PREVIEW_TOKEN_TTL_MS))
  })

  it("rejects malformed input without throwing", () => {
    for (const candidate of ["", ".", "no-separator", "a.b", "!!!.???", "x".repeat(5000)]) {
      expect(validatePreviewToken(candidate, subject).ok).toBe(false)
    }
  })

  it("reports a misconfigured deployment instead of throwing", () => {
    delete process.env.CAREERS_PREVIEW_SECRET
    const token = "eyJ2IjoxfQ.c2lnbmF0dXJl"

    expect(validatePreviewToken(token, subject)).toEqual({ ok: false, reason: "misconfigured" })
  })

  it("refuses to sign when the secret is too short", async () => {
    process.env.CAREERS_PREVIEW_SECRET = "too-short"

    await expect(createPreviewToken(subject)).rejects.toThrow()
  })
})

describe("verifyPreviewTokenSignature", () => {
  it("returns the payload for a genuine token without needing the job", async () => {
    const token = await createPreviewToken(subject)
    const verified = verifyPreviewTokenSignature(token)

    expect(verified.ok).toBe(true)
    if (verified.ok) {
      expect(verified.payload.jobId).toBe("job-123")
      expect(verified.payload.slug).toBe("senior-frontend-engineer")
    }
  })

  it("rejects a forged token without consulting any job record", async () => {
    const payload = {
      v: "v1",
      jobId: "job-123",
      slug: "senior-frontend-engineer",
      iat: Date.now(),
      exp: Date.now() + 10_000_000,
      nonce: "attacker"
    }
    const body = Buffer.from(JSON.stringify(payload)).toString("base64url")

    expect(verifyPreviewTokenSignature(`${body}.forged`).ok).toBe(false)
  })

  it("rejects a genuine signature paired with a swapped job id", async () => {
    const token = await createPreviewToken(subject)
    const [body, signature] = token.split(".")
    const decoded = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      jobId: string
    }
    decoded.jobId = "job-999"
    const swapped = Buffer.from(JSON.stringify(decoded)).toString("base64url")

    // The signature no longer covers the modified body.
    expect(verifyPreviewTokenSignature(`${swapped}.${signature}`).ok).toBe(false)
  })

  it("agrees with validatePreviewToken on the outcome for a matching job", async () => {
    const token = await createPreviewToken(subject)
    const verified = verifyPreviewTokenSignature(token)
    const full = validatePreviewToken(token, subject)

    expect(verified.ok).toBe(full.ok)
  })
})

describe("buildPreviewUrl", () => {
  it("builds a private preview link with an encoded token", async () => {
    const token = await createPreviewToken(subject)
    const url = new URL(buildPreviewUrl(subject.slug, token), "https://soonlay.tech")

    expect(url.pathname).toBe(`/careers/preview/${subject.slug}`)
    expect(url.searchParams.get("token")).toBe(token)
  })

  it("encodes a slug that needs escaping", () => {
    expect(buildPreviewUrl("a b/c", "t")).toBe("/careers/preview/a%20b%2Fc?token=t")
  })
})
