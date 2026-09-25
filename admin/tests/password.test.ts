import { describe, expect, it } from "vitest"

import { hashPassword, verifyPassword } from "@/lib/password"

describe("hashPassword", () => {
  it("produces a scrypt hash with the expected shape", async () => {
    const hash = await hashPassword("correct horse battery staple")
    expect(hash).toMatch(
      /^scrypt\$32768\$8\$1\$[A-Za-z0-9_-]{22}\$[A-Za-z0-9_-]+$/
    )
  })

  it("never contains the plaintext password", async () => {
    const hash = await hashPassword("password123")
    expect(hash).not.toContain("password123")
  })

  it("salts, so the same password hashes differently each time", async () => {
    const first = await hashPassword("password123")
    const second = await hashPassword("password123")
    expect(first).not.toBe(second)
  })

  it("refuses an empty password", async () => {
    await expect(hashPassword("")).rejects.toThrow()
  })
})

describe("verifyPassword", () => {
  it("accepts the correct password", async () => {
    const hash = await hashPassword("s3cret-passphrase")
    await expect(verifyPassword("s3cret-passphrase", hash)).resolves.toBe(true)
  })

  it("rejects the wrong password", async () => {
    const hash = await hashPassword("s3cret-passphrase")
    await expect(verifyPassword("s3cret-passphras", hash)).resolves.toBe(false)
    await expect(verifyPassword("", hash)).resolves.toBe(false)
  })

  it("rejects a hash that was never produced by this module", async () => {
    for (const malformed of [
      "",
      "not-a-hash",
      "scrypt$",
      "scrypt$32768$8$1$onlysalt",
      "scrypt$32768$8$1$salt$",
      "bcrypt$10$abc$def",
      "$scrypt$32768$8$1$salt$hash"
    ]) {
      await expect(verifyPassword("password123", malformed)).resolves.toBe(false)
    }
  })

  it("rejects tampered parameters that would weaken the KDF", async () => {
    const hash = await hashPassword("password123")
    const [algorithm, , blockSize, parallelization, salt, digest] = hash.split("$")

    // Tiny cost would make brute forcing trivial.
    await expect(
      verifyPassword("password123", [algorithm, "16", blockSize, parallelization, salt, digest].join("$"))
    ).resolves.toBe(false)

    // Absurd cost would be a denial-of-service vector.
    await expect(
      verifyPassword(
        "password123",
        [algorithm, "99999999", blockSize, parallelization, salt, digest].join("$")
      )
    ).resolves.toBe(false)
  })

  it("rejects a digest that does not match the salt and password", async () => {
    const hash = await hashPassword("password123")
    const other = await hashPassword("password123")
    const digest = other.split("$")[5]
    const [first, second, third, fourth, salt] = hash.split("$")

    // Salt from one hash, digest from another: correctly formed, but wrong.
    const mismatched = [first, second, third, fourth, salt, digest].join("$")
    await expect(verifyPassword("password123", mismatched)).resolves.toBe(false)
    expect(mismatched).not.toBe(hash)
  })

  it("normalizes compatibility forms so equivalent passwords match", async () => {
    // NFKC folds the "fi" ligature, fullwidth characters and non-breaking spaces.
    const hash = await hashPassword("\uFB01le\uFF21")
    await expect(verifyPassword("fileA", hash)).resolves.toBe(true)
    await expect(verifyPassword("fileB", hash)).resolves.toBe(false)
  })

  it("keeps visually similar but distinct characters apart", async () => {
    // NFKC does not fold "ss" into the sharp s, so these must not match.
    const hash = await hashPassword("pa\u00DFwort")
    await expect(verifyPassword("pa\u00DFwort", hash)).resolves.toBe(true)
    await expect(verifyPassword("passwort", hash)).resolves.toBe(false)
  })
})
