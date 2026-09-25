"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { ClientRequestError, requestJson } from "@/lib/client-http"
import { jobInputSchema } from "@/lib/schemas"
import type { EmploymentType, JobInput, JobRecord, JobStatus } from "@/lib/types"

type FormValues = {
  title: string
  department: string
  location: string
  employmentType: EmploymentType
  experienceLevel: string
  shortDescription: string
  description: string
  responsibilitiesText: string
  requirementsText: string
  niceToHaveText: string
  benefitsText: string
  skillsText: string
  applicationUrl: string
}

function toText(values: string[] | null | undefined) {
  return Array.isArray(values) ? values.join("\n") : ""
}

function initialValues(job?: JobRecord): FormValues {
  return {
    title: job?.title ?? "",
    department: job?.department ?? "",
    location: job?.location ?? "",
    employmentType: job?.employmentType ?? "Full-time",
    experienceLevel: job?.experienceLevel ?? "",
    shortDescription: job?.shortDescription ?? "",
    description: job?.description ?? "",
    responsibilitiesText: toText(job?.responsibilities),
    requirementsText: toText(job?.requirements),
    niceToHaveText: toText(job?.niceToHave),
    benefitsText: toText(job?.benefits),
    skillsText: toText(job?.skills),
    applicationUrl: job?.applicationUrl ?? ""
  }
}

function lines(value: string) {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
}

function skills(value: string) {
  return value.split(/[,\r\n]/).map((skill) => skill.trim()).filter(Boolean)
}

function buildInput(values: FormValues, status: JobStatus, featured: boolean): JobInput {
  return {
    title: values.title,
    department: values.department,
    location: values.location,
    employmentType: values.employmentType,
    experienceLevel: values.experienceLevel.trim() || null,
    shortDescription: values.shortDescription,
    description: values.description,
    responsibilities: lines(values.responsibilitiesText),
    requirements: lines(values.requirementsText),
    niceToHave: lines(values.niceToHaveText),
    benefits: lines(values.benefitsText),
    skills: skills(values.skillsText),
    applicationUrl: values.applicationUrl,
    status,
    featured
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function readSavedJob(payload: unknown) {
  const candidate = isRecord(payload) && isRecord(payload.job) ? payload.job : payload
  if (!isRecord(candidate) || typeof candidate.id !== "string" || typeof candidate.title !== "string") {
    return null
  }
  return candidate as unknown as JobRecord
}

function fieldErrorsFromZod(issues: Array<{ path: PropertyKey[]; message: string }>) {
  const result: Record<string, string> = {}
  for (const issue of issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "form"
    if (!result[key]) result[key] = issue.message
  }
  return result
}

function FieldError({ name, errors }: { name: string; errors: Record<string, string> }) {
  const message = errors[name]
  if (!message) return null
  return <p className="field-error" id={`${name}-error`}>{message}</p>
}

export default function JobForm({ job }: { job?: JobRecord }) {
  const router = useRouter()
  const [values, setValues] = useState<FormValues>(() => initialValues(job))
  const [status, setStatus] = useState<JobStatus>(job?.status ?? "DRAFT")
  const [featured, setFeatured] = useState(job?.featured ?? false)
  const [jobId, setJobId] = useState(job?.id ?? "")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [topError, setTopError] = useState("")
  const [busy, setBusy] = useState<"save" | "publish" | "preview" | null>(null)

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
    setTopError("")
  }

  async function save(targetStatus: JobStatus, previewAfter: boolean) {
    setTopError("")
    setErrors({})
    const parsed = jobInputSchema.safeParse(buildInput(values, targetStatus, featured))
    if (!parsed.success) {
      setErrors(fieldErrorsFromZod(parsed.error.issues))
      setTopError("Review the highlighted fields before saving.")
      return
    }

    setBusy(previewAfter ? "preview" : targetStatus === "PUBLISHED" ? "publish" : "save")
    try {
      const payload = await requestJson<unknown>(
        jobId ? `/api/jobs/${encodeURIComponent(jobId)}` : "/api/jobs",
        { method: jobId ? "PUT" : "POST", body: JSON.stringify(parsed.data) },
        true
      )
      const saved = readSavedJob(payload)
      if (!saved) {
        throw new Error("The Careers API returned an invalid job")
      }
      setJobId(saved.id)
      setStatus(saved.status)
      if (previewAfter) {
        router.push(`/jobs/${encodeURIComponent(saved.id)}/preview`)
        return
      }
      router.replace(`/jobs/${encodeURIComponent(saved.id)}/edit`)
      router.refresh()
    } catch (error) {
      if (error instanceof ClientRequestError) {
        setErrors(error.fieldErrors)
        setTopError(error.message)
      } else {
        setTopError(error instanceof Error ? error.message : "The job could not be saved")
      }
    } finally {
      setBusy(null)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void save(status, false)
  }

  const isSaving = busy !== null

  return (
    <form className="job-form" onSubmit={handleSubmit} noValidate aria-busy={isSaving}>
      <div className="form-layout">
        <div className="form-main">
          <section className="form-section" aria-labelledby="basic-details-title">
            <div className="form-section-header">
              <h2 id="basic-details-title">Basic details</h2>
              <p>Give candidates the context they need to decide quickly.</p>
            </div>
            <div className="form-grid">
              <div className="field-group form-span-2">
                <label htmlFor="job-title">Job title</label>
                <input id="job-title" value={values.title} onChange={(event) => updateField("title", event.target.value)} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "job-title-error" : undefined} required disabled={isSaving} />
                <FieldError name="title" errors={errors} />
              </div>
              <div className="field-group">
                <label htmlFor="job-department">Department</label>
                <input id="job-department" value={values.department} onChange={(event) => updateField("department", event.target.value)} aria-invalid={Boolean(errors.department)} aria-describedby={errors.department ? "job-department-error" : undefined} required disabled={isSaving} />
                <FieldError name="department" errors={errors} />
              </div>
              <div className="field-group">
                <label htmlFor="job-location">Location</label>
                <input id="job-location" value={values.location} onChange={(event) => updateField("location", event.target.value)} aria-invalid={Boolean(errors.location)} aria-describedby={errors.location ? "job-location-error" : undefined} placeholder="Remote, City, or Region" required disabled={isSaving} />
                <FieldError name="location" errors={errors} />
              </div>
              <div className="field-group">
                <label htmlFor="job-employment-type">Employment type</label>
                <select id="job-employment-type" value={values.employmentType} onChange={(event) => updateField("employmentType", event.target.value as EmploymentType)} disabled={isSaving}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
                <FieldError name="employmentType" errors={errors} />
              </div>
              <div className="field-group">
                <label htmlFor="job-experience-level">Experience level <span className="muted">(optional)</span></label>
                <input id="job-experience-level" value={values.experienceLevel} onChange={(event) => updateField("experienceLevel", event.target.value)} placeholder="Entry level, Mid-level, Senior" disabled={isSaving} />
                <FieldError name="experienceLevel" errors={errors} />
              </div>
            </div>
          </section>

          <section className="form-section" aria-labelledby="content-details-title">
            <div className="form-section-header">
              <h2 id="content-details-title">Content</h2>
              <p>Use plain, scannable text. Enter each responsibility or requirement on its own line.</p>
            </div>
            <div className="content-stack">
              <div className="field-group">
                <label htmlFor="job-short-description">Short description <span className="muted">(optional)</span></label>
                <textarea id="job-short-description" value={values.shortDescription} onChange={(event) => updateField("shortDescription", event.target.value)} aria-invalid={Boolean(errors.shortDescription)} aria-describedby={errors.shortDescription ? "job-short-description-error" : "job-short-description-hint"} maxLength={400} disabled={isSaving} />
                <p className="field-hint" id="job-short-description-hint">A concise summary shown in job cards and search results.</p>
                <FieldError name="shortDescription" errors={errors} />
              </div>
              <div className="field-group">
                <label htmlFor="job-description">Full description</label>
                <textarea id="job-description" value={values.description} onChange={(event) => updateField("description", event.target.value)} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "job-description-error" : undefined} rows={8} required disabled={isSaving} />
                <FieldError name="description" errors={errors} />
              </div>
              <div className="form-grid">
                <div className="field-group">
                  <label htmlFor="job-responsibilities">Responsibilities</label>
                  <textarea id="job-responsibilities" value={values.responsibilitiesText} onChange={(event) => updateField("responsibilitiesText", event.target.value)} aria-invalid={Boolean(errors.responsibilities)} aria-describedby="job-responsibilities-hint" placeholder={"One responsibility per line"} disabled={isSaving} />
                  <p className="field-hint" id="job-responsibilities-hint">Newline-separated entries.</p>
                  <FieldError name="responsibilities" errors={errors} />
                </div>
                <div className="field-group">
                  <label htmlFor="job-requirements">Requirements</label>
                  <textarea id="job-requirements" value={values.requirementsText} onChange={(event) => updateField("requirementsText", event.target.value)} aria-invalid={Boolean(errors.requirements)} aria-describedby="job-requirements-hint" placeholder={"One requirement per line"} disabled={isSaving} />
                  <p className="field-hint" id="job-requirements-hint">Newline-separated entries.</p>
                  <FieldError name="requirements" errors={errors} />
                </div>
                <div className="field-group">
                  <label htmlFor="job-nice-to-have">Nice to have</label>
                  <textarea id="job-nice-to-have" value={values.niceToHaveText} onChange={(event) => updateField("niceToHaveText", event.target.value)} aria-invalid={Boolean(errors.niceToHave)} aria-describedby="job-nice-to-have-hint" placeholder={"One preference per line"} disabled={isSaving} />
                  <p className="field-hint" id="job-nice-to-have-hint">Optional, newline-separated entries.</p>
                  <FieldError name="niceToHave" errors={errors} />
                </div>
                <div className="field-group">
                  <label htmlFor="job-benefits">Benefits</label>
                  <textarea id="job-benefits" value={values.benefitsText} onChange={(event) => updateField("benefitsText", event.target.value)} aria-invalid={Boolean(errors.benefits)} aria-describedby="job-benefits-hint" placeholder={"One benefit per line"} disabled={isSaving} />
                  <p className="field-hint" id="job-benefits-hint">Optional, newline-separated entries.</p>
                  <FieldError name="benefits" errors={errors} />
                </div>
                <div className="field-group form-span-2">
                  <label htmlFor="job-skills">Skills</label>
                  <input id="job-skills" value={values.skillsText} onChange={(event) => updateField("skillsText", event.target.value)} aria-invalid={Boolean(errors.skills)} aria-describedby="job-skills-hint" placeholder="TypeScript, Figma, Research" disabled={isSaving} />
                  <p className="field-hint" id="job-skills-hint">Separate skills with commas or new lines.</p>
                  <FieldError name="skills" errors={errors} />
                </div>
              </div>
            </div>
          </section>

          <section className="form-section" aria-labelledby="recruitment-details-title">
            <div className="form-section-header">
              <h2 id="recruitment-details-title">Recruitment</h2>
              <p>Point candidates to the approved destination for this role.</p>
            </div>
            <div className="field-group">
              <label htmlFor="job-application-url">Application URL</label>
              <input id="job-application-url" type="url" value={values.applicationUrl} onChange={(event) => updateField("applicationUrl", event.target.value)} aria-invalid={Boolean(errors.applicationUrl)} aria-describedby={errors.applicationUrl ? "job-application-url-error" : "job-application-url-hint"} placeholder="https://" required disabled={isSaving} />
              <p className="field-hint" id="job-application-url-hint">Required. Must be a complete HTTPS URL.</p>
              <FieldError name="applicationUrl" errors={errors} />
            </div>
          </section>

          <section className="form-section" aria-labelledby="publishing-details-title">
            <div className="form-section-header">
              <h2 id="publishing-details-title">Publishing</h2>
              <p>Control visibility and whether this role is highlighted in the careers experience.</p>
            </div>
            <div className="form-grid">
              <div className="field-group">
                <label htmlFor="job-status">Status</label>
                <select id="job-status" value={status} onChange={(event) => { setStatus(event.target.value as JobStatus); setTopError("") }} disabled={isSaving}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="CLOSED">Closed</option>
                </select>
                <FieldError name="status" errors={errors} />
              </div>
              <div className="checkbox-card">
                <input id="job-featured" type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} disabled={isSaving} />
                <label htmlFor="job-featured"><strong>Featured job</strong><span>Highlight this role in the public careers experience.</span></label>
              </div>
            </div>
            {job ? <p className="form-hint">The public slug for this listing is preserved when you save an edit.</p> : null}
          </section>

          {topError ? <div className="alert alert-error form-bottom-alert" role="alert">{topError}</div> : null}
        </div>

        <aside className="form-sidebar" aria-label="Job actions">
          <div className="form-side-card">
            <h2>Save and publish</h2>
            <div className="form-side-actions">
              <button className="button button-primary" type="button" onClick={() => void save("PUBLISHED", false)} disabled={isSaving}>
                {busy === "publish" ? <><span className="button-spinner" aria-hidden="true" />Publishing…</> : "Publish"}
              </button>
              <button className="button button-secondary" type="button" onClick={() => void save("DRAFT", false)} disabled={isSaving}>
                {busy === "save" ? <><span className="button-spinner" aria-hidden="true" />Saving…</> : "Save draft"}
              </button>
              <button className="button button-secondary" type="button" onClick={() => void save(status, true)} disabled={isSaving}>
                {busy === "preview" ? <><span className="button-spinner" aria-hidden="true" />Preparing…</> : "Preview"}
              </button>
            </div>
            <p className="form-side-note">Publishing makes the listing visible. A draft stays private until you publish it.</p>
          </div>
          <div className="form-side-card">
            <h2>Record</h2>
            {job ? (
              <>
                <p className="form-side-note">Editing an existing listing. Updates are sent to the Careers API through your secure admin session.</p>
                <Link className="form-side-link" href={`/jobs/${encodeURIComponent(job.id)}/preview`}>Open preview <span aria-hidden="true">→</span></Link>
              </>
            ) : (
              <p className="form-side-note">Save a draft first to create a stable job record, then publish when it is ready.</p>
            )}
          </div>
          <Link className="button button-quiet" href="/jobs">Cancel and return to jobs</Link>
        </aside>
      </div>
    </form>
  )
}
