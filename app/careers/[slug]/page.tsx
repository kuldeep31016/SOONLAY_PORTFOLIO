import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { JobDetail } from "@/components/careers/JobDetail"
import { getPublishedJobBySlug } from "@/lib/careers/repository"

interface JobPageProps {
  params: Promise<{ slug: string }>
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function generateMetadata({
  params
}: JobPageProps): Promise<Metadata> {
  const { slug } = await params
  const job = await getPublishedJobBySlug(slug)

  if (!job) {
    return {
      title: "Position not found",
      robots: { index: false, follow: false }
    }
  }

  const canonical = `https://soonlay.tech/careers/${job.slug}`
  const description = job.shortDescription.trim() || job.description.trim()

  return {
    title: job.title,
    description: description || `Open position at Soonlay: ${job.title}.`,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: "Soonlay",
      title: `${job.title} — Careers at Soonlay`,
      description:
        description || `Open position at Soonlay: ${job.title}.`,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${job.title} at Soonlay`
        }
      ]
    }
  }
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params
  const job = await getPublishedJobBySlug(slug)

  if (!job) {
    notFound()
  }

  const url = `https://soonlay.tech/careers/${job.slug}`
  const isRemote = /remote/i.test(job.location)
  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description:
      job.shortDescription.trim() ||
      job.description.trim() ||
      `Open position at Soonlay: ${job.title}.`,
    datePosted: job.publishedAt ?? job.createdAt,
    employmentType: job.employmentType,
    url,
    skills: job.skills,
    hiringOrganization: {
      "@type": "Organization",
      name: "Soonlay",
      sameAs: "https://soonlay.tech"
    },
    jobLocationType: isRemote ? "TELECOMMUTE" : undefined,
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        address: job.location
      }
    }
  }
  const jsonLd = JSON.stringify(jobPostingSchema).replace(/</g, "\\u003c")

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <script type="application/ld+json">{jsonLd}</script>
        <JobDetail job={job} />
      </main>
      <Footer />
    </div>
  )
}
