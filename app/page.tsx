import { Navbar } from "@/components/layout/Navbar"
import { Hero } from "@/components/sections/Hero"
import { PortfolioSection } from "@/components/sections/Portfolio"
import { ServicesOverview } from "@/components/sections/ServicesOverview"
import { HowWeWork } from "@/components/sections/HowWeWork"
import { Faq } from "@/components/sections/Faq"
import { CtaBand } from "@/components/sections/CtaBand"
import { Footer } from "@/components/layout/Footer"
import { homeFaqs } from "@/lib/faq"
import { pageMetadata } from "@/lib/metadata"

export const metadata = pageMetadata({
  title: "Soonlay — Custom Software, App & SaaS Development Studio in India",
  description:
    "Soonlay designs and builds web apps, mobile apps, SaaS platforms, AI features and custom business software for startups and growing businesses. Get a free project plan and preliminary estimate.",
  path: "/",
  absoluteTitle: true
})

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ServicesOverview />
        <PortfolioSection />
        <HowWeWork />
        <Faq items={homeFaqs} />
        <CtaBand source="home-bottom" />
      </main>
      <Footer />
    </div>
  )
}
