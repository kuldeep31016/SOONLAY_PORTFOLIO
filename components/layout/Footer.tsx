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

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-surface">
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
          <Column title="Services" links={serviceLinks.map((s) => ({ href: s.href, label: s.title }))} />
          <Column title="Resources" links={resources} />
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <span>© {year} Soonlay. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/sitemap.xml" className="hover:text-primary">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
