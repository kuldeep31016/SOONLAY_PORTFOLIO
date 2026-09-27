import { ClipboardCheck, Code2, Handshake, LayoutDashboard, Layers, LifeBuoy, Rocket, Search } from "lucide-react"
import { SectionHeading } from "@/components/ui/SectionHeading"

const steps = [
  {
    icon: Search,
    title: "Discover",
    body: "We learn how your business works today, who the users are, and what outcome the software must deliver."
  },
  {
    icon: ClipboardCheck,
    title: "Scope",
    body: "A written scope with user roles, modules, milestones, timeline and price — agreed before any build work starts."
  },
  {
    icon: Code2,
    title: "Build",
    body: "We design and build in milestones, with working demos along the way so you can give feedback early."
  },
  {
    icon: Rocket,
    title: "Launch",
    body: "We deploy to production, publish to the app stores if needed, and hand over code and accounts in your name."
  },
  {
    icon: LifeBuoy,
    title: "Support",
    body: "Maintenance, fixes and new features after launch, as your users and business grow."
  }
]

const reasons = [
  {
    icon: Handshake,
    title: "Talk to the people building it",
    body: "You work directly with the engineers writing your code — no layers of account managers."
  },
  {
    icon: ClipboardCheck,
    title: "Scope before code",
    body: "You know what will be built, by when, and for how much before you commit."
  },
  {
    icon: Layers,
    title: "Everything under one roof",
    body: "Web, mobile, backend, admin dashboards and AI features — one team, one plan."
  },
  {
    icon: LayoutDashboard,
    title: "Built for real operations",
    body: "Admin panels, roles, notifications and reporting are part of the plan, not an afterthought."
  }
]

export function HowWeWork() {
  return (
    <section className="border-y border-border bg-surface py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="split"
          badge="How we work"
          heading={
            <>
              From idea to production,
              <br className="hidden sm:block" /> step by step
            </>
          }
          subheading="A clear process so you always know what is being built, what it costs and what happens next."
          action={{ label: "Start with a free project plan", href: "/start-project" }}
        />

        <ol className="relative mt-14 grid gap-6 md:grid-cols-5 md:gap-4">
          <span aria-hidden className="absolute left-0 right-0 top-6 hidden h-px bg-border md:block" />
          {steps.map((step, index) => (
            <li key={step.title} data-reveal style={{ ["--reveal-delay" as string]: `${index * 90}ms` }} className="relative flex gap-4 md:block">
              <span className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-border bg-surface text-accent shadow-sm">
                <step.icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <div className="md:mt-5 md:pr-4">
                <p className="text-xs font-semibold text-muted">Step 0{index + 1}</p>
                <h3 className="mt-1 font-display text-lg font-bold text-primary">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <div key={reason.title} data-reveal style={{ ["--reveal-delay" as string]: `${index * 90}ms` }} className="rounded-xl border border-border bg-background p-6">
              <reason.icon className="mb-4 h-6 w-6 text-accent" strokeWidth={1.6} />
              <h3 className="font-semibold text-primary">{reason.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary">{reason.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
