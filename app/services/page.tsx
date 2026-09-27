import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Box, BrainCircuit, Check, Layers, Monitor, PlayCircle, Rocket, Smartphone, type LucideIcon } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CtaBand } from "@/components/sections/CtaBand"
import { Faq } from "@/components/sections/Faq"
import { HowWeWork } from "@/components/sections/HowWeWork"
import { ButtonLink } from "@/components/ui/ButtonLink"
import { Highlight, PageHero } from "@/components/ui/PageHero"
import { homeFaqs } from "@/lib/faq"
import { pageMetadata } from "@/lib/metadata"
import { servicePages } from "@/lib/service-pages"

export const metadata: Metadata = pageMetadata({
  title: "Software Development Services — Web, Mobile, SaaS & AI",
  description:
    "Web applications, mobile apps, SaaS platforms, AI features, MVPs and custom business software (CRM, ERP, automation) for startups and growing businesses.",
  path: "/services"
})

const icons: Record<string, LucideIcon> = {
  "web-app-development": Monitor,
  "mobile-app-development": Smartphone,
  "saas-platforms": Layers,
  "ai-solutions": BrainCircuit,
  "custom-systems": Box,
  "mvp-development": Rocket
}

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <PageHero
          badge="Our Services"
          title={
            <>
              End-to-end product
              <br />
              <Highlight>development services</Highlight>
            </>
          }
          description="From the first idea to a product in production, we cover strategy, design, engineering, launch and support — for web, mobile, SaaS, AI and custom business software."
          actions={
            <>
              <ButtonLink href="/start-project" arrow>
                Start Your Project
              </ButtonLink>
              <ButtonLink href="/work" variant="secondary" icon={<PlayCircle className="h-5 w-5" strokeWidth={1.6} />}>
                See Our Work
              </ButtonLink>
            </>
          }
        />

        <section className="bg-background py-20 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {servicePages.map((service) => {
              const Icon = icons[service.slug]
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  data-reveal
                  className="card-hover-glow group flex flex-col rounded-2xl border border-border bg-surface p-7"
                >
                  <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-6 w-6" strokeWidth={1.6} />
                  </span>
                  <h2 className="font-display text-xl font-bold text-primary">{service.navTitle}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-secondary">{service.intro}</p>
                  <ul className="mt-5 space-y-2.5">
                    {service.primary.items.slice(0, 3).map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-secondary">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-primary transition-colors group-hover:text-accent">
                    Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        <HowWeWork />
        <Faq items={homeFaqs} />
        <CtaBand source="services-page" />
      </main>
      <Footer />
    </div>
  )
}
