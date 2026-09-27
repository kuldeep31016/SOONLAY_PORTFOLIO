// The apex domain redirects to www, so www is the only canonical host.
export const SITE_URL = "https://www.soonlay.tech"
export const SITE_NAME = "Soonlay"
export const CONTACT_EMAIL = "soonlay.tech@gmail.com"
export const LOCATION = "Bangalore, India"

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/soonlaytech",
  x: "https://x.com/SoonlayTech",
  instagram: "https://www.instagram.com/soonlay.tech/"
} as const

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString()
}
