"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { projectFilters, projects, type Project, type ProjectCategory } from "@/lib/projects"

export function PortfolioSection({ variant = "home" }: { variant?: "home" | "page" }) {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("all")
  const [lightbox, setLightbox] = useState<{ project: Project; index: number } | null>(null)

  const filtered = activeFilter === "all" ? projects : projects.filter((p) => p.category === activeFilter)

  const step = useCallback((direction: -1 | 1) => {
    setLightbox((current) => {
      if (!current) return current
      const total = current.project.images.length
      return { ...current, index: (current.index + direction + total) % total }
    })
  }, [])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null)
      if (event.key === "ArrowRight") step(1)
      if (event.key === "ArrowLeft") step(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox, step])

  return (
    <section className={cn("bg-background", variant === "home" ? "py-20 md:py-24" : "py-14 md:py-16")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {variant === "home" && (
          <div className="mb-10">
            <SectionHeading
              align="split"
              badge="Our Work"
              heading={
                <>
                  Products we&apos;ve designed
                  <br className="hidden sm:block" /> and built
                </>
              }
              subheading="Healthcare, retail, billing, travel and consumer apps — shipped for founders and small businesses."
              action={{ label: "View All Work", href: "/work" }}
            />
          </div>
        )}

        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
          {projectFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              aria-pressed={activeFilter === filter.id}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                activeFilter === filter.id
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface text-secondary hover:border-border-bright hover:text-primary"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => {
            const portrait = project.category === "mobile"
            return (
              <article
                key={project.title}
                data-reveal
                style={{ ["--reveal-delay" as string]: `${(index % 3) * 90}ms` }}
                className="card-hover-glow group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface"
              >
                <button
                  type="button"
                  onClick={() => setLightbox({ project, index: 0 })}
                  className="relative aspect-[16/11] w-full overflow-hidden bg-surface-2"
                  aria-label={`View ${project.title} screenshots`}
                >
                  <Image
                    src={project.images[0]}
                    alt={project.title}
                    fill
                    className={cn(
                      "transition-transform duration-500 group-hover:scale-[1.03]",
                      portrait ? "object-contain p-4" : "object-cover object-top"
                    )}
                    sizes="(min-width:1024px) 400px, (min-width:768px) 50vw, 100vw"
                  />
                </button>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display text-lg font-bold text-primary">{project.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">{project.description}</p>
                  {project.tech && <p className="mt-3 font-mono text-xs text-muted">{project.tech}</p>}
                  <button
                    type="button"
                    onClick={() => setLightbox({ project, index: 0 })}
                    className="mt-auto inline-flex items-center gap-2 self-start pt-5 text-sm font-semibold text-primary transition-colors hover:text-accent"
                  >
                    <Images className="h-4 w-4 text-accent" /> View screenshots
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${lightbox.project.title} screenshots`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/90 px-3 backdrop-blur-sm sm:px-8"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between text-white">
              <span className="font-display text-lg font-bold">{lightbox.project.title}</span>
              <span className="text-sm text-white/70">
                {lightbox.index + 1} / {lightbox.project.images.length}
              </span>
            </div>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-white">
              <Image
                src={lightbox.project.images[lightbox.index]}
                alt={`${lightbox.project.title} screenshot ${lightbox.index + 1}`}
                fill
                className="object-contain"
                sizes="(min-width:1280px) 1000px, 100vw"
              />
            </div>
            <button
              type="button"
              onClick={() => step(-1)}
              className="absolute left-2 top-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-lg sm:-left-6"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="absolute right-2 top-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-lg sm:-right-6"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
