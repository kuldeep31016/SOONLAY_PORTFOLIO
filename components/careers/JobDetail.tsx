import Link from "next/link"
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  Check,
  Clock3,
  ExternalLink,
  Gift,
  ListChecks,
  MapPin,
  Sparkles,
  type LucideIcon
} from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import type { PublicJob } from "@/lib/careers/types"

interface JobDetailProps {
  job: PublicJob
}

interface MetaItem {
  icon: LucideIcon
  label: string
  value: string
}

interface DetailSectionProps {
  title: string
  icon: LucideIcon
  items: string[]
  emptyMessage: string
}

function safeApplicationUrl(value: string): string | null {
  const url = value.trim()

  try {
    const parsed = new URL(url)
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? url
      : null
  } catch {
    return null
  }
}

function PlainText({ text, emptyMessage }: { text: string; emptyMessage: string }) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  if (paragraphs.length === 0) {
    return <p className="text-sm text-muted">{emptyMessage}</p>
  }

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${paragraph}-${index}`}
          className="whitespace-pre-wrap text-sm leading-relaxed text-secondary sm:text-base"
        >
          {paragraph}
        </p>
      ))}
    </div>
  )
}

function DetailSection({
  title,
  icon: Icon,
  items,
  emptyMessage
}: DetailSectionProps) {
  return (
    <section className="card-surface bg-surface/70 p-6 sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="font-display text-lg text-primary sm:text-xl">{title}</h2>
      </div>
      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="flex gap-3">
              <Check
                className="mt-1 h-4 w-4 shrink-0 text-accent"
                aria-hidden="true"
              />
              <span className="text-sm leading-relaxed text-secondary">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">{emptyMessage}</p>
      )}
    </section>
  )
}

export function JobDetail({ job }: JobDetailProps) {
  const applicationUrl = safeApplicationUrl(job.applicationUrl)
  const metaItems: MetaItem[] = [
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Building2, label: "Department", value: job.department },
    {
      icon: Clock3,
      label: "Employment",
      value: job.employmentType
    }
  ]

  return (
    <section className="relative isolate overflow-hidden bg-gradient-dark py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="mesh-gradient" />
        <div className="absolute -right-32 top-8 h-80 w-80 rounded-full bg-accent-2/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 text-xs text-secondary transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to open positions
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              {job.featured && <Badge>Featured</Badge>}
              <span className="font-mono text-[0.7rem] uppercase tracking-wide text-muted">
                {job.department}
              </span>
            </div>
            <h1 className="mt-4 font-display text-3xl leading-tight tracking-tight text-primary sm:text-4xl md:text-5xl">
              {job.title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[0.7rem] uppercase tracking-wide text-muted">
              {metaItems.map((item) => (
                <span key={item.label} className="inline-flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-accent" aria-hidden="true" />
                  <span>{item.label}</span>
                  <span className="text-secondary">{item.value}</span>
                </span>
              ))}
            </div>
            {job.experienceLevel && (
              <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-wide text-muted">
                Experience:{" "}
                <span className="text-secondary">{job.experienceLevel}</span>
              </p>
            )}

            <div className="mt-10 space-y-6">
              <section className="card-surface bg-surface/70 p-6 sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <BriefcaseBusiness
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="font-display text-lg text-primary sm:text-xl">
                    About this role
                  </h2>
                </div>
                <PlainText
                  text={job.description}
                  emptyMessage="No description provided for this role."
                />
              </section>

              <DetailSection
                title="Responsibilities"
                icon={ListChecks}
                items={job.responsibilities}
                emptyMessage="No responsibilities listed for this role."
              />
              <DetailSection
                title="Requirements"
                icon={Check}
                items={job.requirements}
                emptyMessage="No requirements listed for this role."
              />
              <DetailSection
                title="Nice to have"
                icon={Sparkles}
                items={job.niceToHave}
                emptyMessage="No nice-to-have items listed for this role."
              />
              <DetailSection
                title="Benefits"
                icon={Gift}
                items={job.benefits}
                emptyMessage="No benefits listed for this role."
              />

              <section className="card-surface bg-surface/70 p-6 sm:p-8">
                <h2 className="font-display text-lg text-primary sm:text-xl">
                  Skills
                </h2>
                {job.skills.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-full border border-border bg-surface-2 px-3 py-1.5 font-mono text-[0.7rem] text-secondary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted">
                    No skills listed for this role.
                  </p>
                )}
              </section>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card-surface bg-surface/90 p-6 sm:p-7">
              <h2 className="font-display text-lg text-primary">Apply now</h2>
              <p className="mt-3 text-sm leading-relaxed text-secondary">
                Interested in this role? Continue to the official application
                page for this position.
              </p>
              {applicationUrl ? (
                <a
                  href={applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Apply Now
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : (
                <p className="mt-6 rounded-full border border-border bg-surface-2 px-4 py-2.5 text-center text-xs text-muted">
                  Application link coming soon
                </p>
              )}
              <div className="mt-6 space-y-2 border-t border-border pt-5 font-mono text-[0.7rem] uppercase tracking-wide text-muted">
                <p>{job.department}</p>
                <p>{job.employmentType}</p>
                <p>{job.location}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
