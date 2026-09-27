import Link from "next/link"
import { ArrowRight, Box, BrainCircuit, Check, Code2, Layers, Monitor, Smartphone, type LucideIcon } from "lucide-react"
import { ReactNode } from "react"
import { Badge } from "@/components/ui/Badge"
import {
  AiIllustration,
  BusinessIllustration,
  DesignIllustration,
  MobileIllustration,
  SaasIllustration,
  WebIllustration
} from "@/components/sections/ServiceIllustrations"

interface ServiceCard {
  title: string
  body: string
  points: string[]
  href: string
  icon: LucideIcon
  illustration: ReactNode
}

const cards: ServiceCard[] = [
  {
    title: "Web Development",
    body: "Modern, high-performance web applications tailored to your business needs.",
    points: ["Custom web applications", "Admin dashboards", "Scalable backend systems"],
    href: "/services/web-app-development",
    icon: Monitor,
    illustration: <WebIllustration />
  },
  {
    title: "Mobile App Development",
    body: "Android & iOS applications with seamless user experiences.",
    points: ["Native & cross-platform apps", "API integrations", "App store deployment"],
    href: "/services/mobile-app-development",
    icon: Smartphone,
    illustration: <MobileIllustration />
  },
  {
    title: "SaaS Development",
    body: "Scalable SaaS platforms from MVP to enterprise.",
    points: ["Multi-tenant architecture", "Subscription & billing systems", "Feature-rich dashboards"],
    href: "/services/saas-platforms",
    icon: Layers,
    illustration: <SaasIllustration />
  },
  {
    title: "AI Solutions",
    body: "AI-powered applications and automation to solve real business problems.",
    points: ["LLM integration", "Workflow automation", "Intelligent features"],
    href: "/services/ai-solutions",
    icon: BrainCircuit,
    illustration: <AiIllustration />
  },
  {
    title: "Business Software",
    body: "Custom ERP, CRM, inventory and other business systems.",
    points: ["Process automation", "Role-based access", "Integrations with existing tools"],
    href: "/services/custom-systems",
    icon: Box,
    illustration: <BusinessIllustration />
  },
  {
    title: "Product Design & Consulting",
    body: "From idea validation to product strategy and design.",
    points: ["Product strategy", "UI/UX design", "Technical consulting"],
    href: "/services/mvp-development",
    icon: Code2,
    illustration: <DesignIllustration />
  }
]

export function ServicesOverview() {
  return (
    <section className="bg-background py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mb-12 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div className="lg:border-r lg:border-border lg:pr-14">
            <Badge>Our Services</Badge>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-primary sm:text-5xl lg:text-[3.4rem]">
              End-to-End Product
              <br className="hidden sm:block" /> Development Services
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-secondary sm:text-xl">
              We design, build, and scale custom software solutions tailored to your business goals — from
              initial idea to long-term growth.
            </p>
          </div>
          <div>
            <p className="text-base leading-relaxed text-secondary sm:text-lg">
              Whether you&apos;re a startup validating an idea or an established business modernizing your
              operations, we provide complete product development services with a focus on quality,
              scalability, and real business impact.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-6 xl:flex-nowrap">
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 rounded-lg bg-accent-2 px-7 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:bg-accent-2/85"
              >
                Explore All Services
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((service, index) => (
            <Link
              key={service.title}
              href={service.href}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${(index % 3) * 90}ms` }}
              className="card-hover-glow group relative flex min-h-[300px] flex-col overflow-hidden rounded-2xl border border-border glass p-7"
            >
              <div aria-hidden className="pointer-events-none absolute right-5 top-6 hidden sm:block">
                {service.illustration}
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <service.icon className="h-6 w-6" strokeWidth={1.6} />
              </span>
              <div className="relative sm:max-w-[62%]">
                <h3 className="mt-5 font-display text-xl font-medium tracking-[-0.01em] text-primary">{service.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-secondary">{service.body}</p>
              </div>
              <ul className="relative mt-5 space-y-2">
                {service.points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-sm text-secondary">
                    <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-center justify-between pt-6">
                <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-primary transition-colors group-hover:text-accent">
                  Learn More <ArrowRight className="h-4 w-4" />
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border-bright text-primary transition-colors group-hover:border-accent group-hover:text-accent">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
