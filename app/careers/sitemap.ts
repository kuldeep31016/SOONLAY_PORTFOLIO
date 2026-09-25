import type { MetadataRoute } from "next"
import { getPublishedJobSlugs } from "@/lib/careers/repository"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function careersSitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPublishedJobSlugs()
  const entries: MetadataRoute.Sitemap = [
    {
      url: "https://soonlay.tech/careers",
      changeFrequency: "weekly",
      priority: 0.9
    }
  ]

  for (const slug of slugs) {
    entries.push({
      url: `https://soonlay.tech/careers/${slug}`,
      changeFrequency: "weekly",
      priority: 0.7
    })
  }

  return entries
}
