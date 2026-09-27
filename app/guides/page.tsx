import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CtaBand } from "@/components/sections/CtaBand"
import { Highlight, PageHero } from "@/components/ui/PageHero"
import { guides } from "@/lib/guides"
import { pageMetadata } from "@/lib/metadata"

export const metadata = pageMetadata({
  title: "Guides — Planning, Pricing and Building Software Products",
  description:
    "Practical guides for founders and business owners: app development costs in India, scoping an MVP, custom vs off-the-shelf software, and hiring a development team.",
  path: "/guides"
})

export default function GuidesPage() {
  const [featured, ...rest] = guides

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <PageHero
          badge="Guides"
          title={
            <>
              Plan your software project <Highlight>with confidence</Highlight>
            </>
          }
          description="Straight answers to the questions founders and business owners ask before they build: cost, scope, timelines and how to choose a team."
        />
        <section className="bg-background py-16 md:py-20">
          <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
            <Link
              href={`/guides/${featured.slug}`}
              data-reveal
              className="card-hover-glow group grid overflow-hidden rounded-2xl border border-border glass lg:grid-cols-[1fr_1.2fr]"
            >
              <div className="relative flex min-h-[220px] flex-col justify-end bg-accent-2 p-8 text-ink">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(255,107,74,0.35),transparent_60%)]"
                />
                <span className="relative text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Featured guide</span>
                <span className="relative mt-3 font-display text-5xl font-medium text-accent-2">₹</span>
              </div>
              <div className="p-8 lg:p-10">
                <p className="flex items-center gap-2 text-xs font-medium text-muted">
                  <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-accent">{featured.relatedService.label}</span>
                  <Clock className="h-3.5 w-3.5" /> {featured.readingMinutes} min read
                </p>
                <h2 className="mt-4 font-display text-2xl font-medium leading-tight text-primary sm:text-3xl">{featured.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-secondary">{featured.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:text-accent">
                  Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
            <div className="grid gap-6 md:grid-cols-3">
              {rest.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  data-reveal
                  className="card-hover-glow group flex flex-col rounded-2xl border border-border glass p-7"
                >
                  <p className="flex items-center gap-2 text-xs font-medium text-muted">
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-accent">{guide.relatedService.label}</span>
                    <Clock className="h-3.5 w-3.5" /> {guide.readingMinutes} min
                  </p>
                  <h2 className="mt-4 font-display text-lg font-medium leading-snug text-primary">{guide.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-secondary">{guide.description}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-primary group-hover:text-accent">
                    Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <CtaBand source="guides-index" />
      </main>
      <Footer />
    </div>
  )
}
