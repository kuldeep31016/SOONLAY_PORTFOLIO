"use client"

import { AlertTriangle } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"

interface CareersErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function CareersError({ reset }: CareersErrorProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface-2 text-accent">
            <AlertTriangle className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold tracking-[-0.02em] text-primary">
            We couldn&apos;t load the careers page
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-secondary sm:text-base">
            Something went wrong while loading open positions. Please try again.
          </p>
          <Button className="mt-7" size="lg" onClick={reset} showArrow>
            Try again
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
