import Link from "next/link"
import { ArrowRight, Mail, Plus } from "lucide-react"
import { JsonLd } from "@/components/ui/JsonLd"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { faqSchema } from "@/lib/schema"
import { CONTACT_EMAIL } from "@/lib/site"

interface FaqProps {
  items: { question: string; answer: string }[]
  compact?: boolean
  heading?: string
}

function Accordion({ items }: { items: FaqProps["items"] }) {
  return (
    <div data-reveal className="divide-y divide-border rounded-2xl border border-border bg-surface">
      {items.map((item) => (
        <details key={item.question} className="group px-6 py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[15px] font-semibold text-primary sm:text-base [&::-webkit-details-marker]:hidden">
            {item.question}
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-border text-secondary transition-transform group-open:rotate-45 group-open:border-accent group-open:text-accent">
              <Plus className="h-4 w-4" />
            </span>
          </summary>
          <p className="mt-3 pr-10 text-sm leading-relaxed text-secondary sm:text-[15px]">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}

export function Faq({ items, compact, heading = "Questions we get asked a lot" }: FaqProps) {
  if (compact) {
    return (
      <section className="py-12">
        <JsonLd data={faqSchema(items)} />
        <h2 className="mb-6 font-display text-2xl font-bold tracking-[-0.02em] text-primary">Frequently asked questions</h2>
        <Accordion items={items} />
      </section>
    )
  }

  return (
    <section className="bg-background py-20 md:py-24">
      <JsonLd data={faqSchema(items)} />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-16 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            badge="FAQ"
            heading={heading}
            subheading="Straight answers about cost, timelines, ownership and how we work."
          />
          <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
            <p className="font-semibold text-primary">Still have a question?</p>
            <p className="mt-1 text-sm text-secondary">We usually reply within one business day.</p>
            <div className="mt-5 flex flex-col gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent"
              >
                <Mail className="h-4 w-4 text-accent" /> {CONTACT_EMAIL}
              </a>
              <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                Contact us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        <Accordion items={items} />
      </div>
    </section>
  )
}
