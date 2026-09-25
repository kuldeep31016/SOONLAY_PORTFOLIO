import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { getAdminJobs } from "@/lib/careers-data"
import { parseJobListQuery, type JobListQuery } from "@/lib/query"
import { requirePortalSession } from "@/lib/session"
import type { JobListResponse } from "@/lib/types"
import JobsView from "./jobs-view"

export const metadata: Metadata = {
  title: "Jobs"
}

type JobsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const session = await requirePortalSession()
  const query: JobListQuery = parseJobListQuery(await searchParams)
  const data: JobListResponse = await getAdminJobs(query, session)

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Content management</p>
          <h1>Jobs</h1>
          <p>Search, filter, and manage every role in the careers database.</p>
        </div>
        <div className="page-actions">
          <Link className="button button-primary" href="/jobs/new">Create job</Link>
        </div>
      </div>
      <Suspense fallback={<div className="panel skeleton-panel" aria-busy="true" />}>
        <JobsView data={data} query={query} />
      </Suspense>
    </div>
  )
}
