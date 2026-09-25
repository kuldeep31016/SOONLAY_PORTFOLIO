import Link from "next/link"

export default function NotFound() {
  return (
    <main className="state-page">
      <div className="state-card">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The requested admin page does not exist or is no longer available.</p>
        <Link className="button button-primary" href="/dashboard">
          Return to dashboard
        </Link>
      </div>
    </main>
  )
}
