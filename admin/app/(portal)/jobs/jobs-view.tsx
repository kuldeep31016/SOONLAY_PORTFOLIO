"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState, type FormEvent } from "react"
import { requestJson } from "@/lib/client-http"
import { parseJobListQuery, toSearchParams, type JobListQuery } from "@/lib/query"
import type { JobListResponse, JobRecord, JobStatus } from "@/lib/types"

type ActionName = "publish" | "unpublish" | "close" | "archive" | "restore"

function statusLabel(status: JobStatus) {
  if (status === "PUBLISHED") return "Active"
  if (status === "CLOSED") return "Closed"
  return "Draft"
}

function statusClass(job: JobRecord) {
  if (job.archivedAt) return "status-archived"
  if (job.status === "PUBLISHED") return "status-active"
  if (job.status === "CLOSED") return "status-closed"
  return "status-draft"
}

function formatDate(value: string | null) {
  if (!value) return "Not available"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Not available"
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date)
}

function pageHref(pathname: string, query: JobListQuery, page: number) {
  const next = { ...query, page }
  const params = toSearchParams(next).toString()
  return params ? `${pathname}?${params}` : pathname
}

export default function JobsView({ data, query }: { data: JobListResponse; query: JobListQuery }) {
  const router = useRouter()
  const pathname = usePathname() ?? ""
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(query.q)
  const [busy, setBusy] = useState<string | null>(null)
  const [actionError, setActionError] = useState("")

  const currentQuery = useMemo(
    () => parseJobListQuery({
      search: searchParams.get("search") ?? "",
      status: searchParams.get("status") ?? "",
      location: searchParams.get("location") ?? "",
      department: searchParams.get("department") ?? "",
      employmentType: searchParams.get("employmentType") ?? "",
      sort: searchParams.get("sort") ?? "",
      page: searchParams.get("page") ?? "",
      limit: searchParams.get("limit") ?? "",
      archived: searchParams.get("archived") ?? ""
    }),
    [searchParams]
  )

  useEffect(() => {
    setSearch(currentQuery.q)
  }, [currentQuery.q])

  function applyQuery(next: Partial<JobListQuery>) {
    const merged: JobListQuery = { ...currentQuery, ...next, page: next.page ?? 1 }
    const params = toSearchParams(merged).toString()
    router.replace(params ? `${pathname}?${params}` : pathname)
  }

  function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    applyQuery({ q: search.trim(), page: 1 })
  }

  function handleAction(job: JobRecord, action: ActionName) {
    if (action === "unpublish" || action === "close" || action === "archive") {
      const confirmation = action === "archive"
        ? `Archive “${job.title}”? The public listing will be removed.`
        : action === "close"
          ? `Close “${job.title}”? It will no longer accept applications.`
          : `Unpublish “${job.title}”? It will be removed from the public careers listing.`
      if (!window.confirm(confirmation)) return
    }

    setBusy(`${job.id}:${action}`)
    setActionError("")
    void (async () => {
      try {
        if (action === "archive") {
          await requestJson(`/api/jobs/${encodeURIComponent(job.id)}`, { method: "DELETE" }, true)
        } else if (action === "restore") {
          await requestJson(`/api/jobs/${encodeURIComponent(job.id)}`, { method: "POST" }, true)
        } else {
          const nextStatus: JobStatus = action === "publish" ? "PUBLISHED" : action === "close" ? "CLOSED" : "DRAFT"
          await requestJson(
            `/api/jobs/${encodeURIComponent(job.id)}/status`,
            { method: "PATCH", body: JSON.stringify({ status: nextStatus }) },
            true
          )
        }
        router.refresh()
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "The job could not be updated")
      } finally {
        setBusy(null)
      }
    })()
  }

  function renderActions(job: JobRecord) {
    const isBusy = (action: ActionName) => busy === `${job.id}:${action}`
    return (
      <div className="row-actions">
        <Link className="button button-quiet" href={`/jobs/${encodeURIComponent(job.id)}/edit`}>Edit</Link>
        <Link className="button button-quiet" href={`/jobs/${encodeURIComponent(job.id)}/preview`}>Preview</Link>
        {job.archivedAt ? (
          <button className="button button-secondary" type="button" disabled={isBusy("restore")} onClick={() => handleAction(job, "restore")}>
            {isBusy("restore") ? "Restoring…" : "Restore"}
          </button>
        ) : (
          <>
            {job.status !== "PUBLISHED" ? (
              <button className="button button-primary" type="button" disabled={isBusy("publish")} onClick={() => handleAction(job, "publish")}>
                {isBusy("publish") ? "Publishing…" : "Publish"}
              </button>
            ) : (
              <>
                <button className="button button-secondary" type="button" disabled={isBusy("unpublish")} onClick={() => handleAction(job, "unpublish")}>
                  {isBusy("unpublish") ? "Saving…" : "Unpublish"}
                </button>
                <button className="button button-danger" type="button" disabled={isBusy("close")} onClick={() => handleAction(job, "close")}>
                  {isBusy("close") ? "Closing…" : "Close"}
                </button>
              </>
            )}
            <button className="button button-quiet" type="button" disabled={isBusy("archive")} onClick={() => handleAction(job, "archive")}>
              {isBusy("archive") ? "Archiving…" : "Archive"}
            </button>
          </>
        )}
      </div>
    )
  }

  const pagination = data.pagination
  const totalPages = Math.max(pagination.totalPages, 1)
  const currentPage = Math.min(Math.max(pagination.page, 1), totalPages)
  const firstResult = pagination.total === 0 ? 0 : (currentPage - 1) * pagination.limit + 1
  const lastResult = Math.min(currentPage * pagination.limit, pagination.total)

  return (
    <div className="page-stack">
      <section className="panel filter-panel" aria-labelledby="filters-title">
        <h2 className="sr-only" id="filters-title">Filter jobs</h2>
        <form className="filter-form" onSubmit={handleFilterSubmit}>
          <div className="field-group filter-search">
            <label htmlFor="jobs-search">Search</label>
            <input
              id="jobs-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Title, keyword, or location"
            />
          </div>
          <div className="field-group">
            <label htmlFor="jobs-status">Status</label>
            <select id="jobs-status" value={currentQuery.status} onChange={(event) => applyQuery({ status: event.target.value as JobListQuery["status"], page: 1 })}>
              <option value="">All statuses</option>
              <option value="PUBLISHED">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div className="field-group">
            <label htmlFor="jobs-location">Location</label>
            <select id="jobs-location" value={currentQuery.location} onChange={(event) => applyQuery({ location: event.target.value, page: 1 })}>
              <option value="">All locations</option>
              {data.filters.locations.map((location) => <option value={location} key={location}>{location}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label htmlFor="jobs-department">Department</label>
            <select id="jobs-department" value={currentQuery.department} onChange={(event) => applyQuery({ department: event.target.value, page: 1 })}>
              <option value="">All departments</option>
              {data.filters.departments.map((department) => <option value={department} key={department}>{department}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label htmlFor="jobs-employment-type">Employment</label>
            <select id="jobs-employment-type" value={currentQuery.employmentType} onChange={(event) => applyQuery({ employmentType: event.target.value, page: 1 })}>
              <option value="">All types</option>
              {data.filters.employmentTypes.map((type) => <option value={type} key={type}>{type}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label htmlFor="jobs-sort">Sort</label>
            <select id="jobs-sort" value={currentQuery.sort} onChange={(event) => applyQuery({ sort: event.target.value as JobListQuery["sort"], page: 1 })}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="updated">Recently updated</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
          <div className="filter-bottom">
            <label className="checkbox-control" htmlFor="jobs-archived">
              <input
                id="jobs-archived"
                type="checkbox"
                checked={currentQuery.archived}
                onChange={(event) => applyQuery({ archived: event.target.checked, page: 1 })}
              />
              Show archived jobs only
            </label>
            <div className="filter-actions">
              <button className="button button-primary" type="submit">Apply filters</button>
              {currentQuery.q || currentQuery.status || currentQuery.location || currentQuery.department || currentQuery.employmentType || currentQuery.archived || currentQuery.sort !== "newest" ? (
                <Link className="button button-quiet" href="/jobs">Clear</Link>
              ) : null}
            </div>
          </div>
        </form>
      </section>

      {actionError ? <div className="alert alert-error" role="alert">{actionError}</div> : null}

      {data.truncated ? (
        <div className="alert alert-warning" role="alert">
          This project has more job records than the portal scans at once, so the list and totals may be
          incomplete. Narrow the filters or archive old roles.
        </div>
      ) : null}

      <section className="panel" aria-label="Job results">
        <div className="panel-header">
          <div>
            <h2>All jobs</h2>
            <p>{pagination.total} {pagination.total === 1 ? "record" : "records"}{currentQuery.archived ? " (archived only)" : ""}</p>
          </div>
        </div>
        {data.jobs.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-mark" aria-hidden="true">0</span>
            <h3>No jobs match these filters</h3>
            <p>Try a broader search or clear the filters to see the full job list.</p>
            <Link className="button button-secondary" href="/jobs">Clear filters</Link>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th scope="col">Role</th>
                    <th scope="col">Details</th>
                    <th scope="col">Status</th>
                    <th scope="col">Updated</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.jobs.map((job) => (
                    <tr key={job.id}>
                      <td className="job-title-cell">
                        <strong>{job.title}</strong>
                        <small>{job.department}</small>
                      </td>
                      <td>
                        <div className="job-meta">
                          <span>{job.location}</span>
                          <span>{job.employmentType}</span>
                          {job.experienceLevel ? <span>{job.experienceLevel}</span> : null}
                        </div>
                      </td>
                      <td><span className={`status-badge ${statusClass(job)}`}>{job.archivedAt ? "Archived" : statusLabel(job.status)}</span></td>
                      <td className="table-muted">{formatDate(job.updatedAt)}</td>
                      <td>{renderActions(job)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="jobs-cards">
              {data.jobs.map((job) => (
                <article className="job-card" key={job.id}>
                  <div className="job-card-heading">
                    <div>
                      <h3>{job.title}</h3>
                      <p>{job.department}</p>
                    </div>
                    <span className={`status-badge ${statusClass(job)}`}>{job.archivedAt ? "Archived" : statusLabel(job.status)}</span>
                  </div>
                  <div className="job-meta">
                    <span>{job.location}</span>
                    <span>{job.employmentType}</span>
                    <span>Updated {formatDate(job.updatedAt)}</span>
                  </div>
                  <div className="card-actions">{renderActions(job)}</div>
                </article>
              ))}
            </div>
            <div className="pagination">
              <span className="pagination-copy">Showing {firstResult}–{lastResult} of {pagination.total}</span>
              <div className="pagination-actions">
                <Link
                  className="button button-secondary"
                  href={pageHref(pathname, currentQuery, Math.max(1, currentPage - 1))}
                  aria-disabled={currentPage <= 1}
                >
                  Previous
                </Link>
                <Link
                  className="button button-secondary"
                  href={pageHref(pathname, currentQuery, Math.min(totalPages, currentPage + 1))}
                  aria-disabled={currentPage >= totalPages}
                >
                  Next
                </Link>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
