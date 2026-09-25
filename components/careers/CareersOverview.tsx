import {
  Globe2,
  Lightbulb,
  Rocket,
  Workflow,
  type LucideIcon
} from "lucide-react"
import { SectionHeading } from "@/components/ui/SectionHeading"

interface ReasonCard {
  title: string
  description: string
  tag: string
  icon: LucideIcon
}

const reasons: ReasonCard[] = [
  {
    title: "Founder ideas",
    description:
      "We start with the idea a founder brings and the product outcome it needs to reach.",
    tag: "Founder-first",
    icon: Lightbulb
  },
  {
    title: "Idea to launch",
    description:
      "The same path Soonlay already works: from MVP to a full-scale platform that can launch and grow.",
    tag: "Idea → production",
    icon: Rocket
  },
  {
    title: "Structured execution",
    description:
      "Scope, architecture, delivery, and clear timelines keep product development focused.",
    tag: "Scope · Build · Ship",
    icon: Workflow
  },
  {
    title: "Global, remote-first",
    description:
      "Based in India, working remotely with founders and teams around the world.",
    tag: "India · Worldwide",
    icon: Globe2
  }
]

const steps = [
  {
    title: "Start with the founder's need",
    description:
      "Define the scope of the product and what it needs to achieve."
  },
  {
    title: "Shape the idea into a system",
    description:
      "Architect the product so the MVP can grow into a full-scale platform."
  },
  {
    title: "Build for launch and growth",
    description:
      "Engineer production-ready software around the systems the product needs next."
  }
]

export function CareersOverview() {
  return (
    <>
      <section className="border-t border-border/60 bg-background py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Why Soonlay"
            heading="Product work that stays close to the founder."
            subheading="Soonlay exists to turn raw ideas into production-ready software for founders around the world, from the first idea to a system built to launch and grow."
            align="left"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason) => (
              <article
                key={reason.title}
                className="card-surface card-hover-glow flex h-full flex-col bg-surface/80 p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <reason.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-lg text-primary">
                  {reason.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary">
                  {reason.description}
                </p>
                <p className="mt-5 font-mono text-[0.65rem] uppercase tracking-wide text-muted">
                  {reason.tag}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-we-work"
        className="relative scroll-mt-24 overflow-hidden bg-gradient-dark py-20 md:py-24"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="mesh-gradient" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <SectionHeading
                badge="Mission"
                heading="Turn raw ideas into production-ready software."
                subheading="Our mission is the same one we bring to every founder project: engineer the systems a product needs to launch and grow."
                align="left"
              />
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-secondary sm:text-base">
                Soonlay is a founder-focused product development studio based in
                India. We work remotely with founders globally, on products
                that start as raw ideas and end as working software.
              </p>
            </div>

            <div className="card-surface bg-surface/80 p-6 sm:p-8">
              <h3 className="font-display text-xl text-primary">How we work</h3>
              <ol className="mt-6 space-y-6">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-xs text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="text-sm font-medium text-primary">
                        {step.title}
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-secondary">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
