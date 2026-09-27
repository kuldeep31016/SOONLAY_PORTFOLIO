import type { Metadata } from "next"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ApplicationForm } from "@/components/careers/ApplicationForm"
import { OpenPositions } from "@/components/careers/OpenPositions"
import { Highlight, PageHero } from "@/components/ui/PageHero"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { parsePublicJobQuery } from "@/lib/careers/query"
import { listPublishedJobs } from "@/lib/careers/repository"
import type { PublicJob } from "@/lib/careers/types"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Careers — Build Products With Us",
  description:
    "Join Soonlay, a Bangalore-based, remote-first product development studio. See open engineering and design positions or send us your resume.",
  path: "/careers"
})

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function loadJobs(): Promise<PublicJob[]> {
  try {
    const result = await listPublishedJobs(parsePublicJobQuery(new URLSearchParams({ limit: "100" })))
    return result.jobs
  } catch (error) {
    console.error("[careers] Failed to load jobs:", error)
    return []
  }
}

export default async function CareersPage() {
  const jobs = await loadJobs()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <PageHero
          badge="Careers"
          title={
            <>
              Build products <Highlight>with us.</Highlight>
            </>
          }
          description="We're building a team of engineers, designers and product thinkers who enjoy solving real problems and shipping software that matters."
        />

        <section id="open-positions" className="scroll-mt-24 bg-background py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading badge="Open positions" heading="Current openings" />
            <div className="mt-10">
              <OpenPositions jobs={jobs} />
            </div>
          </div>
        </section>

        <section id="apply" className="scroll-mt-24 border-t border-border bg-surface-2/40 py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
            <div>
              <SectionHeading
                badge="General application"
                heading="Don't see a role for you?"
                subheading="Send us your resume. If there's a potential fit, we'll get in touch."
              />
            </div>
            <div data-reveal>
              <ApplicationForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
