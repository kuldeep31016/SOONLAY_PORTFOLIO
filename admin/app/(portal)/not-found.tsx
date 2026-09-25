import Link from "next/link"

export default function PortalNotFound() {
  return (
    <div className="state-card page-error-card">
      <p className="eyebrow">404</p>
      <h1>Job page not found</h1>
      <p>The requested job may have been removed, archived, or never existed.</p>
      <Link className="button button-primary" href="/jobs">Return to jobs</Link>
    </div>
  )
}
