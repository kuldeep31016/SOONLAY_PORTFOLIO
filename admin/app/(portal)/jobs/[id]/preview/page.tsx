import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CareersResponseError } from "@/lib/careers-api"
import { getAdminJob } from "@/lib/careers-data"
import { requirePortalSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "Job preview",
  robots: { index: false, follow: false, noarchive: true }
}

type PreviewPageProps = {
  params: Promise<{ id: string }>
}

export default async function JobPreviewPage({ params }: PreviewPageProps) {
  const session = await requirePortalSession()
  const { id } = await params
  try {
    const job = await getAdminJob(id, session)
    return (
      <div className="preview-page">
        <div className="preview-toolbar">
          <div>
            <p className="eyebrow">Private preview</p>
            <h1>{job.title}</h1>
            <p>This is a signed preview of the public job page. It is not indexed.</p>
          </div>
          <Link className="button button-secondary" href={`/jobs/${encodeURIComponent(job.id)}/edit`}>Back to edit</Link>
        </div>
        <div className="preview-frame-wrap">
          <iframe
            className="preview-frame"
            src={`/api/jobs/${encodeURIComponent(job.id)}/preview`}
            title={`Preview of ${job.title}`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    )
  } catch (error) {
    if (error instanceof CareersResponseError && error.status === 404) {
      notFound()
    }
    throw error
  }
}
