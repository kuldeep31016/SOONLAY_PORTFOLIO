"use client"

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="state-page">
      <div className="state-card">
        <p className="eyebrow">Soonlay Careers Admin</p>
        <h1>Something went wrong</h1>
        <p>The admin workspace could not complete that request. Try again or sign out if the problem continues.</p>
        <button className="button button-primary" type="button" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </main>
  )
}
