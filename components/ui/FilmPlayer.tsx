"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ArrowRight, Play, RotateCcw, X } from "lucide-react"
import { useContactModal } from "@/components/layout/ContactModalContext"

const FILM_SRC = "/video/soonlay-film.mp4"
const FILM_POSTER = "/video/soonlay-film-poster.jpg"
const FILM_LENGTH = "0:27"

/** "Watch the film" trigger plus the full-screen player it opens. */
export function FilmPlayer() {
  const { openModal } = useContactModal()
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [ended, setEnded] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const close = useCallback(() => {
    setVisible(false)
    videoRef.current?.pause()
    window.setTimeout(() => {
      setOpen(false)
      setEnded(false)
      triggerRef.current?.focus()
    }, 300)
  }, [])

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => setVisible(true))
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKey)
    }
  }, [open, close])

  const replay = () => {
    const video = videoRef.current
    if (!video) return
    setEnded(false)
    video.currentTime = 0
    void video.play()
  }

  const startProject = () => {
    close()
    window.setTimeout(() => openModal({ source: "film-end" }), 320)
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="group inline-flex items-center gap-3.5 self-start py-1.5 text-base font-semibold text-primary"
      >
        <span className="film-ring relative flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/20 backdrop-blur-md transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:scale-110">
          <Play className="ml-0.5 h-4 w-4 fill-current text-accent-2" />
        </span>
        <span className="link-underline">Watch the film</span>
        <span className="text-sm font-normal tabular-nums text-muted">{FILM_LENGTH}</span>
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Soonlay brand film"
            onClick={close}
            className={`fixed inset-0 z-[60] flex items-center justify-center bg-[#030a09]/85 px-3 backdrop-blur-xl transition-opacity duration-300 sm:px-8 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close film"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-primary ring-1 ring-white/15 backdrop-blur-xl transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              onClick={(event) => event.stopPropagation()}
              className={`relative aspect-video w-full max-w-6xl overflow-hidden rounded-2xl bg-black shadow-[0_60px_140px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10 transition-transform duration-500 [transition-timing-function:var(--ease-spring)] sm:rounded-[1.75rem] ${
                visible ? "scale-100" : "scale-[0.96]"
              }`}
            >
              <video
                ref={videoRef}
                src={FILM_SRC}
                poster={FILM_POSTER}
                autoPlay
                controls
                playsInline
                preload="metadata"
                onEnded={() => setEnded(true)}
                onPlay={() => setEnded(false)}
                className="h-full w-full"
              />

              {ended && (
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-8 pt-24 sm:flex-row sm:justify-center sm:gap-5 sm:pb-12">
                  <button
                    type="button"
                    onClick={startProject}
                    className="group inline-flex items-center gap-4 rounded-full bg-accent-2 py-2 pl-6 pr-2 text-[15px] font-semibold text-ink"
                  >
                    Start a Project
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-accent-2 transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:translate-x-0.5">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={replay}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-[15px] font-medium text-primary ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-white/15"
                  >
                    <RotateCcw className="h-4 w-4" /> Watch again
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
