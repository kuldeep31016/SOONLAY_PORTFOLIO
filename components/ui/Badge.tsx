import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface BadgeProps {
  children: ReactNode
  className?: string
  tone?: "light" | "dark"
}

export function Badge({ children, className, tone = "light" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em]",
        tone === "dark" ? "text-white/70" : "text-secondary",
        className
      )}
    >
      <span aria-hidden className={cn("h-px w-8", tone === "dark" ? "bg-accent-2" : "bg-accent")} />
      {children}
    </span>
  )
}
