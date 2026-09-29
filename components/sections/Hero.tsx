"use client"

import Image from "next/image"
import { ArrowRight, Briefcase, Cpu, Globe, Layers, Smartphone } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { AnimatedWords } from "@/components/ui/AnimatedWords"
import { FilmPlayer } from "@/components/ui/FilmPlayer"
import { useContactModal } from "@/components/layout/ContactModalContext"

const capabilities = [
  { label: "Web Applications", icon: Globe },
  { label: "Mobile Apps", icon: Smartphone },
  { label: "SaaS Platforms", icon: Layers },
  { label: "Business Software", icon: Briefcase },
  { label: "AI Products", icon: Cpu }
]

export function Hero() {
  const { openModal } = useContactModal()

  return (
    <section className="relative isolate overflow-hidden bg-background text-primary">
      <div aria-hidden className="hero-portrait pointer-events-none absolute inset-0 -z-10 opacity-50 lg:opacity-100">
        <Image
          src="/images/hero-bg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[74%_center] lg:object-[68%_center]"
        />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-background/80 via-background/30 to-transparent lg:from-background/60 lg:via-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col px-4 pt-24 sm:px-6 lg:px-8">
        <div className="relative flex flex-1 flex-col justify-center py-12 lg:py-16">
          <div className="hero-fade" style={{ animationDelay: "60ms" }}>
            <Badge tone="dark">Product Development Studio</Badge>
          </div>

          <h1 className="mt-8 max-w-4xl font-display text-[3rem] font-medium leading-[1.02] tracking-[-0.03em] text-primary sm:text-[4.5rem] lg:text-[clamp(4.5rem,min(7.4vw,12vh),7.25rem)]">
            <AnimatedWords
              lines={[
                [{ text: "Turning ideas" }],
                [{ text: "into" }, { text: "real products.", className: "accent-serif" }]
              ]}
            />
          </h1>

          <p className="hero-fade mt-7 max-w-xl text-base leading-relaxed text-secondary sm:text-lg" style={{ animationDelay: "650ms" }}>
            Soonlay is a product development studio. We design, build and scale web applications, mobile apps, SaaS
            platforms and AI-powered software for startups and growing businesses.
          </p>

          <div className="hero-fade mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8" style={{ animationDelay: "780ms" }}>
            <button
              type="button"
              onClick={() => openModal({ source: "home-hero" })}
              className="group inline-flex items-center justify-between gap-5 self-start rounded-full bg-accent-2 py-2 pl-7 pr-2 text-base font-semibold text-ink shadow-[0_18px_50px_-18px_rgba(159,230,205,0.65)] transition-transform duration-500 [transition-timing-function:var(--ease-spring)] active:scale-[0.98]"
            >
              Start Your Project
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-accent-2 transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:translate-x-1 group-hover:-translate-y-px group-hover:scale-105">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
            <FilmPlayer />
          </div>

          <p
            aria-hidden
            className="hero-fade absolute right-0 top-[22%] hidden text-[11px] font-medium uppercase leading-[1.9] tracking-[0.3em] text-secondary lg:block"
            style={{ animationDelay: "1s" }}
          >
            <span className="mb-3 block h-px w-8 bg-secondary/60" />
            Ideas
            <br />
            Products
            <br />
            People
          </p>
        </div>

        <div className="hero-fade flex flex-col gap-6 border-t border-white/10 py-7 lg:flex-row lg:items-center" style={{ animationDelay: "950ms" }}>
          <div className="flex items-center gap-4 lg:border-r lg:border-white/10 lg:pr-10">
            <span className="font-display text-5xl font-medium tracking-[-0.03em] text-accent-2">20+</span>
            <span className="text-sm leading-snug text-secondary">
              projects designed,
              <br />
              built and shipped
            </span>
          </div>
          <ul className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:flex lg:justify-between lg:pl-4">
            {capabilities.map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-sm leading-snug text-secondary">
                <item.icon className="h-5 w-5 flex-shrink-0 text-primary/80" strokeWidth={1.4} />
                <span className="max-w-[6.5rem]">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
