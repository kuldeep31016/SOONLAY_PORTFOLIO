import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import { ButtonHTMLAttributes, ReactNode } from "react"

type Variant = "primary" | "secondary" | "ghost" | "outline"
type Size = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
  showArrow?: boolean
}

const baseClasses =
  "inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-black font-semibold rounded-full hover:bg-accent/90",
  secondary:
    "bg-surface border border-border text-primary rounded-full hover:border-border-bright",
  ghost:
    "bg-transparent text-secondary rounded-full hover:bg-surface/60 hover:text-primary",
  outline:
    "bg-transparent border border-border text-primary rounded-full hover:border-border-bright"
}

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base"
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  showArrow,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={props.type ?? "button"} className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      <span className={cn("inline-flex items-center gap-2")}>
        <span>{children}</span>
        {showArrow && !loading && (
          <ArrowRight className="h-4 w-4 translate-x-0 transition-transform group-hover:translate-x-0.5" />
        )}
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background" />
        )}
      </span>
    </button>
  )
}

