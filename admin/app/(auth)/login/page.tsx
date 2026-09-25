import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSessionContext } from "@/lib/session"
import LoginForm from "./login-form"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false }
}

export default async function LoginPage() {
  const session = await getSessionContext()
  if (session) {
    redirect("/dashboard")
  }
  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-brand">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>Soonlay</span>
        </div>
        <div className="login-copy">
          <p className="eyebrow">Private workspace</p>
          <h1 id="login-title">Careers Admin</h1>
          <p>Sign in with your approved Soonlay administrator account to manage job listings.</p>
        </div>
        <LoginForm />
        <p className="login-footnote">Access is limited to verified accounts on the careers administration allowlist.</p>
      </section>
      <aside className="login-aside" aria-label="Workspace information">
        <div className="login-aside-content">
          <p className="eyebrow">Soonlay careers operations</p>
          <h2>Keep every role discoverable.</h2>
          <p>Create, review, and publish job listings from one focused workspace.</p>
          <div className="login-aside-rule" />
          <dl className="login-facts">
            <div>
              <dt>Workspace</dt>
              <dd>Careers administration</dd>
            </div>
            <div>
              <dt>Security</dt>
              <dd>Verified admin access</dd>
            </div>
          </dl>
        </div>
      </aside>
    </main>
  )
}
