import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { StartProjectFlow } from "@/components/leads/StartProjectFlow"
import { NextSteps } from "@/components/leads/NextSteps"
import { Highlight, PageHero } from "@/components/ui/PageHero"
import { pageMetadata } from "@/lib/metadata"
import { isProductType } from "@/lib/leads/options"

export const metadata = pageMetadata({
  title: "Start a Project — Free Project Plan & Estimate",
  description:
    "Describe your app, website or software idea and get a draft project plan with user roles, core modules, MVP scope and a preliminary estimate. Reviewed by our team within one business day.",
  path: "/start-project"
})

export default async function StartProjectPage({
  searchParams
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type } = await searchParams
  const initialType = isProductType(type) ? type : null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <PageHero
          size="md"
          badge="Start a project"
          title={
            <>
              Tell us what you <Highlight>want to build</Highlight>
            </>
          }
          description="Answer a few questions and get a draft project plan — user roles, core modules, MVP scope and a preliminary estimate. Our team reviews it and replies within one business day."
        />
        <section className="bg-background py-12 md:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8">
              <StartProjectFlow initialType={initialType} source="start-project-page" />
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
