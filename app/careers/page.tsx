import type { Metadata } from "next"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CareersHero } from "@/components/careers/CareersHero"
import { OpenPositionsSection } from "@/components/careers/OpenPositionsSection"
import {
  toSearchParams,
  type JobSearchParams
} from "@/components/careers/queryState"
import { parsePublicJobQuery } from "@/lib/careers/query"
import { listPublishedJobs } from "@/lib/careers/repository"
import type { JobListResponse } from "@/lib/careers/types"

const description =
  "Explore open positions at Soonlay, an India-based, remote-first product development studio building production-ready software for founders around the world."

export const metadata: Metadata = {
  title: "Careers",
  description,
  alternates: {
    canonical: "https://soonlay.tech/careers"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://soonlay.tech/careers",
    siteName: "Soonlay",
    title: "Careers at Soonlay — Open Positions",
    description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Careers at Soonlay"
      }
    ]
  }
}

interface CareersPageProps {
  searchParams: Promise<JobSearchParams>
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function CareersPage({ searchParams }: CareersPageProps) {
  const params = await searchParams
  let result: JobListResponse

  try {
    result = await listPublishedJobs(
      parsePublicJobQuery(toSearchParams(params))
    )
  } catch (error) {
    console.error("[careers] Failed to load jobs:", error)
    result = {
      jobs: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
      filters: { locations: [], departments: [], employmentTypes: [] },
      truncated: false
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <CareersHero />
        <OpenPositionsSection result={result} searchParams={params} />
      </main>
      <Footer />
    </div>
  )
}
