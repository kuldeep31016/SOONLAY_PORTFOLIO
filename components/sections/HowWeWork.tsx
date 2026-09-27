import { ClipboardCheck, Handshake, LayoutDashboard, Layers } from "lucide-react"
import { ProcessSteps } from "@/components/sections/ProcessSteps"
import { SectionHeading } from "@/components/ui/SectionHeading"

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
    <section className="border-y border-border glass py-20 md:py-24">
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

        <div data-reveal className="mt-14">
          <ProcessSteps />
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <div key={reason.title} data-reveal style={{ ["--reveal-delay" as string]: `${index * 90}ms` }} className="flex items-center gap-3 rounded-xl border border-border bg-background px-5 py-4">
              <reason.icon className="h-5 w-5 flex-shrink-0 text-accent" strokeWidth={1.6} />
              <h3 className="text-[15px] font-semibold text-primary">{reason.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
