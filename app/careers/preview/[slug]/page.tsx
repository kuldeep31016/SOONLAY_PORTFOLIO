import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { EyeOff, ShieldCheck } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { JobDetail } from "@/components/careers/JobDetail"
import { firstParamValue } from "@/components/careers/queryState"
import { getAdminJobById } from "@/lib/careers/repository"
import { verifyPreviewTokenSignature } from "@/lib/careers/preview"

interface JobPreviewPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Private job preview",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      nosnippet: true,
      noarchive: true
    }
  }
}

export default async function JobPreviewPage({
  params,
  searchParams
}: JobPreviewPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const token = firstParamValue(query.token)

  // Authenticate the token before touching the database. Reading the job first
  // would let a forged token cause a Firestore fetch whose result is serialized
  // into the RSC payload even though this page renders notFound().
  const verified = verifyPreviewTokenSignature(token)
  const job = verified.ok ? await getAdminJobById(verified.payload.jobId) : null

  if (!job || !verified.ok || job.slug !== slug) {
    notFound()
  }

  if (verified.payload.jobId !== job.id || verified.payload.slug !== job.slug) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="border-b border-border bg-surface/70 pt-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-wide text-accent">
              <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
              Private preview
            </p>
            <p className="inline-flex items-center gap-2 text-xs text-secondary">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Time-limited link · not indexed
            </p>
          </div>
        </div>
        <JobDetail job={job} />
      </main>
      <Footer />
    </div>
  )
}
