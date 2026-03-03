"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Eye } from "lucide-react"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { cn } from "@/lib/utils"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 }
  }
}

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
  }
}

export type ProjectCategory = "all" | "web" | "saas" | "ai" | "mobile"

type Project = {
  title: string
  description: string
  tags: string[]
  tech: string
  category: ProjectCategory
  images: string[]
}

const projects: Project[] = [
  {
    title: "AI Powered Healthcare System",
    description: "Telemedicine platform connecting doctors and patients in real time.",
    tags: ["Web App", "SaaS", "Healthcare"],
    tech: "React · Node.js · WhatsApp API",
    category: "ai" as ProjectCategory,
    images: [
      "/images/Telemedine-1.png",
      "/images/Telemedine-2.png",
      "/images/Telemedine-3.png"
    ]
  },
  {
    title: "Stock Management System",
    description: "Retail management dashboard for store owners and operators.",
    tags: ["Web", "Admin", "Retail"],
    tech: "React 19 · CoreUI · Redux",
    category: "web" as ProjectCategory,
    images: [
      "/images/mydukan-1.png",
      "/images/mydukan-2.png",
      "/images/mydukan-3.png"
    ]
  },
  {
    title: "Travel Booking Application",
    description: "AI chatbot that answers support questions on top of docs and tickets.",
    tags: ["AI", "Chatbot"],
    tech: "Next.js · LangChain · OpenAI",
    category: "web" as ProjectCategory,
    images: [
      "/images/travel-1.png",
      "/images/travel-2.png",
      "/images/travel-3.png"
    ]
  },
  {
    title: "Billing and Payments",
    description: "Metrics dashboard for tracking MRR, churn, and activation.",
    tags: ["SaaS", "Dashboard"],
    tech: "Typescript · Prisma · PostgreSQL",
    category: "saas" as ProjectCategory,
    images: [
      "/images/khaata-1.png",
      "/images/khaata-2.png",
      "/images/khaata-3.png"
    ]
  },
  {
    title: "Coupon management system",
    description: "Internal tool that automates repetitive back-office operations.",
    tags: ["Automation", "Internal Tools"],
    tech: "Compose Multiplatform · Cron.js · Firebase",
    category: "mobile" as ProjectCategory,
    images: [
      "/images/dealora-1.png",
      "/images/dealora-2.png",
      "/images/dealora-3.png"
    ]
  },
  {
    title: "Terminal Emulator & File System",
    description: "Android Native terminal emulator with integrated file system.",
    tags: ["Mobile", "B2C"],
    tech: "Kotlin · Jetpack Compose · Dependency Injection",
    category: "mobile" as ProjectCategory,
    images: [
      "/images/Betturmux-1.png",
      "/images/Betturmux-2.png",
      "/images/Betturmux-3.png"
    ]
  }
]

const filters: { id: ProjectCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "saas", label: "SaaS" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "ai", label: "AI" }
]

export function PortfolioSection({
  showCTA = false
}: {
  showCTA?: boolean
}) {
  const [activeFilter, setActiveFilter] = React.useState<ProjectCategory>("all")
  const [lightboxProject, setLightboxProject] = React.useState<Project | null>(
    null
  )
  const [lightboxIndex, setLightboxIndex] = React.useState(0)

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  const openLightbox = (project: Project) => {
    setLightboxProject(project)
    setLightboxIndex(0)
  }

  const closeLightbox = () => {
    setLightboxProject(null)
  }

  const stepLightbox = (direction: -1 | 1) => {
    if (!lightboxProject) return
    const total = lightboxProject.images.length
    if (!total) return
    setLightboxIndex((prev) => {
      const next = (prev + direction + total) % total
      return next
    })
  }

  return (
    <section className="border-t border-border/60 bg-background py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-10 md:mb-12"
        >
          <SectionHeading
            badge="Work"
            heading="Selected products we’ve shipped."
            subheading="Real products for real founders — from analytics dashboards to AI assistants."
            align="center"
          />
        </motion.div>

        <div className="mb-8 flex justify-center gap-2 text-xs">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "rounded-full border px-3 py-1 font-mono transition-colors",
                activeFilter === filter.id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-surface text-secondary hover:border-border-bright"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeFilter}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-3"
        >
          {filtered.map((project) => (
            <motion.article
              key={project.title}
              variants={cardVariant}
              className="card-surface card-hover-glow flex h-full flex-col overflow-hidden bg-surface/80"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={project.images[0]}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(min-width:1024px) 350px, (min-width:768px) 50vw, 100vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="mb-1 font-display text-base text-primary sm:text-lg">
                  {project.title}
                </h3>
                <p className="mb-3 text-xs text-secondary sm:text-sm">
                  {project.description}
                </p>
                <p className="mb-4 text-[0.7rem] font-mono text-muted">
                  {project.tech}
                </p>
                <div className="mt-auto flex items-center justify-between text-xs">
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface-2 px-2 py-0.5 text-[0.65rem] text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => openLightbox(project)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-accent/60 bg-surface text-accent hover:border-accent hover:bg-accent hover:text-black transition-colors"
                    aria-label={`View ${project.title} screenshots`}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {showCTA && (
          <div className="mt-12 text-center text-sm text-secondary">
            <p className="mb-4">
              Ready to add your product to this wall of shipped work?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-accent px-6 py-2 text-sm font-semibold text-black"
            >
              Start your project →
            </Link>
          </div>
        )}
        {lightboxProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-2 sm:px-6"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-4 top-4 text-secondary hover:text-primary"
              aria-label="Close"
            >
              ✕
            </button>
            <div
              className="relative flex w-full max-w-5xl flex-col items-center gap-3"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex w-full items-center justify-between text-xs text-secondary">
                <span className="font-display text-base text-accent sm:text-lg md:text-xl">
                  {lightboxProject.title}
                </span>
                <span className="text-muted">
                  {lightboxIndex + 1} / {lightboxProject.images.length}
                </span>
              </div>
              <div className="relative flex w-full items-center">
                <button
                  type="button"
                  onClick={() => stepLightbox(-1)}
                  className="absolute -left-3 sm:-left-12 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg hover:scale-105 transition-transform"
                  aria-label="Previous image"
                >
                  <span className="text-lg">‹</span>
                </button>
                <div className="relative mx-auto aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-2xl">
                  <Image
                    src={lightboxProject.images[lightboxIndex]}
                    alt={lightboxProject.title}
                    fill
                    className="object-contain"
                    sizes="(min-width:1280px) 900px, (min-width:768px) 80vw, 100vw"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => stepLightbox(1)}
                  className="absolute -right-3 sm:-right-12 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg hover:scale-105 transition-transform"
                  aria-label="Next image"
                >
                  <span className="text-lg">›</span>
                </button>
              </div>
              <div className="flex items-center justify-center gap-2">
                {lightboxProject.images.map((img, index) => (
                  <button
                    key={img + index.toString()}
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className={cn(
                      "h-2 w-2 rounded-full border border-border",
                      index === lightboxIndex
                        ? "bg-accent border-accent"
                        : "bg-surface-2"
                    )}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// minimal React import for useState without pulling full React types in the whole file
import * as React from "react"

