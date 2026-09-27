import { SearchX } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Badge } from "@/components/ui/Badge"
import { ButtonLink } from "@/components/ui/ButtonLink"

export default function CareersNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg rounded-2xl border border-border glass p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-white/[0.06] text-accent">
            <SearchX className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />
          </div>
          <Badge className="mt-6">Error 404</Badge>
          <h1 className="mt-4 font-display text-3xl font-medium tracking-[-0.025em] text-primary sm:text-4xl">
            Position not found
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-secondary sm:text-base">
            This position is not available. Browse the current open positions
            at Soonlay.
          </p>
          <ButtonLink href="/careers" arrow className="mt-7">
            View open positions
          </ButtonLink>
        </div>
      </main>
      <Footer />
    </div>
  )
}
