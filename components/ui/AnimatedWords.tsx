import { Fragment } from "react"
import { cn } from "@/lib/utils"

type Segment = { text: string; className?: string }

interface AnimatedWordsProps {
  lines: Segment[][]
  baseDelay?: number
  step?: number
}

export function AnimatedWords({ lines, baseDelay = 150, step = 70 }: AnimatedWordsProps) {
  let index = 0
  return (
    <>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line.map((segment, segmentIndex) =>
            segment.text.split(" ").filter(Boolean).map((word, wordIndex) => {
              const delay = baseDelay + index++ * step
              return (
                <Fragment key={`${segmentIndex}-${wordIndex}`}>
                  <span className="-mr-[0.14em] inline-block overflow-hidden pb-[0.12em] pr-[0.14em] align-bottom">
                    <span className={cn("word-rise inline-block", segment.className)} style={{ animationDelay: `${delay}ms` }}>
                      {word}
                    </span>
                  </span>{" "}
                </Fragment>
              )
            })
          )}
        </span>
      ))}
    </>
  )
}
