import { ArrowRight, Globe2, MapPin, Wifi } from "lucide-react"
import { Badge } from "@/components/ui/Badge"

const primaryLinkClasses =
  "inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-base font-semibold text-black transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const secondaryLinkClasses =
  "inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-8 py-3 text-base text-primary transition-colors hover:border-border-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function CareersHero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-dark py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="mesh-gradient" />
        <div className="absolute -left-32 top-4 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-accent-2/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Badge>Careers</Badge>
          <h1 className="mt-6 font-display text-[2.6rem] leading-tight tracking-tight text-primary sm:text-5xl md:text-6xl">
            Build what founders{" "}
            <span className="gradient-text">imagine.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-secondary sm:text-lg">
            Soonlay turns raw ideas into production-ready software. We are an
            India-based, remote-first product development studio working with
            founders around the world, from the first idea to a system built to
            launch and grow.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <a href="#open-positions" className={primaryLinkClasses}>
              View open positions
              <ArrowRight
                className="h-4 w-4 transition-transform"
                aria-hidden="true"
              />
            </a>
            <a href="#how-we-work" className={secondaryLinkClasses}>
              How we work
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.7rem] uppercase tracking-wide text-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              India
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Wifi className="h-3.5 w-3.5 text-accent-2" aria-hidden="true" />
              Remote-first
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              Global founders
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
