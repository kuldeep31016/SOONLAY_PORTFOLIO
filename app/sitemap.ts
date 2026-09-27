import type { MetadataRoute } from "next"
import { guides } from "@/lib/guides"
import { absoluteUrl } from "@/lib/site"

const staticRoutes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/start-project", priority: 0.9, changeFrequency: "monthly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/services/web-app-development", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/mobile-app-development", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/saas-platforms", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/ai-solutions", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/mvp-development", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/custom-systems", priority: 0.8, changeFrequency: "monthly" },
  { path: "/work", priority: 0.8, changeFrequency: "monthly" },
  { path: "/guides", priority: 0.7, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "monthly" }
]

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      changeFrequency: route.changeFrequency,
      priority: route.priority
    })),
    ...guides.map((guide) => ({
      url: absoluteUrl(`/guides/${guide.slug}`),
      lastModified: guide.updated,
      changeFrequency: "monthly" as const,
      priority: 0.7
    }))
  ]
}
