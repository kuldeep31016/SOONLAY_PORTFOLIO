import Link from "next/link"
import { ArrowRight, BookOpen, Check, PlayCircle } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CtaBand } from "@/components/sections/CtaBand"
import { HowWeWork } from "@/components/sections/HowWeWork"
import { FlowDiagram } from "@/components/sections/FlowDiagram"
import { ServiceVisual } from "@/components/sections/ServiceVisual"
import { ButtonLink } from "@/components/ui/ButtonLink"
import { JsonLd } from "@/components/ui/JsonLd"
import { Highlight, PageHero } from "@/components/ui/PageHero"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { breadcrumbSchema, serviceSchema } from "@/lib/schema"
import { servicePages, type ServicePage } from "@/lib/service-pages"

function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={className ?? "space-y-3"}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-secondary">
          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Check className="h-3 w-3" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

export function ServiceDetail({ page }: { page: ServicePage }) {
  const path = `/services/${page.slug}`
  const startHref = `/start-project?type=${page.projectType}`
  const others = servicePages.filter((other) => other.slug !== page.slug)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <JsonLd
          data={[
            serviceSchema(page.name, page.metaDescription, path),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: page.name, path }
            ])
          ]}
        />

        <PageHero
          badge="Services"
          breadcrumbs={[
            { name: "Home", href: "/" },
            { name: "Services", href: "/services" },
            { name: page.navTitle, href: path }
          ]}
          title={
            <>
              {page.heading[0]}
              <br />
              <Highlight>{page.heading[1]}</Highlight>
            </>
          }
          description={page.intro}
          actions={
            <>
              <ButtonLink href={startHref} arrow>
                {page.cta.label}
              </ButtonLink>
              <ButtonLink href="/work" variant="secondary" icon={<PlayCircle className="h-5 w-5" strokeWidth={1.6} />}>
                See Our Work
              </ButtonLink>
            </>
          }
          aside={<ServiceVisual kind={page.visual} />}
        />

        <section className="bg-background py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading badge={page.navTitle} heading={page.primary.title} />
            <div className="mt-10">
              <FlowDiagram steps={page.flow} />
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface py-20 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <div>
              <SectionHeading heading={page.fit.title} />
              <CheckList items={page.fit.items} className="mt-8 space-y-4" />
            </div>
            <div data-reveal className="space-y-4">
              {page.outcomes && (
                <div className="rounded-2xl border border-border bg-background p-7">
                  <h3 className="mb-5 font-display text-xl font-bold text-primary">{page.outcomes.title}</h3>
                  <CheckList items={page.outcomes.items} />
                </div>
              )}
              <div className="rounded-2xl bg-primary p-7 text-white">
                <h3 className="font-display text-xl font-bold">{page.cta.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{page.cta.body}</p>
                <Link
                  href={startHref}
                  className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary"
                >
                  {page.cta.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
              {page.guide && (
                <Link
                  href={page.guide.href}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-background p-5 transition-colors hover:border-accent/40"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-muted">Related guide</span>
                    <span className="block text-sm font-semibold text-primary">{page.guide.title}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-secondary transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
          </div>
        </section>

        <HowWeWork />

        <section className="bg-background pt-20 md:pt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading badge="More services" heading="Explore other services" action={{ label: "All Services", href: "/services" }} align="split" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {others.map((other) => (
                <Link
                  key={other.slug}
                  href={`/services/${other.slug}`}
                  data-reveal
                  className="card-hover-glow group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-5"
                >
                  <span className="text-sm font-semibold text-primary">{other.navTitle}</span>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-secondary transition-colors group-hover:text-accent" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CtaBand source={`service-${page.slug}`} type={page.projectType} />
      </main>
      <Footer />
    </div>
  )
}
