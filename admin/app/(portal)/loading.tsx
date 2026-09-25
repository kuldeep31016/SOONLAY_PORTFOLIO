export default function PortalLoading() {
  return (
    <div className="page-stack" aria-busy="true">
      <div className="page-heading">
        <div>
          <span className="skeleton skeleton-kicker" />
          <span className="skeleton skeleton-title" />
        </div>
      </div>
      <div className="stats-grid">
        {[1, 2, 3, 4].map((item) => <div className="stat-card skeleton-card" key={item} />)}
      </div>
      <div className="panel skeleton-panel" />
    </div>
  )
}
