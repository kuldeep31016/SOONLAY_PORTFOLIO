import Link from "next/link"
import { Instagram, Linkedin, Mail, MapPin, Twitter } from "lucide-react"
import { Logo } from "@/components/ui/Logo"
import { serviceLinks } from "@/lib/services"
import { CONTACT_EMAIL, LOCATION, SOCIAL_LINKS } from "@/lib/site"

const company = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Our Work" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" }
]

const resources = [
  { href: "/guides", label: "Guides" },
  { href: "/guides/app-development-cost-india", label: "App development cost" },
  { href: "/guides/how-to-scope-an-mvp", label: "Scoping an MVP" },
  { href: "/start-project", label: "Get a project estimate" }
]

const socials = [
  { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: SOCIAL_LINKS.x, label: "X (Twitter)", icon: Twitter },
  { href: SOCIAL_LINKS.instagram, label: "Instagram", icon: Instagram }
]

function Column({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div data-reveal>
      <h3 className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-secondary transition-colors hover:text-primary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ServicesColumn() {
  return (
    <div data-reveal className="group relative">
      <h3 className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted">Services</h3>
      <ul className="space-y-3">
        {serviceLinks.map((service) => (
          <li key={service.href}>
            <Link href={service.href} className="text-sm text-secondary transition-colors hover:text-primary">
              {service.title}
            </Link>
          </li>
        ))}
      </ul>
      <div className="invisible absolute bottom-full left-0 z-30 w-[min(88vw,440px)] translate-y-2 pb-4 opacity-0 transition-all duration-500 [transition-timing-function:var(--ease-spring)] group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="grid gap-1 rounded-[1.6rem] bg-[#0c1a17]/95 p-2 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10 backdrop-blur-2xl">
          {serviceLinks.map((service, index) => (
            <Link
              key={service.href}
              href={service.href}
              style={{ transitionDelay: `${index * 40}ms` }}
              className="rounded-2xl p-3.5 opacity-0 transition-all duration-500 [transition-timing-function:var(--ease-spring)] hover:bg-white/[0.07] group-focus-within:opacity-100 group-hover:opacity-100"
            >
              <p className="text-sm font-medium text-primary">{service.title}</p>
              <p className="mt-0.5 text-xs text-muted">{service.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border glass">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-secondary">
              A product development studio in Bangalore. We design, build and scale web apps, mobile
              apps, SaaS platforms and business software for startups and growing businesses.
            </p>
            <div className="mt-6 space-y-2 text-sm text-secondary">
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 hover:text-primary">
                <Mail className="h-4 w-4 text-accent" /> {CONTACT_EMAIL}
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" /> {LOCATION} · Working worldwide
              </p>
            </div>
            <div className="mt-6 flex gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Soonlay on ${social.label}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-secondary transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <Column title="Company" links={company} />
          <ServicesColumn />
          <Column title="Resources" links={resources} />
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <span>© {year} Soonlay. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
