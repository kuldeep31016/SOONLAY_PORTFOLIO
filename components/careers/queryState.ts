export type JobSearchParams = Record<
  string,
  string | string[] | undefined
>

export function toSearchParams(params: JobSearchParams): URLSearchParams {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const entry of value) {
        searchParams.append(key, entry)
      }
      continue
    }

    if (typeof value === "string") {
      searchParams.append(key, value)
    }
  }

  return searchParams
}

export function firstParamValue(
  value: string | string[] | undefined
): string {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}

export function hasActiveJobFilters(params: JobSearchParams): boolean {
  return ["search", "location", "department", "employmentType"].some((key) =>
    Boolean(firstParamValue(params[key]).trim())
  )
}
