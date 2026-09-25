import { describe, expect, it } from "vitest"

import {
  buildSlugCandidates,
  normalizeSearchText,
  slugify,
  tokenize
} from "@/lib/careers/slug"

describe("slugify", () => {
  it("lowercases and joins words with single dashes", () => {
    expect(slugify("Senior Frontend Engineer")).toBe("senior-frontend-engineer")
  })

  it("strips diacritics and punctuation", () => {
    expect(slugify("Développeur (Full‑Time)")).toBe("developpeur-full-time")
  })

  it("collapses repeated and trailing dashes", () => {
    expect(slugify("  --Lead-- Engineer--  ")).toBe("lead-engineer")
  })

  it("caps the slug length and trims the trailing dash", () => {
    const slug = slugify("a".repeat(200))
    expect(slug.length).toBeLessThanOrEqual(80)
    expect(slug.endsWith("-")).toBe(false)
  })

  it("falls back when no slug-safe characters remain", () => {
    expect(slugify("!!!")).toBe("job")
    expect(slugify("")).toBe("job")
  })
})

describe("normalizeSearchText", () => {
  it("lowercases, strips accents, and collapses separators", () => {
    expect(normalizeSearchText("Café  Résumé!!")).toBe("cafe resume")
  })

  it("keeps + and # so technology terms survive", () => {
    expect(normalizeSearchText("C++ / C#")).toBe("c++ c#")
  })
})

describe("tokenize", () => {
  it("returns normalized terms", () => {
    expect(tokenize("React Native, Redux")).toEqual(["react", "native", "redux"])
  })

  it("returns nothing for punctuation-only input", () => {
    expect(tokenize("!!!")).toEqual([])
    expect(tokenize("   ")).toEqual([])
  })

  it("drops oversized tokens instead of indexing them", () => {
    expect(tokenize(`${"a".repeat(41)} react`)).toEqual(["react"])
  })
})

describe("buildSlugCandidates", () => {
  it("returns the requested number of variants starting with the base", () => {
    expect(buildSlugCandidates("engineer", 3)).toEqual([
      "engineer",
      "engineer-2",
      "engineer-3"
    ])
  })

  it("always returns at least one candidate", () => {
    expect(buildSlugCandidates("", 0)).toEqual(["job"])
  })
})
