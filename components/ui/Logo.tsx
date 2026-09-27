import Image from "next/image"
import { cn } from "@/lib/utils"

export function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.png"
        alt=""
        width={36}
        height={36}
        priority={priority}
        className="h-9 w-9 rounded-lg"
      />
      <span className="font-display text-xl font-medium tracking-tight text-primary">Soonlay</span>
    </span>
  )
}
