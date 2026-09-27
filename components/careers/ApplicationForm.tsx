"use client"

import { useRef, useState, type FormEvent } from "react"
import { ArrowRight, Check, FileText, Loader2, Upload } from "lucide-react"
import { APPLICATION_AREAS, MAX_RESUME_MB } from "@/lib/careers/areas"
import { cn } from "@/lib/utils"

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-[15px] text-primary placeholder:text-muted outline-none transition-colors focus:border-primary/50"

export function ApplicationForm({ jobSlug, defaultArea }: { jobSlug?: string; defaultArea?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const form = event.currentTarget
    const data = new FormData(form)
    const file = data.get("resume")
    if (!(file instanceof File) || file.size === 0) {
      setError("Please attach your resume.")
      return
    }
    if (file.size > MAX_RESUME_MB * 1024 * 1024) {
      setError(`Resume must be ${MAX_RESUME_MB} MB or smaller.`)
      return
    }
    setStatus("sending")
    try {
      const response = await fetch("/api/careers/apply", { method: "POST", body: data })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(body.error || "Something went wrong. Please try again.")
      setStatus("sent")
      form.reset()
      setFileName(null)
    } catch (submitError) {
      setStatus("idle")
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.")
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center sm:p-10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-2 text-primary">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-semibold text-primary">Thanks — we&apos;ve received it.</h3>
        <p className="mx-auto mt-2 max-w-md text-secondary">
          We read every application. If there&apos;s a potential fit, we&apos;ll get in touch by email.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
      {jobSlug && <input type="hidden" name="jobSlug" value={jobSlug} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-primary">Name</span>
          <input name="name" required autoComplete="name" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-primary">Email</span>
          <input name="email" type="email" required autoComplete="email" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-primary">Role / area of interest</span>
          <select name="area" required defaultValue={defaultArea ?? ""} className={inputClass}>
            <option value="" disabled>
              Select…
            </option>
            {APPLICATION_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-primary">
            Portfolio or LinkedIn <span className="font-normal text-muted">(optional)</span>
          </span>
          <input name="link" type="url" placeholder="https://github.com/you" className={inputClass} />
        </label>

        <div className="sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-primary">Resume</span>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={cn(
              "flex w-full items-center gap-4 rounded-xl border border-dashed px-4 py-4 text-left transition-colors",
              fileName ? "border-primary/40 bg-surface-2" : "border-border-bright hover:border-primary/40"
            )}
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-surface-2 text-primary">
              {fileName ? <FileText className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-primary">{fileName ?? "Attach your resume"}</span>
              <span className="block text-xs text-muted">PDF or Word, up to {MAX_RESUME_MB} MB</span>
            </span>
          </button>
          <input
            ref={fileRef}
            name="resume"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
          />
        </div>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-primary">
            Message <span className="font-normal text-muted">(optional)</span>
          </span>
          <textarea
            name="message"
            rows={4}
            maxLength={3000}
            placeholder="Tell us a little about yourself and what you'd like to work on."
            className={cn(inputClass, "resize-y")}
          />
        </label>
      </div>

      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input name="fax" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p role="alert" className="mt-5 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">We only use your details to review your application.</p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex flex-shrink-0 items-center justify-between gap-4 self-start whitespace-nowrap rounded-full bg-primary py-2 pl-6 pr-2 text-[15px] font-semibold text-white transition-transform duration-500 [transition-timing-function:var(--ease-spring)] active:scale-[0.98] disabled:opacity-70 sm:self-auto"
        >
          {status === "sending" ? "Sending…" : "Submit Application"}
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-2 text-primary transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:translate-x-0.5">
            {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          </span>
        </button>
      </div>
    </form>
  )
}
