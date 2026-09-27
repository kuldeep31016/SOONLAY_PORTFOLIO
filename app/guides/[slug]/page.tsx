import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ChevronRight, Clock } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CtaBand } from "@/components/sections/CtaBand"
import { Faq } from "@/components/sections/Faq"
import { Badge } from "@/components/ui/Badge"
import { JsonLd } from "@/components/ui/JsonLd"
import { getGuide, guides, type GuideBlock } from "@/lib/guides"
import { pageMetadata } from "@/lib/metadata"
import { articleSchema, breadcrumbSchema } from "@/lib/schema"

interface GuidePageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }))
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) return {}
  return pageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    type: "article"
  })
}

function anchor(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 id={anchor(block.text)} className="scroll-mt-24 pt-6 font-display text-2xl font-medium tracking-[-0.02em] text-primary">
          {block.text}
        </h2>
      )
    case "p":
      return <p className="text-secondary">{block.text}</p>
    case "ul":
      return (
        <ul className="list-disc space-y-2.5 pl-5 text-secondary marker:text-accent">
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </ul>
      )
    case "ol":
      return (
        <ol className="list-decimal space-y-2.5 pl-5 text-secondary marker:font-semibold marker:text-accent">
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </ol>
      )
    case "callout":
      return (
        <p className="rounded-r-xl border-l-4 border-accent bg-accent/[0.06] px-5 py-4 text-[15px] text-primary">{block.text}</p>
      )
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-border glass">
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead className="bg-white/[0.06] text-primary">
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} className="px-4 py-3 font-semibold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-secondary">
              {block.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, index) => (
                    <td key={index} className={`px-4 py-3 align-top ${index === 1 ? "whitespace-nowrap font-semibold text-primary" : ""}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  const path = `/guides/${guide.slug}`
  const others = guides.filter((other) => other.slug !== guide.slug)
  const toc = guide.blocks.filter((block): block is Extract<GuideBlock, { type: "h2" }> => block.type === "h2")
  const startHref = `/start-project?type=${guide.projectType}`
  const updated = new Date(guide.updated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <JsonLd
          data={[
            articleSchema({
              title: guide.title,
              description: guide.description,
              path,
              datePublished: guide.published,
              dateModified: guide.updated
            }),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Guides", path: "/guides" },
              { name: guide.title, path }
            ])
          ]}
        />

        <header className="border-b border-border bg-background pt-16">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/guides" className="hover:text-primary">
                Guides
              </Link>
            </nav>
            <Badge className="mb-6">{guide.relatedService.label}</Badge>
            <h1 className="max-w-4xl font-display text-[2.2rem] font-medium leading-[1.08] tracking-[-0.03em] text-primary sm:text-5xl">
              {guide.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-secondary">{guide.description}</p>
            <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span className="font-medium text-primary">By the Soonlay team</span>
              <span>
                Updated <time dateTime={guide.updated}>{updated}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {guide.readingMinutes} min read
              </span>
            </p>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8 lg:py-16">
          <div className="min-w-0 max-w-3xl">
            <article className="space-y-5 text-[1.0625rem] leading-[1.75]">
              {guide.blocks.map((block, index) => (
                <Block key={index} block={block} />
              ))}
            </article>
            {guide.faqs.length > 0 && <Faq items={guide.faqs} compact />}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {toc.length > 0 && (
              <nav aria-label="On this page" className="hidden rounded-2xl border border-border glass p-6 lg:block">
                <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted">On this page</p>
                <ol className="space-y-2.5">
                  {toc.map((heading) => (
                    <li key={heading.text}>
                      <a href={`#${anchor(heading.text)}`} className="text-sm leading-snug text-secondary hover:text-accent">
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <div className="rounded-2xl glass-strong p-6 text-primary">
              <p className="font-display text-lg font-medium">Get a plan for your project</p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Describe your idea and get a draft scope and preliminary estimate — reviewed by our team within one business day.
              </p>
              <Link
                href={startHref}
                className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-2 px-5 py-3 text-sm font-semibold text-ink"
              >
                Start a Project <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href={guide.relatedService.href} className="mt-3 block text-center text-sm text-white/75 hover:text-white">
                About {guide.relatedService.label} →
              </Link>
            </div>
          </aside>
        </div>

        <section className="border-t border-border glass py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-display text-2xl font-medium tracking-[-0.02em] text-primary">More guides</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {others.map((other) => (
                <Link
                  key={other.slug}
                  href={`/guides/${other.slug}`}
                  className="card-hover-glow group flex flex-col rounded-xl border border-border bg-background p-6"
                >
                  <span className="text-xs font-medium text-muted">{other.readingMinutes} min read</span>
                  <span className="mt-2 font-semibold leading-snug text-primary">{other.title}</span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-accent">
                    Read <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <CtaBand source={`guide-${guide.slug}`} type={guide.projectType} />
      </main>
      <Footer />
    </div>
  )
}
