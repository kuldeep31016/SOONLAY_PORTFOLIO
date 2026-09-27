"use client"

import Link from "next/link"
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { AnimatedWords } from "@/components/ui/AnimatedWords"
import { SilkBackground } from "@/components/ui/SilkBackground"
import { useContactModal } from "@/components/layout/ContactModalContext"

const capabilities = ["Web Applications", "Mobile Apps", "SaaS Platforms", "Business Software", "AI Products"]

export function Hero() {
  const { openModal } = useContactModal()

  return (
    <section className="relative isolate overflow-hidden bg-[#12100A] pt-16 text-white">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_45%,rgba(242,194,48,0.18),transparent_60%)]"
      />
      <SilkBackground className="absolute inset-0 -z-10 h-full w-full opacity-0 transition-opacity duration-[1600ms] data-[ready=true]:opacity-100" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-[#12100A] to-transparent" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[#12100A]/55 lg:hidden" />
      <div aria-hidden className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_48%_42%_at_50%_52%,rgba(18,16,10,0.72),rgba(18,16,10,0.25)_70%,transparent)] lg:block" />

      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 flex-col items-center justify-center py-14 text-center lg:py-16 [@media(min-width:1024px)_and_(max-height:800px)]:py-8">
          <div className="hero-fade flex justify-center" style={{ animationDelay: "60ms" }}>
            <Badge tone="dark">Product Development Studio</Badge>
          </div>

          <h1 className="mx-auto mt-8 max-w-5xl font-display text-[3.1rem] font-semibold leading-[1] tracking-[-0.035em] sm:text-[5rem] lg:text-[clamp(4.2rem,min(8vw,12.5vh),8rem)]">
            <AnimatedWords
              lines={[
                [{ text: "Turning ideas" }],
                [{ text: "into" }, { text: "real products.", className: "font-normal italic text-accent-2" }]
              ]}
            />
          </h1>

          <p className="hero-fade mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg" style={{ animationDelay: "650ms" }}>
            Soonlay is a product development studio. We design, build and scale web applications, mobile apps,
            SaaS platforms and AI-powered software for startups and growing businesses.
          </p>

          <div className="hero-fade mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6" style={{ animationDelay: "780ms" }}>
            <button
              type="button"
              onClick={() => openModal({ source: "home-hero" })}
              className="group inline-flex items-center justify-between gap-4 rounded-full bg-accent-2 py-2 pl-7 pr-2 text-base font-semibold text-primary shadow-[0_20px_50px_-20px_rgba(242,194,48,0.7)] transition-transform duration-500 [transition-timing-function:var(--ease-spring)] active:scale-[0.98]"
            >
              Start Your Project
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-accent-2 transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:translate-x-1 group-hover:-translate-y-px group-hover:scale-105">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 py-3 text-base font-semibold text-white"
            >
              <span className="link-underline after:bg-white">See Our Work</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="hero-fade flex flex-col gap-5 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between" style={{ animationDelay: "950ms" }}>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold text-accent-2">20+</span>
            <span className="text-sm text-white/70">projects designed, built and shipped</span>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60">
            {capabilities.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent-2" />
                {item}
              </li>
            ))}
          </ul>
          <span className="hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 lg:flex">
            Scroll <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
          </span>
        </div>
      </div>
    </section>
  )
}
