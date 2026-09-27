import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/careers/preview/"]
      }
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/careers/sitemap.xml`],
    host: SITE_URL
  }
}
