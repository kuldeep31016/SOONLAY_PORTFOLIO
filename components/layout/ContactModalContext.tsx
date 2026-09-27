"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { X } from "lucide-react"
import { StartProjectFlow } from "@/components/leads/StartProjectFlow"
import type { ProductType } from "@/lib/leads/options"

interface OpenOptions {
  type?: ProductType
  source?: string
}

interface ContactModalContextType {
  openModal: (options?: OpenOptions) => void
  closeModal: () => void
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined)

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<OpenOptions | null>(null)
  const [instance, setInstance] = useState(0)

  const openModal = useCallback((options: OpenOptions = {}) => {
    setInstance((value) => value + 1)
    setOpen(options)
  }, [])

  const closeModal = useCallback(() => setOpen(null), [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKey)
    }
  }, [open, closeModal])

  return (
    <ContactModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/75 px-3 py-6 sm:items-center sm:px-4"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Start a project with Soonlay"
            className="relative w-full max-w-3xl rounded-2xl border border-border bg-surface p-5 shadow-xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full p-1 text-secondary hover:text-primary"
              onClick={closeModal}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <StartProjectFlow
              key={instance}
              initialType={open.type ?? null}
              source={open.source}
              onDone={closeModal}
            />
          </div>
        </div>
      )}
    </ContactModalContext.Provider>
  )
}

export function useContactModal() {
  const context = useContext(ContactModalContext)
  if (context === undefined) {
    throw new Error("useContactModal must be used within a ContactModalProvider")
  }
  return context
}
