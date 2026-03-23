"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { Button } from "@/components/ui/Button"

interface ContactModalContextType {
  openModal: () => void
  closeModal: () => void
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined)

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [showContact, setShowContact] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [projectTitle, setProjectTitle] = useState("")
  const [description, setDescription] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openModal = () => {
    setShowContact(true)
    setMessage(null)
  }

  const closeModal = () => {
    setShowContact(false)
    setFullName("")
    setEmail("")
    setProjectTitle("")
    setDescription("")
    setMessage(null)
  }

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !projectTitle.trim() || !description.trim()) {
      setMessage("Please fill in all mandatory fields.")
      return
    }

    setIsSubmitting(true)
    setMessage("Sending your inquiry...")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          projectTitle: projectTitle.trim(),
          message: description.trim(),
        }),
      })

      if (response.ok) {
        setMessage("Inquiry sent successfully!")
        setTimeout(() => {
          closeModal()
        }, 2000)
      } else {
        const data = await response.json()
        setMessage(data.error || "Failed to send inquiry.")
      }
    } catch (error) {
      console.error("Submission error:", error)
      setMessage("An error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ContactModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {showContact && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-border bg-surface/95 p-8 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg text-primary">
                Tell us about your project
              </h2>
              <button
                className="text-secondary hover:text-primary"
                onClick={closeModal}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <label className="mb-1 block text-xs font-medium text-secondary">
                  Your Name<span className="text-accent">*</span>
                </label>
                <input
                  className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-primary outline-none focus:border-accent"
                  placeholder="e.g. John Doe"
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-secondary">
                  Email Address<span className="text-accent">*</span>
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-primary outline-none focus:border-accent"
                  placeholder="e.g. john@example.com"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-secondary">
                  Project Title<span className="text-accent">*</span>
                </label>
                <input
                  className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-primary outline-none focus:border-accent"
                  placeholder="e.g. Telemedicine platform for clinics"
                  required
                  value={projectTitle}
                  onChange={(event) => setProjectTitle(event.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-secondary">
                  Project Summary<span className="text-accent">*</span>
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-primary outline-none focus:border-accent"
                  placeholder="Share anything that helps us understand your idea or stage."
                  required
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              {message && (
                <p className="text-xs text-accent">{message}</p>
              )}
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </Button>
              </div>
            </div>
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
