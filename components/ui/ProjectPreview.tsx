"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Looping, muted motion preview of a real project. Loads only when the card
 * scrolls near the viewport, pauses when it leaves, and stays a still poster
 * for visitors who prefer reduced motion.
 */
export function ProjectPreview({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [inView, setInView] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [still, setStill] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true)
      return
    }
    const video = ref.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setLoaded(true)
      },
      { rootMargin: "200px 0px", threshold: 0.15 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = ref.current
    if (!video || !loaded || still) return
    const sync = () => {
      if (inView && document.visibilityState === "visible") void video.play().catch(() => undefined)
      else video.pause()
    }
    sync()
    // Browsers pause video in background tabs; resume when the visitor comes back.
    document.addEventListener("visibilitychange", sync)
    return () => document.removeEventListener("visibilitychange", sync)
  }, [inView, loaded, still])

  return (
    <video
      ref={ref}
      src={loaded && !still ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 [transition-timing-function:var(--ease-spring)] group-hover:scale-[1.03]"
    />
  )
}
