import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"

interface SectionHeadingProps {
  badge?: string
  heading: ReactNode
  subheading?: ReactNode
  align?: "left" | "center" | "split"
  action?: { label: string; href: string }
  as?: "h1" | "h2"
}

export function SectionHeading({
  badge,
  heading,
  subheading,
  align = "left",
  action,
  as: Tag = "h2"
}: SectionHeadingProps) {
  const title = (
    <Tag className="font-display text-3xl font-bold leading-[1.1] tracking-[-0.025em] text-primary sm:text-4xl lg:text-[2.75rem]">
      {heading}
    </Tag>
  )
  const actionLink = action && (
    <Link
      href={action.href}
      className="inline-flex items-center gap-2 border-b-2 border-accent pb-1 text-sm font-semibold text-primary transition-colors hover:text-accent"
    >
      {action.label} <ArrowRight className="h-4 w-4" />
    </Link>
  )

  if (align === "split") {
    return (
      <div data-reveal className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
        <div>
          {badge && <Badge className="mb-5">{badge}</Badge>}
          {title}
        </div>
        {(subheading || actionLink) && (
          <div>
            {subheading && <p className="mb-5 text-base leading-relaxed text-secondary sm:text-lg">{subheading}</p>}
            {actionLink}
          </div>
        )}
      </div>
    )
  }

  return (
    <div data-reveal className={cn("flex flex-col gap-5", align === "center" ? "items-center text-center" : "items-start")}>
      {badge && <Badge>{badge}</Badge>}
      {title}
      {subheading && (
        <p className="max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">{subheading}</p>
      )}
      {actionLink}
    </div>
  )
}
