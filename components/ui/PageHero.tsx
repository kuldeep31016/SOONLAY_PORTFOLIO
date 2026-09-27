import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"

interface PageHeroProps {
  badge: string
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  aside?: ReactNode
  breadcrumbs?: { name: string; href: string }[]
  children?: ReactNode
  size?: "lg" | "md"
}

export function PageHero({
  badge,
  title,
  description,
  actions,
  aside,
  breadcrumbs,
  children,
  size = "lg"
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_0%,rgba(143,220,194,0.1),transparent_55%)]"
      />
      <div
        className={cn(
          "relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:px-8",
          size === "lg" ? "py-16 lg:py-20" : "py-12 lg:py-14",
          aside && "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-16"
        )}
      >
        <div>
          {breadcrumbs && (
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
                {breadcrumbs.map((crumb, index) => (
                  <li key={crumb.href} className="flex items-center gap-1.5">
                    {index > 0 && <ChevronRight className="h-3 w-3" />}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="text-secondary">{crumb.name}</span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-primary">
                        {crumb.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <Badge className="mb-6">{badge}</Badge>
          <h1
            className={cn(
              "font-display font-medium tracking-[-0.035em] text-primary",
              size === "lg" ? "text-[2.5rem] sm:text-5xl lg:text-6xl" : "text-[2.2rem] sm:text-5xl",
              "leading-[1.08]"
            )}
          >
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">{description}</p>
          )}
          {actions && <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">{actions}</div>}
          {children}
        </div>
        {aside && <div>{aside}</div>}
      </div>
    </section>
  )
}

export function Highlight({ children }: { children: ReactNode }) {
  return <span className="accent-serif">{children}</span>
}
