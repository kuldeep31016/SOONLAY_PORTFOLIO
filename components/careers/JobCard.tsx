import Link from "next/link"
import { ArrowUpRight, Building2, Clock3, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import type { PublicJob } from "@/lib/careers/types"

interface JobCardProps {
  job: PublicJob
}

const visibleSkills = 4

export function JobCard({ job }: JobCardProps) {
  const excerpt = job.shortDescription.trim() || job.description.trim()
  const skills = job.skills.slice(0, visibleSkills)
  const remainingSkills = job.skills.length - skills.length

  return (
    <article className="card-surface card-hover-glow relative flex h-full flex-col overflow-hidden bg-surface/80">
      {job.featured && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-accent/60" />
      )}
      <Link
        href={`/careers/${job.slug}`}
        className="group flex h-full flex-col p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-lg text-primary sm:text-xl">
            {job.title}
          </h3>
          {job.featured && <Badge>Featured</Badge>}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.7rem] uppercase tracking-wide text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            {job.department}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-accent-2" aria-hidden="true" />
            {job.employmentType}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            {job.location}
          </span>
        </div>

        {excerpt && (
          <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-secondary">
            {excerpt}
          </p>
        )}

        {(skills.length > 0 || remainingSkills > 0) && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[0.65rem] text-secondary"
              >
                {skill}
              </span>
            ))}
            {remainingSkills > 0 && (
              <span className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[0.65rem] text-muted">
                +{remainingSkills} more
              </span>
            )}
          </div>
        )}

        <span className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-accent">
          View job
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </Link>
    </article>
  )
}
