import Link from "next/link"
import { Github, Linkedin, Twitter, Instagram } from "lucide-react"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-surface/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-1">
              <span className="font-display text-xl font-bold tracking-tight">
                Soonlay
              </span>
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
            </div>
            <p className="text-sm text-secondary">
              We build production-ready software products for startup founders
              around the world.
            </p>
            <div className="flex gap-3 text-secondary">
              <Link
                href="https://www.linkedin.com/company/soonlaytech"
                aria-label="Soonlay on LinkedIn"
                className="hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              {/* <Link
                href="https://github.com/soonlay"
                aria-label="Soonlay on GitHub"
                className="hover:text-primary"
              >
                <Github className="h-5 w-5" />
              </Link> */}
              <Link
                href="https://x.com/SoonlayTech"
                aria-label="Soonlay on Twitter"
                className="hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/soonlay.tech/"
                aria-label="Soonlay on Instagram"
                className="hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <h3 className="font-medium text-primary">Company</h3>
            <div className="flex flex-col gap-2 text-secondary">
              <Link href="/about" className="hover:text-primary">
                About
              </Link>
              <Link href="/services" className="hover:text-primary">
                Services
              </Link>
              <Link href="/work" className="hover:text-primary">
                Work
              </Link>
              <Link href="/blog" className="hover:text-primary">
                Blog
              </Link>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <h3 className="font-medium text-primary">Services</h3>
            <div className="flex flex-col gap-2 text-secondary">
              <span>Web Applications</span>
              <span>Mobile Apps</span>
              <span>SaaS Platforms</span>
              <span>AI Products</span>
              <span>MVP Development</span>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <h3 className="font-medium text-primary">Contact</h3>
            <div className="flex flex-col gap-2 text-secondary">
              <a
                href="mailto:syedayaan9376@gmail.com"
                className="hover:text-primary"
              >
                syedayaan9376@gmail.com
              </a>
              <span>India · Remote-first</span>
              <span>Working with founders globally</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <span>© {year} Soonlay. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}

