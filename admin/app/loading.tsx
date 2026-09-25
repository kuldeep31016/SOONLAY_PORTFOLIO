export default function Loading() {
  return (
    <main className="state-page" aria-busy="true">
      <div className="state-card">
        <span className="loading-orb" aria-hidden="true" />
        <p className="eyebrow">Soonlay Careers Admin</p>
        <h1>Loading workspace</h1>
        <p>Preparing the latest careers data.</p>
      </div>
    </main>
  )
}
