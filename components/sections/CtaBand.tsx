"use client"

import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { useContactModal } from "@/components/layout/ContactModalContext"
import { Badge } from "@/components/ui/Badge"
import type { ProductType } from "@/lib/leads/options"

interface CtaBandProps {
  heading?: string
  body?: string
  source: string
  type?: ProductType
}

const promises = [
  "Free draft project plan in 2 minutes",
  "Reviewed by our team within one business day",
  "Written scope and price before any work starts"
]

export function CtaBand({
  heading = "Have a product or business problem in mind?",
  body = "Describe it in a few sentences. You'll get a draft plan and a preliminary estimate right away — then a person on our team reviews it and gets back to you.",
  source,
  type
}: CtaBandProps) {
  const { openModal } = useContactModal()
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-white sm:px-12 lg:px-16 lg:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(242,194,48,0.18),transparent_55%)]"
          />
          <div className="relative grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <Badge tone="dark" className="mb-6">
                Start a project
              </Badge>
              <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-[-0.025em] sm:text-4xl lg:text-[2.75rem]">
                {heading}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{body}</p>
            </div>
            <div className="lg:justify-self-end">
              <ul className="mb-8 space-y-3">
                {promises.map((promise) => (
                  <li key={promise} className="flex items-center gap-3 text-sm text-white/85">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-2/25 text-accent-2">
                      <Check className="h-3 w-3" />
                    </span>
                    {promise}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => openModal({ source, type })}
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-3.5 text-[15px] font-semibold text-primary transition-colors hover:bg-white/90"
                >
                  Start Your Project
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <Link
                  href="/work"
                  className="inline-flex items-center justify-center rounded-lg border border-white/25 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-white/60"
                >
                  See Our Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
