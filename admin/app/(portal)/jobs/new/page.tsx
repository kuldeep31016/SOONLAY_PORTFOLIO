import type { Metadata } from "next"
import JobForm from "@/components/job-form"

export const metadata: Metadata = {
  title: "Create job"
}

export default function NewJobPage() {
  return (
    <div className="form-page">
      <div className="form-header">
        <div>
          <p className="eyebrow">New listing</p>
          <h1>Create a job</h1>
          <p>Build a clear role description, set the recruitment destination, and choose when it becomes visible.</p>
        </div>
      </div>
      <JobForm />
    </div>
  )
}
