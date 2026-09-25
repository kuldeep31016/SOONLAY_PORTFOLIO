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
      <main className="flex flex-1 items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="card-surface w-full max-w-lg bg-surface/80 p-8 text-center sm:p-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="mt-5 font-display text-2xl text-primary">
            We couldn&apos;t load the careers page
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-secondary">
            Something went wrong while loading open positions. Please try again.
          </p>
          <Button className="mt-6" onClick={reset} showArrow>
            Try again
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
