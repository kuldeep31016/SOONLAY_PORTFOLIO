"use client"

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return ""
  }
  const prefix = `${name}=`
  const value = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
  return value ? decodeURIComponent(value.slice(prefix.length)) : ""
}

export async function ensureCsrfToken() {
  const existing = readCookie("careers_csrf")
  if (existing) {
    return existing
  }

  const response = await fetch("/api/session", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
    headers: { Accept: "application/json" }
  })
  if (!response.ok) {
    throw new Error("Unable to initialize secure session")
  }
  return readCookie("careers_csrf")
}
