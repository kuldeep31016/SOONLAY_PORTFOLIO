import { ArrowRight } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Badge } from "@/components/ui/Badge"
import { ButtonLink } from "@/components/ui/ButtonLink"
import { serviceLinks } from "@/lib/services"
import Link from "next/link"

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true }
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Badge className="mb-6">Error 404</Badge>
          <h1 className="font-display text-5xl font-bold tracking-[-0.035em] text-primary sm:text-6xl">
            This page <span className="accent-serif">doesn&apos;t exist</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-secondary">
            The link may be broken or the page may have moved. Here are some places to go instead.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" arrow>
              Back to Home
            </ButtonLink>
            <ButtonLink href="/start-project" variant="secondary">
              Start a Project
            </ButtonLink>
          </div>
          <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {serviceLinks.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="card-hover-glow group flex items-center justify-between rounded-xl border border-border bg-surface p-5"
              >
                <span>
                  <span className="block font-semibold text-primary">{service.title}</span>
                  <span className="block text-sm text-secondary">{service.body}</span>
                </span>
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-secondary group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
