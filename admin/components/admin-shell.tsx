"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, type ReactNode } from "react"
import { requestJson } from "@/lib/client-http"

type NavIconName = "dashboard" | "jobs" | "create" | "settings"

const navItems: Array<{ href: string; label: string; icon: NavIconName }> = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/jobs", label: "Jobs", icon: "jobs" },
  { href: "/jobs/new", label: "Create Job", icon: "create" },
  { href: "/settings", label: "Settings", icon: "settings" }
]

function NavIcon({ name }: { name: NavIconName }) {
  if (name === "jobs") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5.5h16v13H4zM8 9h8M8 12h8M8 15h5" />
      </svg>
    )
  }
  if (name === "create") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    )
  }
  if (name === "settings") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
        <path d="m19.4 15 .1.1-1.8 1.8-.1-.1a2 2 0 0 0-2.2 0l-.3.2a2 2 0 0 0-1 1.8v.2h-2.6v-.2a2 2 0 0 0-1-1.8l-.3-.2a2 2 0 0 0-2.2 0l-.1.1-1.8-1.8.1-.1a2 2 0 0 0 0-2.2l-.2-.3a2 2 0 0 0-1.8-1H6v-2.6h.2a2 2 0 0 0 1.8-1l.2-.3a2 2 0 0 0 0-2.2l-.1-.1 1.8-1.8.1.1a2 2 0 0 0 2.2 0l.3-.2a2 2 0 0 0 1-1.8V5h2.6v.2a2 2 0 0 0 1 1.8l.3.2a2 2 0 0 0 2.2 0l.1-.1 1.8 1.8-.1.1a2 2 0 0 0 0 2.2l.2.3a2 2 0 0 0 1.8 1h.2V15h-.2a2 2 0 0 0-1.8 0Z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13h6V4H4v9ZM14 20h6v-9h-6v9ZM4 20h6v-3H4v3ZM14 8h6V4h-6v4Z" />
    </svg>
  )
}

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AdminShell({ children, email }: { children: ReactNode; email: string }) {
  const pathname = usePathname() ?? ""
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState("")

  async function handleLogout() {
    setLoggingOut(true)
    setLogoutError("")
    try {
      await requestJson("/api/session", { method: "DELETE" }, true)
    } catch {
      setLogoutError("The session could not be cleared. Please try again.")
    }
    router.replace("/login")
    router.refresh()
  }

  return (
    <div className="admin-shell">
      <button
        className={`sidebar-scrim${sidebarOpen ? " is-visible" : ""}`}
        type="button"
        aria-label="Close navigation"
        onClick={() => setSidebarOpen(false)}
      />
      <aside className={`sidebar${sidebarOpen ? " is-open" : ""}`} aria-label="Primary navigation">
        <div className="sidebar-top">
          <Link className="sidebar-brand" href="/dashboard" onClick={() => setSidebarOpen(false)}>
            <span className="brand-mark" aria-hidden="true">S</span>
            <span>
              <strong>Soonlay</strong>
              <small>Careers Admin</small>
            </span>
          </Link>
          <button className="sidebar-close" type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav className="sidebar-nav">
          <p className="sidebar-label">Workspace</p>
          {navItems.map((item) => (
            <Link
              className={`sidebar-link${isActivePath(pathname, item.href) ? " is-active" : ""}`}
              href={item.href}
              key={item.href}
              aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-link-icon"><NavIcon name={item.icon} /></span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <span className="avatar" aria-hidden="true">{email.slice(0, 1).toUpperCase()}</span>
            <span className="sidebar-user-copy">
              <small>Signed in as</small>
              <strong>{email}</strong>
            </span>
          </div>
          <button className="sidebar-logout" type="button" onClick={() => void handleLogout()} disabled={loggingOut}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 5H5v14h9M11 12h9M17 8l4 4-4 4" />
            </svg>
            <span>{loggingOut ? "Signing out" : "Log out"}</span>
          </button>
          {logoutError ? <p className="sidebar-error" role="alert">{logoutError}</p> : null}
        </div>
      </aside>
      <div className="admin-body">
        <header className="topbar">
          <button className="menu-toggle" type="button" aria-label="Open navigation" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(true)}>
            <span aria-hidden="true">☰</span>
          </button>
          <div className="topbar-context">
            <span className="topbar-dot" aria-hidden="true" />
            <span>Careers operations</span>
          </div>
          <Link className="topbar-job-link" href="/jobs/new">Create a job <span aria-hidden="true">→</span></Link>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  )
}
