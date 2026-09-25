import type { Metadata } from "next"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CareersHero } from "@/components/careers/CareersHero"
import { CareersOverview } from "@/components/careers/CareersOverview"
import { OpenPositionsSection } from "@/components/careers/OpenPositionsSection"
import {
  toSearchParams,
  type JobSearchParams
} from "@/components/careers/queryState"
import { parsePublicJobQuery } from "@/lib/careers/query"
import { listPublishedJobs } from "@/lib/careers/repository"

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
  const result = await listPublishedJobs(
    parsePublicJobQuery(toSearchParams(params))
  )

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <CareersHero />
        <CareersOverview />
        <OpenPositionsSection result={result} searchParams={params} />
      </main>
      <Footer />
    </div>
  )
}
