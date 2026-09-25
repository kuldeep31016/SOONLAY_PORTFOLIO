import type { Metadata } from "next"
import Link from "next/link"
import { getAdminStats } from "@/lib/careers-data"
import { requirePortalSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "Dashboard"
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

export default async function DashboardPage() {
  const session = await requirePortalSession()
  const stats = await getAdminStats(session)

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Good work starts with clarity.</h1>
          <p>Keep your hiring workspace current, from the first draft to the final close.</p>
        </div>
        <div className="page-actions">
          <Link className="button button-secondary" href="/jobs">View all jobs</Link>
          <Link className="button button-primary" href="/jobs/new">Create job</Link>
        </div>
      </div>

      <section className="stats-grid" aria-label="Job counts">
        <article className="stat-card">
          <div className="stat-label"><span>Active</span><span className="stat-icon" aria-hidden="true">A</span></div>
          <strong className="stat-value">{formatCount(stats.active)}</strong>
          <span className="stat-caption">Published and visible</span>
        </article>
        <article className="stat-card">
          <div className="stat-label"><span>Draft</span><span className="stat-icon" aria-hidden="true">D</span></div>
          <strong className="stat-value">{formatCount(stats.draft)}</strong>
          <span className="stat-caption">Still being prepared</span>
        </article>
        <article className="stat-card">
          <div className="stat-label"><span>Closed</span><span className="stat-icon" aria-hidden="true">C</span></div>
          <strong className="stat-value">{formatCount(stats.closed)}</strong>
          <span className="stat-caption">No longer accepting applications</span>
        </article>
        <article className="stat-card">
          <div className="stat-label"><span>Total</span><span className="stat-icon" aria-hidden="true">T</span></div>
          <strong className="stat-value">{formatCount(stats.total)}</strong>
          <span className="stat-caption">All current job records</span>
        </article>
      </section>

      <div className="dashboard-lower">
        <section className="panel" aria-labelledby="quick-actions-title">
          <div className="panel-header">
            <div>
              <h2 id="quick-actions-title">Quick actions</h2>
              <p>Move from overview to the next useful task.</p>
            </div>
          </div>
          <ul className="quick-list">
            <li>
              <Link href="/jobs/new">
                <span><strong>Create a new job</strong><span>Start with the role details and recruitment link.</span></span>
                <span className="quick-arrow" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/jobs?status=DRAFT">
                <span><strong>Review drafts</strong><span>Finish the roles that are not public yet.</span></span>
                <span className="quick-arrow" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/jobs?archived=true">
                <span><strong>Review archived jobs</strong><span>Keep historical records available when needed.</span></span>
                <span className="quick-arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          </ul>
        </section>

        <section className="panel" aria-labelledby="workspace-title">
          <div className="panel-header">
            <div>
              <h2 id="workspace-title">Workspace</h2>
              <p>Current content posture.</p>
            </div>
          </div>
          <ul className="activity-list">
            <li><span className="activity-marker" aria-hidden="true" /><span><strong>{formatCount(stats.active)} active roles</strong><span>Visible through the public careers experience.</span></span></li>
            <li><span className="activity-marker" aria-hidden="true" /><span><strong>{formatCount(stats.draft)} drafts to shape</strong><span>Not included in the public listing.</span></span></li>
            <li><span className="activity-marker" aria-hidden="true" /><span><strong>{formatCount(stats.archived)} archived records</strong><span>Hidden unless you explicitly include them.</span></span></li>
          </ul>
        </section>
      </div>
    </div>
  )
}
