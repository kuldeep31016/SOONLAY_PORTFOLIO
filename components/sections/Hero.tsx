"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { AnimatedText } from "@/components/ui/AnimatedText"
import { cn } from "@/lib/utils"
import { ReactNode, useEffect, useState } from "react"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

function FloatingOrb({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute h-64 w-64 rounded-full bg-accent/8 blur-3xl",
        className
      )}
    />
  )
}

export function Hero() {
  const [progress, setProgress] = useState(0)
  const [showContact, setShowContact] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [projectTitle, setProjectTitle] = useState("")
  const [description, setDescription] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight
      if (total <= 0) return
      setProgress(window.scrollY / total)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section className="relative isolate overflow-hidden bg-gradient-dark">
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${progress})` }}
      />
      <div className="mesh-gradient" />
      <FloatingOrb className="top-[-6rem] left-[-4rem]" />
      <FloatingOrb className="bottom-[-8rem] right-[-4rem]" />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center px-4 pt-32 pb-16 sm:px-6 lg:px-8 lg:pt-40 lg:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-6 flex justify-center"
          >
            <Badge>Product Development Studio</Badge>
          </motion.div>

          <h1 className="mb-6 font-display text-[2.6rem] leading-tight tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl">
            <AnimatedText text="We Build" className="block" delay={0.1} />
            <span className="mt-1 block gradient-text">
              <AnimatedText
                text="What Founders Imagine"
                delay={0.3}
                className="block"
              />
            </span>
          </h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="mx-auto mb-8 max-w-2xl text-base text-secondary sm:text-lg"
          >
            Soonlay turns raw ideas into production-ready software. From MVP to
            full-scale platform, we engineer the systems your product needs to
            launch and grow.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="group"
              onClick={() => {
                setShowContact(true)
                setMessage(null)
              }}
            >
              <span className="mr-1">Contact Us</span>
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Button>
            <Link href="/work">
              <Button variant="secondary" size="lg">
                See Our Work
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center gap-3 text-xs text-muted sm:flex-row sm:justify-center"
          >
            <SocialProofItem>
              Trusted by founders in 5+ countries
            </SocialProofItem>
            <span className="hidden h-px w-10 bg-border sm:inline-block" />
            <SocialProofItem>
              <span className="font-mono text-[0.7rem] text-accent">
                Our stack:
              </span>{" "}
              Next.js · React · Node.js · AI
            </SocialProofItem>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="mt-14 flex flex-col items-center text-xs text-muted"
        >
          <span>Scroll to explore</span>
          <div className="mt-2 h-8 w-px overflow-hidden rounded-full bg-border/60">
            <motion.div
              className="h-full w-full bg-gradient-accent"
              animate={{ y: ["-100%", "0%"] }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </div>
      {showContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setShowContact(false)}
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
                onClick={() => setShowContact(false)}
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
                  onClick={() => {
                    setShowContact(false)
                    setMessage(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={isSubmitting}
                  onClick={async () => {
                    if (!fullName.trim() || !email.trim() || !projectTitle.trim() || !description.trim()) {
                      setMessage(
                        "Please fill in all mandatory fields."
                      )
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
                          setShowContact(false)
                          setFullName("")
                          setEmail("")
                          setProjectTitle("")
                          setDescription("")
                          setMessage(null)
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
                  }}
                  >
                    {isSubmitting ? "Sending..." : "Submit"}
                  </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function SocialProofItem({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-2">{children}</span>
}
