"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { track } from "@vercel/analytics"
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatInr, preliminaryEstimate } from "@/lib/leads/estimate"
import {
  budgets,
  contactMethods,
  featureOptions,
  industries,
  orgTypes,
  platformOptions,
  productTypes,
  stages,
  timelines,
  userTypes,
  type Budget,
  type ContactMethod,
  type Feature,
  type Industry,
  type OrgType,
  type Platform,
  type ProductType,
  type Stage,
  type Timeline,
  type UserType
} from "@/lib/leads/options"
import type { ProjectBrief } from "@/lib/leads/schema"

interface FormState {
  productType: ProductType | null
  idea: string
  users: UserType[]
  platforms: Platform | null
  features: Feature[]
  orgType: OrgType | null
  industry: Industry | null
  stage: Stage | null
  timeline: Timeline | null
  budget: Budget | null
  name: string
  email: string
  company: string
  website: string
  phone: string
  preferredContact: ContactMethod
  fax: string
}

const STEP_TITLES = [
  "What do you want to build?",
  "Who will use it?",
  "About your business",
  "Your preliminary plan"
]

const IDEA_PLACEHOLDER =
  "e.g. We run 3 restaurants in Bangalore and want an app where customers can order food, pay online and track delivery. Staff should see incoming orders on a tablet."

type BriefState =
  | { status: "idle" }
  | { status: "loading"; key: string }
  | { status: "ready"; key: string; brief: ProjectBrief }
  | { status: "unavailable"; key: string }

interface StartProjectFlowProps {
  initialType?: ProductType | null
  source?: string
  onDone?: () => void
}

export function StartProjectFlow({ initialType = null, source, onDone }: StartProjectFlowProps) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>({
    productType: initialType,
    idea: "",
    users: [],
    platforms: null,
    features: [],
    orgType: null,
    industry: null,
    stage: null,
    timeline: null,
    budget: null,
    name: "",
    email: "",
    company: "",
    website: "",
    phone: "",
    preferredContact: "email",
    fax: ""
  })
  const [error, setError] = useState<string | null>(null)
  const [brief, setBrief] = useState<BriefState>({ status: "idle" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const utm = useRef<Record<string, string>>({})
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    for (const [key, value] of params) {
      if (key.startsWith("utm_") || key === "ref") utm.current[key] = value.slice(0, 200)
    }
    track("start_project_opened", { source: source ?? window.location.pathname })
  }, [source])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }))
    setError(null)
  }

  const toggle = <T extends string>(key: "users" | "features", value: T) => {
    setForm((previous) => {
      const list = previous[key] as string[]
      const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
      return { ...previous, [key]: next }
    })
    setError(null)
  }

  const scope = useMemo(() => {
    if (!form.productType || !form.platforms || form.users.length === 0) return null
    return {
      productType: form.productType,
      idea: form.idea.trim(),
      users: form.users,
      platforms: form.platforms,
      features: form.features,
      industry: form.industry ?? undefined
    }
  }, [form.productType, form.idea, form.users, form.platforms, form.features, form.industry])

  const estimate = useMemo(
    () => (scope ? preliminaryEstimate({ ...scope, stage: form.stage ?? undefined }) : null),
    [scope, form.stage]
  )

  const scopeKey = scope ? JSON.stringify(scope) : ""

  useEffect(() => {
    if (step !== 3 || !scope) return
    if (brief.status !== "idle" && brief.key === scopeKey) return
    const key = scopeKey
    setBrief({ status: "loading", key })
    fetch("/api/project-brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: key
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(String(response.status))
        const data = (await response.json()) as { brief: ProjectBrief }
        setBrief({ status: "ready", key, brief: data.brief })
        track("project_brief_generated", { productType: scope.productType })
      })
      .catch(() => setBrief({ status: "unavailable", key }))
  }, [step, scope, scopeKey, brief])

  const validate = (index: number): string | null => {
    if (index === 0) {
      if (!form.productType) return "Pick what you want to build."
      if (form.idea.trim().length < 20) return "Describe your idea in a sentence or two (at least 20 characters)."
    }
    if (index === 1) {
      if (form.users.length === 0) return "Choose at least one type of user."
      if (!form.platforms) return "Choose where people will use it."
    }
    if (index === 2) {
      if (!form.orgType || !form.industry || !form.stage || !form.timeline || !form.budget) {
        return "Please answer each question — it helps us give you an accurate plan."
      }
    }
    if (index === 3) {
      if (form.name.trim().length < 2) return "Please enter your name."
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Please enter a valid email address."
      if ((form.preferredContact === "phone" || form.preferredContact === "whatsapp") && form.phone.trim().length < 7) {
        return "Please add a phone number so we can reach you the way you prefer."
      }
    }
    return null
  }

  const goTo = (next: number) => {
    setStep(next)
    setError(null)
    topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" })
  }

  const next = () => {
    const problem = validate(step)
    if (problem) {
      setError(problem)
      return
    }
    track("start_project_step", { step: step + 2 })
    goTo(step + 1)
  }

  const submit = async () => {
    const problem = validate(3)
    if (problem) {
      setError(problem)
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...scope,
          orgType: form.orgType,
          industry: form.industry,
          stage: form.stage,
          timeline: form.timeline,
          budget: form.budget,
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          website: form.website.trim(),
          phone: form.phone.trim(),
          preferredContact: form.preferredContact,
          brief: brief.status === "ready" ? brief.brief : undefined,
          source: source ?? window.location.pathname,
          utm: Object.keys(utm.current).length ? utm.current : undefined,
          fax: form.fax
        })
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || "Something went wrong. Please email soonlay.tech@gmail.com.")
      }
      track("lead_submitted", {
        productType: form.productType ?? "",
        budget: form.budget ?? "",
        timeline: form.timeline ?? ""
      })
      setSubmitted(true)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div ref={topRef} className="py-6 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Check className="h-6 w-6" />
        </div>
        <h2 className="mb-3 font-display font-bold text-2xl text-primary">Thanks, {form.name.trim().split(" ")[0]} — we have your brief.</h2>
        <p className="mx-auto mb-6 max-w-md text-sm text-secondary">
          A member of our team will review your project and reply within one business day
          {form.preferredContact === "email" ? " by email" : form.preferredContact === "whatsapp" ? " on WhatsApp" : " with a call"}.
          We&apos;ll confirm scope, answer open questions, and suggest next steps — no obligation.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/work" onClick={onDone} className="rounded-lg border border-border px-5 py-2 text-sm text-primary hover:border-border-bright">
            See our work
          </Link>
          <Link href="/guides" onClick={onDone} className="rounded-lg border border-border px-5 py-2 text-sm text-primary hover:border-border-bright">
            Read our guides
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div ref={topRef} className="scroll-mt-24">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between pr-8 text-xs text-muted">
          <span className="font-mono uppercase tracking-wide text-accent">
            Step {step + 1} of {STEP_TITLES.length}
          </span>
          <span>Takes about 2 minutes</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-gradient-accent transition-all duration-300"
            style={{ width: `${((step + 1) / STEP_TITLES.length) * 100}%` }}
          />
        </div>
        <h2 className="mt-5 font-display font-bold text-xl text-primary sm:text-2xl">{STEP_TITLES[step]}</h2>
      </div>

      {step === 0 && (
        <div className="space-y-6">
          <Field label="Type of product">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {productTypes.map((option) => (
                <Choice
                  key={option.id}
                  selected={form.productType === option.id}
                  onClick={() => update("productType", option.id)}
                  label={option.label}
                  hint={option.hint}
                />
              ))}
            </div>
          </Field>
          <Field label="Describe the problem you want to solve" htmlFor="idea">
            <textarea
              id="idea"
              rows={5}
              maxLength={3000}
              value={form.idea}
              onChange={(event) => update("idea", event.target.value)}
              placeholder={IDEA_PLACEHOLDER}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-muted">
              Who is it for, what do they do today, and what should the software make easier?
            </p>
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <Field label="Who will use it? (select all that apply)">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {userTypes.map((option) => (
                <Choice
                  key={option.id}
                  selected={form.users.includes(option.id)}
                  onClick={() => toggle("users", option.id)}
                  label={option.label}
                  multi
                />
              ))}
            </div>
          </Field>
          <Field label="Where will they use it?">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {platformOptions.map((option) => (
                <Choice
                  key={option.id}
                  selected={form.platforms === option.id}
                  onClick={() => update("platforms", option.id)}
                  label={option.label}
                />
              ))}
            </div>
          </Field>
          <Field label="What will it need? (optional — select any)">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {featureOptions.map((option) => (
                <Choice
                  key={option.id}
                  selected={form.features.includes(option.id)}
                  onClick={() => toggle("features", option.id)}
                  label={option.label}
                  multi
                />
              ))}
            </div>
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label="You are a" value={form.orgType} options={orgTypes} onChange={(v) => update("orgType", v as OrgType)} />
          <SelectField label="Industry" value={form.industry} options={industries} onChange={(v) => update("industry", v as Industry)} />
          <SelectField label="Where are you today?" value={form.stage} options={stages} onChange={(v) => update("stage", v as Stage)} />
          <SelectField label="When do you want to launch?" value={form.timeline} options={timelines} onChange={(v) => update("timeline", v as Timeline)} />
          <div className="sm:col-span-2">
            <Field label="Approximate budget">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {budgets.map((option) => (
                  <Choice
                    key={option.id}
                    selected={form.budget === option.id}
                    onClick={() => update("budget", option.id)}
                    label={option.label}
                    hint={option.usd || undefined}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-muted">
                A range helps us propose the best version of your product for that budget.
              </p>
            </Field>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          {estimate && (
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
              <p className="mb-1 text-xs font-mono uppercase tracking-wide text-accent">Preliminary estimate</p>
              <p className="font-display font-bold text-2xl text-primary">
                {formatInr(estimate.low)} – {formatInr(estimate.high)}
              </p>
              <p className="text-sm text-secondary">
                Roughly {estimate.weeksLow}–{estimate.weeksHigh} weeks for a first version
              </p>
              <p className="mt-2 text-xs text-muted">
                Indicative only, based on your answers — not a quotation. Your final scope and price are
                confirmed by our team after a short call.
              </p>
            </div>
          )}

          <BriefPanel state={brief} />

          <div className="relative rounded-2xl border border-border bg-surface/60 p-5">
            <p className="mb-4 text-sm text-primary">Where should we send your reviewed plan?</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="name" label="Your name *" value={form.name} onChange={(v) => update("name", v)} autoComplete="name" />
              <TextField id="email" label="Email *" type="email" value={form.email} onChange={(v) => update("email", v)} autoComplete="email" />
              <TextField id="company" label="Company (optional)" value={form.company} onChange={(v) => update("company", v)} autoComplete="organization" />
              <TextField id="website" label="Website (optional)" value={form.website} onChange={(v) => update("website", v)} autoComplete="url" />
              <TextField id="phone" label="Phone / WhatsApp (optional)" type="tel" value={form.phone} onChange={(v) => update("phone", v)} autoComplete="tel" />
              <div>
                <span className="mb-1 block text-xs font-medium text-secondary">Preferred contact</span>
                <div className="grid grid-cols-3 gap-2">
                  {contactMethods.map((option) => (
                    <Choice
                      key={option.id}
                      selected={form.preferredContact === option.id}
                      onClick={() => update("preferredContact", option.id)}
                      label={option.label}
                      compact
                    />
                  ))}
                </div>
              </div>
            </div>
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="fax">Fax</label>
              <input id="fax" tabIndex={-1} autoComplete="off" value={form.fax} onChange={(event) => update("fax", event.target.value)} />
            </div>
            <p className="mt-4 text-xs text-muted">
              We only use these details to reply about your project. See our{" "}
              <Link href="/privacy" className="underline hover:text-secondary" target="_blank">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-5 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-secondary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/85"
          >
            {step === 2 ? "See my plan" : "Continue"} <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/85 disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Sending…" : "Send to Soonlay"}
          </button>
        )}
      </div>
    </div>
  )
}

function BriefPanel({ state }: { state: BriefState }) {
  if (state.status === "loading" || state.status === "idle") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface/60 p-5 text-sm text-secondary">
        <Loader2 className="h-4 w-4 animate-spin text-accent" />
        Drafting your project plan — user roles, modules and MVP scope…
      </div>
    )
  }
  if (state.status === "unavailable") {
    return (
      <div className="rounded-2xl border border-border bg-surface/60 p-5 text-sm text-secondary">
        Our team will prepare your detailed project plan by hand after you send this.
      </div>
    )
  }
  const { brief } = state
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-5">
      <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-wide text-accent">
        <Sparkles className="h-3.5 w-3.5" /> Draft project brief
      </div>
      <h3 className="font-display font-bold text-lg text-primary">{brief.projectName}</h3>
      <p className="mb-4 text-sm text-secondary">{brief.summary}</p>
      <div className="grid gap-4 text-sm sm:grid-cols-2">
        <BriefList title="Users" items={brief.userRoles.map((r) => `${r.role} — ${r.needs}`)} />
        <BriefList title="Core modules" items={brief.coreModules.map((m) => m.name)} />
        <BriefList title="First version (MVP)" items={brief.mvpScope} />
        <BriefList title="Later" items={brief.laterScope} />
        {brief.integrations.length > 0 && <BriefList title="Likely integrations" items={brief.integrations} />}
        <BriefList title="Questions we'll ask you" items={brief.openQuestions} />
      </div>
      <p className="mt-4 text-xs text-muted">
        AI-generated draft from your answers. A person on our team reviews and corrects it before we reply.
      </p>
    </div>
  )
}

function BriefList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-primary">{title}</p>
      <ul className="space-y-1 text-xs text-secondary">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const inputClass =
  "w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm text-primary placeholder:text-muted outline-none focus:border-accent"

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div>
      {htmlFor ? (
        <label htmlFor={htmlFor} className="mb-2 block text-xs font-medium text-secondary">
          {label}
        </label>
      ) : (
        <p className="mb-2 text-xs font-medium text-secondary">{label}</p>
      )}
      {children}
    </div>
  )
}

function Choice({
  selected,
  onClick,
  label,
  hint,
  multi,
  compact
}: {
  selected: boolean
  onClick: () => void
  label: string
  hint?: string
  multi?: boolean
  compact?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-start gap-2 rounded-xl border text-left transition-colors",
        compact ? "px-2 py-2 text-xs justify-center" : "px-3 py-2.5 text-sm",
        selected
          ? "border-accent bg-accent/10 text-primary"
          : "border-border bg-surface-2/60 text-secondary hover:border-border-bright hover:text-primary"
      )}
    >
      {multi && (
        <span
          className={cn(
            "mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border",
            selected ? "border-accent bg-accent text-white" : "border-border-bright"
          )}
        >
          {selected && <Check className="h-3 w-3" />}
        </span>
      )}
      <span className="flex flex-col">
        <span>{label}</span>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </span>
    </button>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange
}: {
  label: string
  value: string | null
  options: readonly { id: string; label: string }[]
  onChange: (value: string) => void
}) {
  const id = `select-${label.replace(/\W+/g, "-").toLowerCase()}`
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-medium text-secondary">
        {label}
      </label>
      <select id={id} value={value ?? ""} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        <option value="" disabled>
          Select…
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-secondary">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </div>
  )
}
