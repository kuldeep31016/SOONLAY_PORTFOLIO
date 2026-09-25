import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { EnvironmentConfigurationError, getCareersApiHost, getCareersApiUrl } from "@/lib/env"

const original = process.env.CAREERS_API_URL

beforeEach(() => {
  delete process.env.CAREERS_API_URL
})

afterEach(() => {
  if (original === undefined) {
    delete process.env.CAREERS_API_URL
  } else {
    process.env.CAREERS_API_URL = original
  }
})

describe("getCareersApiUrl", () => {
  it("defaults to the public site", () => {
    expect(getCareersApiUrl()).toBe("https://soonlay.tech")
    expect(getCareersApiHost()).toBe("soonlay.tech")
  })

  it("strips trailing slashes", () => {
    process.env.CAREERS_API_URL = "https://soonlay.tech///"
    expect(getCareersApiUrl()).toBe("https://soonlay.tech")
  })

  it("allows a local http origin for development", () => {
    process.env.CAREERS_API_URL = "http://localhost:3000"
    expect(getCareersApiUrl()).toBe("http://localhost:3000")

    process.env.CAREERS_API_URL = "http://127.0.0.1:3000"
    expect(getCareersApiUrl()).toBe("http://127.0.0.1:3000")
  })

  it("refuses plaintext http to a remote host", () => {
    process.env.CAREERS_API_URL = "http://soonlay.tech"
    expect(() => getCareersApiUrl()).toThrow(EnvironmentConfigurationError)
  })

  it("refuses non-http protocols", () => {
    for (const candidate of ["ftp://soonlay.tech", "file:///etc/passwd", "javascript:alert(1)"]) {
      process.env.CAREERS_API_URL = candidate
      expect(() => getCareersApiUrl()).toThrow(EnvironmentConfigurationError)
    }
  })

  it("refuses a value that is not a URL", () => {
    process.env.CAREERS_API_URL = "soonlay.tech"
    expect(() => getCareersApiUrl()).toThrow(EnvironmentConfigurationError)
  })

  it("falls back to the default for a blank value", () => {
    process.env.CAREERS_API_URL = "   "
    expect(getCareersApiUrl()).toBe("https://soonlay.tech")
  })
})
