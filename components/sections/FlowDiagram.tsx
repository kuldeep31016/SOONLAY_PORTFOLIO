import { cn } from "@/lib/utils"

export function FlowDiagram({ steps }: { steps: string[] }) {
  const perRow = steps.length > 4 ? 3 : steps.length
  const cols = perRow === 3 ? "lg:grid-cols-3" : perRow === 4 ? "lg:grid-cols-4" : "lg:grid-cols-2"

  return (
    <ol className={cn("grid gap-y-6 lg:gap-x-12 lg:gap-y-10", cols)}>
      {steps.map((step, index) => {
        const lastInRow = (index + 1) % perRow === 0 || index === steps.length - 1
        const isLast = index === steps.length - 1
        return (
          <li key={step} data-reveal className="relative">
            <div className="flex items-center gap-4 rounded-2xl bg-surface px-5 py-5 shadow-[0_1px_2px_rgba(28,24,16,0.04)] ring-1 ring-border lg:flex-col lg:items-start lg:gap-5 lg:px-6 lg:py-6">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-semibold text-accent-2">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-lg font-semibold leading-snug text-primary lg:text-xl">{step}</span>
            </div>

            {!lastInRow && (
              <span aria-hidden className="flow-link absolute left-full top-1/2 hidden h-px w-12 -translate-y-1/2 bg-border-bright lg:block">
                <span className="flow-pulse" style={{ animationDelay: `${index * 0.35}s` }} />
              </span>
            )}
            {!isLast && (
              <span aria-hidden className="flow-link absolute left-10 top-full block h-6 w-px bg-border-bright lg:hidden">
                <span className="flow-pulse flow-pulse-y" style={{ animationDelay: `${index * 0.35}s` }} />
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}
