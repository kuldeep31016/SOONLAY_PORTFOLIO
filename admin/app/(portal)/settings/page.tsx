import type { Metadata } from "next"
import { getCareersApiHost } from "@/lib/env"

export const metadata: Metadata = {
  title: "Settings"
}

export default function SettingsPage() {
  const apiHost = getCareersApiHost()

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Workspace configuration</p>
          <h1>Settings</h1>
          <p>Review the integration boundary for this private careers workspace.</p>
        </div>
      </div>
      <div className="settings-grid">
        <section className="settings-card" aria-labelledby="integration-title">
          <h2 id="integration-title">Public API integration</h2>
          <p>The admin workspace calls the public Careers API through a server-only integration. Browser code never receives the API host or service credentials.</p>
          <dl className="settings-list">
            <div className="settings-row">
              <dt>Configured API host</dt>
              <dd><code>{apiHost}</code></dd>
            </div>
            <div className="settings-row">
              <dt>Authentication</dt>
              <dd>Server-side session bearer</dd>
            </div>
            <div className="settings-row">
              <dt>Secrets</dt>
              <dd>Not displayed in this workspace</dd>
            </div>
          </dl>
        </section>
        <section className="settings-card" aria-labelledby="recruitment-title">
          <h2 id="recruitment-title">Recruitment links</h2>
          <p>Each job stores its own required HTTPS application URL. The URL is shown in the job form and sent only when that job is saved.</p>
          <div className="settings-callout">There is no global application form or candidate data workflow in this admin app. Configure the destination that receives applications for each role.</div>
        </section>
      </div>
    </div>
  )
}
