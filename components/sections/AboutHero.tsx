"use client"

import { Check, Code2, Lightbulb, PenTool, Rocket } from "lucide-react"
import { Badge } from "@/components/ui/Badge"

const specializations = [
  "SaaS Platforms",
  "Web & Mobile Apps",
  "AI / ML Solutions",
  "Business Software & Automation"
]

const facts = [
  { label: "Founded", value: "2025" },
  { label: "Headquarters", value: "Bangalore, India" },
  { label: "Projects delivered", value: "20+" },
  { label: "Team", value: "Remote-first" }
]

const journey = [
  { icon: Lightbulb, title: "Idea", body: "We understand the problem, the users and what success looks like." },
  { icon: PenTool, title: "Design", body: "Scope, user flows and interfaces agreed before we write code." },
  { icon: Code2, title: "Develop", body: "Built in milestones with working demos along the way." },
  { icon: Rocket, title: "Launch", body: "Deployed, handed over in your name, and supported after launch." }
]

export function AboutHero() {
  return (
    <section className="bg-background pt-16">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <div className="motion-safe:animate-fade-up mb-7">
            <Badge>About Us</Badge>
          </div>

          <h1
            className="motion-safe:animate-fade-up mb-6 font-display text-[2.6rem] font-medium leading-[1.05] tracking-[-0.035em] text-primary sm:text-6xl" style={{ animationDelay: "100ms" }}>
            Building Ideas
            <br />
            Into <span className="accent-serif">Impactful Products</span>
          </h1>

          <p
            className="motion-safe:animate-fade-up mb-8 max-w-xl text-lg leading-relaxed text-secondary" style={{ animationDelay: "200ms" }}>
            We turn your ideas into scalable, production-ready products. Whether you are{" "}
            <span className="font-semibold text-primary">a founder with just an idea</span> or a
            business looking to build a complete product, we help define the scope, architect the
            system, and deliver with structured execution and clear timelines.
          </p>

          <div className="motion-safe:animate-fade-up" style={{ animationDelay: "300ms" }}>
            <h2 className="mb-4 text-sm font-semibold text-primary">Product development studio specializing in:</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {specializations.map((item) => (
                <li key={item} className="flex items-center gap-3 text-base text-secondary">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div          className="motion-safe:animate-fade-up self-center rounded-2xl border border-border glass p-6 shadow-sm sm:p-8" style={{ animationDelay: "200ms" }}>
          <p className="mb-6 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted">
            How an idea becomes a product
          </p>
          <ol className="relative space-y-6">
            <span aria-hidden className="absolute bottom-6 left-5 top-6 w-px bg-border" />
            {journey.map((step, index) => (
              <li key={step.title} className="relative flex gap-4">
                <span className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border glass text-accent">
                  <step.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div className="pt-1">
                  <p className="font-display text-lg font-medium text-primary">
                    <span className="mr-2 font-mono text-xs text-muted">0{index + 1}</span>
                    {step.title}
                  </p>
                  <p className="text-sm text-secondary">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="border-t border-border glass">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {facts.map((fact) => (
            <div key={fact.label} data-reveal className="border-l-2 border-accent pl-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">{fact.label}</dt>
              <dd className="mt-1 font-display text-xl font-medium text-primary sm:text-2xl">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
