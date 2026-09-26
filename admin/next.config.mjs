import { fileURLToPath } from "node:url"

const projectDirectory = fileURLToPath(new URL(".", import.meta.url))
const isDevelopment = process.env.NODE_ENV !== "production"

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://frontend-cdn.perplexity.ai",
  // The browser only ever calls this app's own /api routes; the public Careers
  // API is reached server-side by the BFF, so no external origin is needed here.
  "connect-src 'self'",
  "frame-src 'self' https:",
  "block-all-mixed-content",
  ...(isDevelopment ? [] : ["upgrade-insecure-requests"])
].join("; ")

const previewContentSecurityPolicy = contentSecurityPolicy.replace("frame-ancestors 'none'", "frame-ancestors 'self'")

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" }
]

const previewHeaders = [
  { key: "Content-Security-Policy", value: previewContentSecurityPolicy },
  { key: "X-Frame-Options", value: "SAMEORIGIN" }
]

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // The admin app is its own lockfile, so Next.js would otherwise infer the
  // repository root as the workspace root and trace the public app's files too.
  outputFileTracingRoot: projectDirectory,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders
      },
      {
        source: "/api/jobs/:id/preview",
        headers: previewHeaders
      }
    ]
  }
}

export default nextConfig
