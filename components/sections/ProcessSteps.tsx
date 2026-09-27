"use client"

import { useEffect, useState } from "react"
import { Check, ClipboardCheck, Code2, Rocket, Search, LifeBuoy, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const STEP_MS = 3200

const card = "rounded-2xl glass shadow-[0_30px_60px_-28px_rgba(0,0,0,0.45)] ring-1 ring-white/10"

function DiscoverScene() {
  const notes = [
    { text: "Who uses it?", tone: "bg-[#CDEFE2]", pos: "left-[6%] top-[10%] -rotate-3" },
    { text: "What's slow today?", tone: "bg-[#FFC9B8]", pos: "right-[8%] top-[16%] rotate-2" },
    { text: "What does success look like?", tone: "bg-[#D8EDE6]", pos: "left-[14%] bottom-[14%] rotate-1" },
    { text: "Must-haves vs later", tone: "bg-[#E3E9F0]", pos: "right-[10%] bottom-[10%] -rotate-2" }
  ]
  return (
    <div className="relative h-full w-full">
      {notes.map((note, i) => (
        <div
          key={note.text}
          className={cn("sv-bubble absolute w-[38%] rounded-lg p-2.5 text-[11px] font-medium leading-snug text-ink shadow-md sm:p-4 sm:text-sm", note.tone, note.pos)}
          style={{ animationDelay: `${0.1 + i * 0.15}s` }}
        >
          {note.text}
        </div>
      ))}
      <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent-2 text-ink shadow-xl sm:h-24 sm:w-24">
        <Search className="h-6 w-6 sm:h-10 sm:w-10" strokeWidth={1.6} />
      </div>
    </div>
  )
}

function ScopeScene() {
  return (
    <div className={cn(card, "mx-auto w-full max-w-md p-6")}>
      <div className="flex items-center justify-between">
        <p className="font-display text-xl font-semibold text-primary">Project scope</p>
        <span className="rounded-full bg-accent-2 px-3 py-1 text-xs font-semibold text-ink">Fixed price</span>
      </div>
      <ul className="mt-5 space-y-3">
        {["User roles & login", "Booking flow", "Admin dashboard", "Payments"].map((item, i) => (
          <li key={item} className="sv-bubble flex items-center gap-3 text-sm text-primary" style={{ animationDelay: `${0.1 + i * 0.12}s` }}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-2 text-ink">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] font-medium text-secondary">
        {["Design", "Build", "Launch"].map((phase, i) => (
          <div key={phase}>
            <div className={cn("mb-1.5 h-2 rounded-full", i === 0 ? "bg-primary" : i === 1 ? "bg-accent-2" : "bg-border")} />
            {phase}
          </div>
        ))}
      </div>
    </div>
  )
}

function BuildScene() {
  const code = [
    ["const", " booking = ", "await", " api.create({"],
    ["", "  slot, customer,", "", ""],
    ["", "  notify: ", "\"whatsapp\"", ""],
    ["", "})", "", ""]
  ]
  return (
    <div className="grid h-full w-full grid-cols-5 items-center gap-4">
      <div className="col-span-3 rounded-2xl bg-ink ring-1 ring-white/10 p-5 font-mono text-[12px] leading-6 text-white/80 shadow-[0_30px_60px_-28px_rgba(0,0,0,0.7)]">
        <div className="mb-3 flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
        </div>
        {code.map((line, i) => (
          <p key={i} className="sv-bubble whitespace-pre" style={{ animationDelay: `${0.1 + i * 0.2}s` }}>
            <span className="text-accent-2">{line[0]}</span>
            {line[1]}
            <span className="text-accent-2">{line[2]}</span>
            <span className="text-emerald-300">{line[3]}</span>
          </p>
        ))}
      </div>
      <div className={cn(card, "sv-rise col-span-2 p-4")}>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Demo · week 2</p>
        <p className="mt-2 font-display text-base font-semibold text-primary">Booking confirmed</p>
        <div className="mt-3 h-2 w-3/4 rounded bg-white/[0.06]" />
        <div className="mt-2 h-2 w-1/2 rounded bg-white/[0.06]" />
        <span className="mt-4 block rounded-lg bg-accent-2 py-2 text-center text-[11px] font-semibold text-ink">View booking</span>
      </div>
    </div>
  )
}

function LaunchScene() {
  const checks = ["Tests passed", "Deployed to production", "Published on Play Store", "Code & accounts handed over"]
  return (
    <div className={cn(card, "mx-auto w-full max-w-md p-6")}>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-accent-2 ring-1 ring-white/10">
          <Rocket className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-xl font-semibold text-primary">Launch</p>
          <p className="text-xs text-muted">Release v1.0</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
        </span>
      </div>
      <ul className="mt-6 space-y-3">
        {checks.map((item, i) => (
          <li
            key={item}
            className="sv-bubble flex items-center gap-3 rounded-xl bg-white/[0.06] px-4 py-3 text-sm text-primary"
            style={{ animationDelay: `${0.15 + i * 0.25}s` }}
          >
            <Check className="h-4 w-4 text-emerald-400" strokeWidth={3} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function SupportScene() {
  const bars = [40, 55, 48, 62, 70, 66, 78, 85, 80, 92]
  return (
    <div className="grid h-full w-full grid-cols-5 items-center gap-4">
      <div className={cn(card, "col-span-3 p-5")}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-primary">Active users</p>
          <span className="text-xs font-semibold text-emerald-400">▲ growing</span>
        </div>
        <div className="mt-5 flex h-32 items-end gap-2">
          {bars.map((height, i) => (
            <span
              key={i}
              className="sv-rise flex-1 rounded-t bg-gradient-to-t from-accent-2 to-accent/30"
              style={{ height: `${height}%`, animationDelay: `${i * 0.06}s` }}
            />
          ))}
        </div>
      </div>
      <div className="col-span-2 space-y-3">
        {[
          { title: "New feature", body: "Add loyalty points", tone: "bg-accent-2" },
          { title: "Fixed", body: "Checkout on iOS 18", tone: "bg-emerald-400" }
        ].map((ticket, i) => (
          <div key={ticket.title} className={cn(card, "sv-bubble p-4")} style={{ animationDelay: `${0.3 + i * 0.25}s` }}>
            <span className={cn("inline-block h-1.5 w-8 rounded-full", ticket.tone)} />
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted">{ticket.title}</p>
            <p className="text-sm font-medium text-primary">{ticket.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const steps: { title: string; line: string; icon: LucideIcon; Scene: () => JSX.Element }[] = [
  { title: "Discover", line: "We understand your business, users and goals.", icon: Search, Scene: DiscoverScene },
  { title: "Scope", line: "A written plan, timeline and price before we start.", icon: ClipboardCheck, Scene: ScopeScene },
  { title: "Build", line: "We build in milestones and show you working demos.", icon: Code2, Scene: BuildScene },
  { title: "Launch", line: "Live in production, in your name.", icon: Rocket, Scene: LaunchScene },
  { title: "Support", line: "Fixes and new features as you grow.", icon: LifeBuoy, Scene: SupportScene }
]

export function ProcessSteps() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAutoplay(false)
  }, [])

  useEffect(() => {
    if (!autoplay || paused) return
    const id = setTimeout(() => setActive((i) => (i + 1) % steps.length), STEP_MS)
    return () => clearTimeout(id)
  }, [active, paused, autoplay])

  const { Scene } = steps[active]

  return (
    <div
      className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <ol className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
        {steps.map((step, index) => {
          const isActive = index === active
          return (
            <li key={step.title} className="flex-shrink-0 lg:flex-shrink">
              <button
                type="button"
                onClick={() => {
                  setActive(index)
                  setAutoplay(false)
                }}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "group relative w-full overflow-hidden rounded-2xl px-4 py-3 text-left transition-colors duration-500 lg:px-5 lg:py-4",
                  isActive ? "glass shadow-sm ring-1 ring-border" : "hover:bg-surface/60"
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-500",
                      isActive ? "bg-accent-2 text-ink" : "bg-white/[0.06] text-muted"
                    )}
                  >
                    <step.icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <span className="whitespace-nowrap">
                    <span className="mr-2 text-xs font-semibold text-muted">0{index + 1}</span>
                    <span className={cn("font-display text-lg font-semibold transition-colors", isActive ? "text-primary" : "text-secondary")}>
                      {step.title}
                    </span>
                  </span>
                </span>
                <span
                  className={cn(
                    "hidden overflow-hidden pl-12 text-sm text-secondary transition-all duration-500 lg:block",
                    isActive ? "mt-1 max-h-12 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  {step.line}
                </span>
                {isActive && autoplay && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-border">
                    <span
                      key={`${active}-${paused}`}
                      className={cn("block h-full bg-accent-2", !paused && "step-progress")}
                      style={{ ["--step-ms" as string]: `${STEP_MS}ms` }}
                    />
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ol>

      <div className="relative">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-[radial-gradient(ellipse_at_80%_15%,rgba(255,107,74,0.22),transparent_55%),radial-gradient(ellipse_at_10%_100%,rgba(143,220,194,0.16),transparent_55%),linear-gradient(160deg,#10231F,#0A1715)] ring-1 ring-white/10 p-6 sm:p-10">
          <div key={active} className="step-scene flex h-full w-full items-center justify-center">
            <Scene />
          </div>
        </div>
        <p key={`line-${active}`} className="step-scene mt-4 text-center text-sm text-secondary lg:hidden">
          {steps[active].line}
        </p>
      </div>
    </div>
  )
}
