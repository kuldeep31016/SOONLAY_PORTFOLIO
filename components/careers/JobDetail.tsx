import Link from "next/link"
import { ApplicationForm } from "@/components/careers/ApplicationForm"
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Check,
  Clock3,
  Gift,
  GraduationCap,
  ListChecks,
  MapPin,
  Sparkles,
  Star,
  Wrench,
  type LucideIcon
} from "lucide-react"
import { PageHero } from "@/components/ui/PageHero"
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

const applyButtonClasses =
  "group inline-flex items-center justify-center gap-2 rounded-lg bg-accent-2 px-7 py-3.5 text-[15px] font-semibold text-ink shadow-lg shadow-black/10 transition-colors hover:bg-accent-2/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"

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

function SectionTitle({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-white/[0.06] text-accent">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden="true" />
      </span>
      <h2 className="font-display text-xl font-medium tracking-[-0.015em] text-primary">
        {children}
      </h2>
    </div>
  )
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
          className="whitespace-pre-wrap break-words text-base leading-relaxed text-secondary"
        >
          {paragraph}
        </p>
      ))}
    </div>
  )
}

function DetailSection({
  title,
  icon,
  items,
  emptyMessage
}: DetailSectionProps) {
  return (
    <section className="py-8 sm:py-10">
      <SectionTitle icon={icon}>{title}</SectionTitle>
      {items.length > 0 ? (
        <ul className="space-y-3.5">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
              </span>
              <span className="min-w-0 break-words text-base leading-relaxed text-secondary">
                {item}
              </span>
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
  const summary = job.shortDescription.trim()
  const metaItems: MetaItem[] = [
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Building2, label: "Department", value: job.department },
    {
      icon: Clock3,
      label: "Employment",
      value: job.employmentType
    }
  ]
  if (job.experienceLevel) {
    metaItems.push({
      icon: GraduationCap,
      label: "Experience",
      value: job.experienceLevel
    })
  }

  return (
    <>
      <PageHero
        size="md"
        badge={job.department}
        breadcrumbs={[
          { name: "Careers", href: "/careers" },
          { name: job.title, href: `/careers/${job.slug}` }
        ]}
        title={<span className="break-words">{job.title}</span>}
        description={summary || undefined}
      >
        <ul className="mt-8 flex flex-wrap gap-2">
          {job.featured && (
            <li className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
              <Star className="h-3.5 w-3.5" aria-hidden="true" />
              Featured
            </li>
          )}
          {metaItems.map((item) => (
            <li
              key={item.label}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border glass px-3 py-1.5 text-sm text-secondary"
            >
              <item.icon className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} aria-hidden="true" />
              <span className="sr-only">{item.label}:</span>
              <span className="truncate">{item.value}</span>
            </li>
          ))}
        </ul>
        {applicationUrl && (
          <div className="mt-8 lg:hidden">
            <a
              href={applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className={`${applyButtonClasses} w-full sm:w-auto`}
            >
              Apply now
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        )}
      </PageHero>

      <section className="bg-background py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 lg:px-8">
          <article className="min-w-0 divide-y divide-border rounded-2xl border border-border glass p-6 sm:p-10">
            <section className="pb-8 sm:pb-10">
              <SectionTitle icon={BriefcaseBusiness}>About this role</SectionTitle>
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

            <section className="pt-8 sm:pt-10">
              <SectionTitle icon={Wrench}>Skills</SectionTitle>
              {job.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-md border border-border bg-white/[0.06] px-3 py-1.5 text-sm text-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">
                  No skills listed for this role.
                </p>
              )}
            </section>
          </article>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border glass p-6 shadow-sm sm:p-7">
              <h2 className="font-display text-xl font-medium tracking-[-0.015em] text-primary">
                Apply for this role
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                {applicationUrl
                  ? "Interested in this role? Continue to the official application page for this position."
                  : "Interested in this role? Send us your resume and a short note."}
              </p>
              {applicationUrl ? (
                <a
                  href={applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className={`${applyButtonClasses} mt-6 w-full`}
                >
                  Apply Now
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              ) : (
                <a href="#apply" className={`${applyButtonClasses} mt-6 w-full`}>
                  Apply Now
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}

              <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
                {metaItems.map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-4">
                    <dt className="inline-flex shrink-0 items-center gap-2 text-muted">
                      <item.icon className="h-4 w-4 text-accent" strokeWidth={1.6} aria-hidden="true" />
                      {item.label}
                    </dt>
                    <dd className="min-w-0 break-words text-right font-medium text-primary">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <Link
              href="/careers"
              className="mt-4 inline-flex items-center gap-2 px-1 text-sm font-medium text-secondary transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to open positions
            </Link>
          </aside>
        </div>
      </section>

      {!applicationUrl && (
        <section id="apply" className="scroll-mt-24 border-t border-border bg-white/[0.06] py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-primary">
              Apply for {job.title}
            </h2>
            <p className="mb-8 mt-2 text-secondary">We read every application and reply if there&apos;s a fit.</p>
            <ApplicationForm jobSlug={job.slug} />
          </div>
        </section>
      )}
    </>
  )
}
