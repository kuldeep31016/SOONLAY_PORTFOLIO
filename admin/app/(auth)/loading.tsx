export default function AuthLoading() {
  return (
    <main className="state-page" aria-busy="true">
      <div className="state-card">
        <span className="loading-orb" aria-hidden="true" />
        <p className="eyebrow">Soonlay Careers Admin</p>
        <h1>Checking your session</h1>
        <p>Restoring your secure workspace session.</p>
      </div>
    </main>
  )
}
