"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState, type FormEvent } from "react"
import { ClientRequestError, requestJson } from "@/lib/client-http"
import { ensureCsrfToken } from "@/lib/csrf-client"
import type { SessionResponse } from "@/lib/types"

type FormState = "restoring" | "ready" | "submitting"

function authErrorMessage(error: unknown) {
  if (error instanceof ClientRequestError) {
    if (error.code === "ADMIN_NOT_CONFIGURED" || error.status === 500) {
      return "Careers Admin sign-in is not configured yet."
    }
    if (error.code === "INVALID_CREDENTIALS" || error.status === 401) {
      return "The email or password is incorrect."
    }
    if (error.status === 403) {
      return "Your session expired. Please try again."
    }
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "We could not sign you in. Please try again."
}

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formState, setFormState] = useState<FormState>("restoring")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  const goToDashboard = useCallback(() => {
    router.replace("/dashboard")
    router.refresh()
  }, [router])

  useEffect(() => {
    let mounted = true

    const restore = async () => {
      try {
        const session = await requestJson<SessionResponse>("/api/session", { method: "GET" })
        if (!mounted) return
        if (session.authenticated) {
          goToDashboard()
          return
        }

        await ensureCsrfToken()
        setFormState("ready")
      } catch (restoreError) {
        if (!mounted) return
        setNotice("Sign in to continue to the private workspace.")
        setError(authErrorMessage(restoreError))
        setFormState("ready")
      }
    }

    void restore()
    return () => {
      mounted = false
    }
  }, [goToDashboard])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setNotice("")
    if (!email.trim() || !password) {
      setError("Enter your work email and password.")
      setFormState("ready")
      return
    }
    setFormState("submitting")

    try {
      await ensureCsrfToken()
      await requestJson(
        "/api/session",
        { method: "POST", body: JSON.stringify({ email: email.trim(), password }) },
        true
      )
      goToDashboard()
    } catch (submitError) {
      setError(authErrorMessage(submitError))
      setFormState("ready")
    }
  }

  if (formState === "restoring") {
    return (
      <div className="login-form-state" aria-live="polite">
        <span className="loading-orb" aria-hidden="true" />
        <p>Restoring your secure session…</p>
      </div>
    )
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      {error ? <div className="alert alert-error" role="alert">{error}</div> : null}
      {notice ? <div className="alert alert-info" role="status">{notice}</div> : null}
      <div className="field-group">
        <label htmlFor="admin-email">Work email</label>
        <input
          id="admin-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="you@company.com"
          required
          disabled={formState === "submitting"}
        />
      </div>
      <div className="field-group">
        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          disabled={formState === "submitting"}
        />
      </div>
      <button className="button button-primary button-wide" type="submit" disabled={formState === "submitting"}>
        {formState === "submitting" ? <><span className="button-spinner" aria-hidden="true" />Signing in…</> : "Sign in"}
      </button>
      <p className="form-hint">Use the credentials configured for this workspace.</p>
    </form>
  )
}
