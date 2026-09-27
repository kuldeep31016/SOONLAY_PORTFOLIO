import type { Metadata } from "next"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { PortfolioSection } from "@/components/sections/Portfolio"
import { CtaBand } from "@/components/sections/CtaBand"
import { ButtonLink } from "@/components/ui/ButtonLink"
import { Highlight, PageHero } from "@/components/ui/PageHero"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Our Work — Apps, Platforms & Systems We've Built",
  description:
    "Web apps, mobile apps and business systems built by Soonlay: telemedicine, retail stock management, billing and invoicing, coupon savings, travel booking and more.",
  path: "/work"
})

export default function WorkPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <PageHero
          badge="Our Work"
          title={
            <>
              Products we&apos;ve <Highlight>designed and built</Highlight>
            </>
          }
          description="A selection of web apps, mobile apps and business systems — from telemedicine and retail stock management to billing, coupon savings and travel booking."
          actions={
            <ButtonLink href="/start-project" arrow>
              Start Your Project
            </ButtonLink>
          }
        />
        <PortfolioSection variant="page" />
        <CtaBand
          source="work-page"
          heading="Want your product on this list?"
          body="Tell us what you're building. You'll get a draft plan and preliminary estimate right away, reviewed by our team within one business day."
        />
      </main>
      <Footer />
    </div>
  )
}
