import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function CareersNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg text-center">
          <p className="font-mono text-xs uppercase tracking-wide text-accent">
            404
          </p>
          <h1 className="mt-4 font-display text-3xl tracking-tight text-primary sm:text-4xl">
            Position not found
          </h1>
          <p className="mt-3 text-sm text-secondary">
            This position is not available. Browse the current open positions
            at Soonlay.
          </p>
          <Link
            href="/careers"
            className="mt-6 inline-flex items-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-accent/90"
          >
            View open positions
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
