import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { AboutHero } from "@/components/sections/AboutHero"
import { CtaBand } from "@/components/sections/CtaBand"
import { HowWeWork } from "@/components/sections/HowWeWork"
import { PortfolioSection } from "@/components/sections/Portfolio"
import { pageMetadata } from "@/lib/metadata"

export const metadata = pageMetadata({
  title: "About Us — Product Development Studio in Bangalore",
  description:
    "Soonlay is a Bangalore-based, remote-first product development studio that helps founders and businesses turn ideas into production-ready web, mobile, SaaS and AI products.",
  path: "/about"
})

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <AboutHero />
        <HowWeWork />
        <PortfolioSection />
        <CtaBand source="about" />
      </main>
      <Footer />
    </div>
  )
}
