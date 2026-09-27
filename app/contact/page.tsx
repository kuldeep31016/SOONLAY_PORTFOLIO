import { Clock, Mail, MapPin } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { StartProjectFlow } from "@/components/leads/StartProjectFlow"
import { NextSteps } from "@/components/leads/NextSteps"
import { Highlight, PageHero } from "@/components/ui/PageHero"
import { pageMetadata } from "@/lib/metadata"
import { CONTACT_EMAIL, LOCATION } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Contact Us — Discuss Your Software Project",
  description:
    "Talk to Soonlay about your web app, mobile app, SaaS or custom software project. Share your idea and get a reviewed project plan within one business day.",
  path: "/contact"
})

const channels = [
  { icon: Mail, label: "Email us", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: MapPin, label: "Based in", value: `${LOCATION} · Remote-first` },
  { icon: Clock, label: "Response time", value: "Within one business day" }
]

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <PageHero
          badge="Contact"
          title={
            <>
              Let&apos;s talk about <Highlight>your project</Highlight>
            </>
          }
          description="Tell us what you want to build below. For partnerships, press or anything else, email us directly."
        >
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {channels.map((channel) => {
              const content = (
                <>
                  <channel.icon className="h-5 w-5 flex-shrink-0 text-accent sm:mb-3" strokeWidth={1.6} />
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-muted">{channel.label}</span>
                    <span className="mt-1 block text-sm font-semibold text-primary">{channel.value}</span>
                  </span>
                </>
              )
              return channel.href ? (
                <a key={channel.label} href={channel.href} className="flex items-center gap-4 rounded-xl border border-border glass p-4 transition-colors hover:border-accent/40 sm:block sm:p-5">
                  {content}
                </a>
              ) : (
                <div key={channel.label} className="flex items-center gap-4 rounded-xl border border-border glass p-4 sm:block sm:p-5">
                  {content}
                </div>
              )
            })}
          </div>
        </PageHero>
        <section className="bg-background py-14 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
            <div className="rounded-2xl border border-border glass p-5 shadow-sm sm:p-8">
              <StartProjectFlow source="contact-page" />
            </div>
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <NextSteps />
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
