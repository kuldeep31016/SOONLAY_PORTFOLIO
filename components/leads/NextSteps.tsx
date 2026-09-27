import { Mail, ShieldCheck } from "lucide-react"
import { CONTACT_EMAIL } from "@/lib/site"

const steps = [
  {
    title: "We review your brief",
    body: "A person on our team reads every request and replies within one business day."
  },
  {
    title: "Short discovery call",
    body: "About 30 minutes to understand your users, workflows and constraints."
  },
  {
    title: "Written scope and price",
    body: "You get a clear scope, milestones, timeline and price to approve before any build work starts."
  },
  {
    title: "Build, demo, launch",
    body: "We build in milestones with regular demos, then deploy and support you after launch."
  }
]

export function NextSteps() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border glass p-6">
        <h2 className="mb-5 font-display text-lg font-medium text-primary">What happens next</h2>
        <ol className="relative space-y-5">
          <span aria-hidden className="absolute bottom-3 left-3 top-3 w-px bg-border" />
          {steps.map((step, index) => (
            <li key={step.title} className="relative flex gap-3">
              <span className="relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-2 text-xs font-semibold text-ink">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-primary">{step.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-secondary">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex gap-3 rounded-2xl border border-border glass p-5 text-sm text-secondary">
        <ShieldCheck className="h-5 w-5 flex-shrink-0 text-accent" />
        <span>No obligation. Your details are only used to reply about your project.</span>
      </div>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="flex items-center gap-3 rounded-2xl border border-border glass p-5 text-sm text-secondary transition-colors hover:border-accent/40"
      >
        <Mail className="h-5 w-5 flex-shrink-0 text-accent" />
        <span>
          Prefer email? <span className="font-semibold text-primary">{CONTACT_EMAIL}</span>
        </span>
      </a>
    </div>
  )
}
