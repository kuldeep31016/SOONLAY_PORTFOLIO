import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { PageHero } from "@/components/ui/PageHero"
import { pageMetadata } from "@/lib/metadata"
import { CONTACT_EMAIL } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Soonlay collects, uses and protects the information you share through soonlay.tech.",
  path: "/privacy"
})

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "What we collect",
    body: [
      "Project enquiries: when you use our project form, we collect the answers you give (what you want to build, users, features, timeline, budget range) and your contact details (name, email, and optionally company, website and phone number).",
      "Job applications: when you apply through our careers page, we collect your name, email, area of interest, optional portfolio link, message and resume. The resume is emailed to our hiring team and is not processed by any AI service. Some roles link to an external application page instead.",
      "Usage analytics: we use Vercel Analytics to understand which pages are visited and which buttons are used. It does not use cookies and does not identify you personally."
    ]
  },
  {
    heading: "How we use it",
    body: [
      "We use project enquiry details only to reply to you, prepare a project plan and proposal, and keep a record of our conversation. We do not sell your information or add you to marketing lists without your consent."
    ]
  },
  {
    heading: "AI processing",
    body: [
      "To draft a preliminary project brief, the project description and answers you enter are sent to an AI model provider (Groq). Please do not include confidential information you are not comfortable sharing at this stage. Every AI-generated brief is reviewed by a person on our team."
    ]
  },
  {
    heading: "Where it is stored",
    body: [
      "Enquiries are stored in Google Cloud Firestore and delivered to our team by email. Access is limited to the Soonlay team members who handle enquiries."
    ]
  },
  {
    heading: "How long we keep it",
    body: [
      "We keep enquiry records for as long as needed to respond and manage any resulting project, and delete them on request."
    ]
  },
  {
    heading: "Your choices",
    body: [
      `You can ask us to access, correct or delete your information at any time by emailing ${CONTACT_EMAIL}.`
    ]
  }
]

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <PageHero
          size="md"
          badge="Legal"
          title="Privacy Policy"
          description="How Soonlay collects, uses and protects the information you share through this website. Last updated 26 September 2026."
        />
        <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {sections.map((section) => (
              <section key={section.heading} className="rounded-2xl border border-border glass p-6 sm:p-7">
                <h2 className="mb-2 font-display font-medium text-lg text-primary">{section.heading}</h2>
                <div className="space-y-3 text-sm leading-relaxed text-secondary sm:text-base">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
