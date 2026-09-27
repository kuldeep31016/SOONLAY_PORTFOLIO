import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ButtonLinkProps {
  href: string
  children: ReactNode
  variant?: "primary" | "secondary" | "light"
  arrow?: boolean
  icon?: ReactNode
  className?: string
}

const variants = {
  primary: "bg-accent-2 text-ink shadow-lg shadow-black/10 hover:bg-accent-2/85",
  secondary: "border border-border-bright glass text-primary hover:border-primary/40",
  light: "bg-accent-2 text-ink hover:bg-accent-2/85"
}

export function ButtonLink({ href, children, variant = "primary", arrow, icon, className }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-[15px] font-semibold transition-colors",
        variants[variant],
        className
      )}
    >
      {icon}
      {children}
      {arrow && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
    </Link>
  )
}
