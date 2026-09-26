import { fileURLToPath } from "node:url"

const projectDirectory = fileURLToPath(new URL(".", import.meta.url))
const isDevelopment = process.env.NODE_ENV === "development"
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data: https://frontend-cdn.perplexity.ai",
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://va.vercel-scripts.com ws: wss:",
  "frame-src 'self' https://admin.soonlay.tech",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self' https://admin.soonlay.tech",
  "upgrade-insecure-requests"
].join("; ")

const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: []
  },
  compress: true,
  poweredByHeader: false,
  // The admin sub-app has its own lockfile, so Next.js would otherwise infer
  // the repository root as the workspace root and trace the admin files too.
  outputFileTracingRoot: projectDirectory,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()"
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" }
        ]
      },
      {
        source: "/api/admin/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }]
      },
      {
        source: "/careers/preview/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }
        ]
      },
      {
        source: "/(.*)\\.(ico|jpg|jpeg|png|gif|svg|webp|avif|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}

export default nextConfig
