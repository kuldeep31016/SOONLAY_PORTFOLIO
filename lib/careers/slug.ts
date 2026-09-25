const COMBINING_MARKS = /[̀-ͯ]/g
const TOKEN_SEPARATORS = /[^a-z0-9+#]+/g
const SLUG_SEPARATORS = /[^a-z0-9]+/g
const REPEATED_DASHES = /-{2,}/g
const LEADING_TRAILING_DASHES = /^-+|-+$/g
const TRAILING_DASHES = /-+$/

export const MAX_SLUG_LENGTH = 80
export const MAX_SEARCH_TERM_LENGTH = 40
export const FALLBACK_SLUG = "job"

export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .replace(TOKEN_SEPARATORS, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Removes every non-alphanumeric character so queries typed without separators
 * still match text that has them, e.g. "nextjs" matching "Next.js".
 */
export function compactSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .replace(/[^a-z0-9]+/g, "")
}

export function tokenize(value: string): string[] {
  const normalized = normalizeSearchText(value)
  if (normalized.length === 0) {
    return []
  }
  return normalized.split(" ").filter((token) => token.length > 0 && token.length <= MAX_SEARCH_TERM_LENGTH)
}

export function slugify(value: string): string {
  const collapsed = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .replace(SLUG_SEPARATORS, "-")
    .replace(REPEATED_DASHES, "-")
    .replace(LEADING_TRAILING_DASHES, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(TRAILING_DASHES, "")

  return collapsed.length > 0 ? collapsed : FALLBACK_SLUG
}

export function buildSlugCandidates(base: string, maxVariants: number): string[] {
  const safeBase = base.length > 0 ? base : FALLBACK_SLUG
  const total = Math.max(1, maxVariants)
  return Array.from({ length: total }, (_, index) => (index === 0 ? safeBase : `${safeBase}-${index + 1}`))
}
