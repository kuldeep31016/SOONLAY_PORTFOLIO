import type { Metadata } from "next"
import { notFound } from "next/navigation"
import JobForm from "@/components/job-form"
import { CareersResponseError } from "@/lib/careers-api"
import { getAdminJob } from "@/lib/careers-data"
import { requirePortalSession } from "@/lib/session"
import type { JobRecord } from "@/lib/types"

export const metadata: Metadata = {
  title: "Edit job"
}

type EditJobPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const session = await requirePortalSession()
  const { id } = await params
  let job: JobRecord
  try {
    job = await getAdminJob(id, session)
  } catch (error) {
    if (error instanceof CareersResponseError && error.status === 404) {
      notFound()
    }
    throw error
  }

  return (
    <div className="form-page">
      <div className="form-header">
        <div>
          <p className="eyebrow">Edit listing</p>
          <h1>Edit job</h1>
          <p>Update the role content without changing its public slug.</p>
        </div>
      </div>
      <JobForm job={job} />
    </div>
  )
}
