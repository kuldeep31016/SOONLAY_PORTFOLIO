"use client"

export default function PortalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="state-card page-error-card">
      <p className="eyebrow">Workspace error</p>
      <h1>We could not load this page</h1>
      <p>Check the Careers API connection and try again. No changes were made.</p>
      <button className="button button-primary" type="button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  )
}
