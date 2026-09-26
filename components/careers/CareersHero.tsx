"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Globe2, MapPin, Wifi, Upload, Brain, Sparkles, ArrowRight as ArrowRightIcon } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { CareersHeroIllustration } from "./CareersHeroIllustration"
import { ResumeProfileBanner } from "./ResumeProfileBanner"
import { ResumeUploadDialog } from "./ResumeUploadDialog"

const primaryLinkClasses =
  "inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-base font-semibold text-black transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"

interface ProfileData {
  experienceLevel: string
  yearsExperience: number
  skills: string[]
  preferredRoles: string[]
  preferredLocations: string[]
  employmentTypes: string[]
  industries: string[]
  summary: string
}

export function CareersHero() {
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("resume_recommendations_cache")
      if (cached) {
        const data = JSON.parse(cached)
        const now = Date.now()
        if (now - data.timestamp < 5 * 60 * 1000 && data.parsedResume) {
          setProfileData(data.parsedResume)
        } else {
          sessionStorage.removeItem("resume_recommendations_cache")
        }
      }
    } catch {
      // Ignore parsing errors
    }
  }, [])

  const handleUploadComplete = () => {
    try {
      const cached = sessionStorage.getItem("resume_recommendations_cache")
      if (cached) {
        const data = JSON.parse(cached)
        if (data.parsedResume) {
          setProfileData(data.parsedResume)
        }
      }
    } catch {
      // Ignore
    }
    const section = document.getElementById("open-positions")
    section?.scrollIntoView({ behavior: "smooth" })
  }

  const handleViewMatches = () => {
    const section = document.getElementById("open-positions")
    section?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative isolate overflow-hidden bg-gradient-dark py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="mesh-gradient" />
        <div className="absolute -left-32 top-4 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-accent-2/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Content */}
          <div className="max-w-2xl">
            <Badge>Careers</Badge>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-display text-[2.6rem] leading-tight tracking-tight text-primary sm:text-5xl md:text-6xl"
            >
              Build what founders{" "}
              <span className="gradient-text">imagine.</span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-2xl text-base text-secondary sm:text-lg"
            >
              Soonlay turns raw ideas into production-ready software. We are an
              India-based, remote-first product development studio working with
              founders around the world, from the first idea to a system built to
              launch and grow.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8"
            >
              <a href="#open-positions" className={primaryLinkClasses}>
                View open positions
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.7rem] uppercase tracking-wide text-muted"
            >
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                India
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Wifi className="h-3.5 w-3.5 text-accent-2" aria-hidden="true" />
                Remote-first
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                Global founders
              </span>
            </motion.div>
          </div>

          {/* Right Column - Illustration + CTA / Profile Banner */}
          <div className="hidden lg:block relative">
            <AnimatePresence mode="wait">
              {profileData ? (
                <motion.div
                  key="profile"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                  <ResumeProfileBanner
                    profileData={profileData}
                    onClear={() => {
                      sessionStorage.removeItem("resume_recommendations_cache")
                      setProfileData(null)
                    }}
                    onViewMatches={handleViewMatches}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="cta"
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                  <div className="relative h-[360px] max-h-[360px]">
                    <CareersHeroIllustration />
                  </div>
                  <div className="mt-6 card-surface bg-surface/70 p-5 lg:p-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                          <Brain className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <h4 className="font-display text-base font-semibold text-primary">
                          Get personalized matches
                        </h4>
                      </div>
                      <motion.p
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="text-xs text-secondary leading-relaxed mb-4"
                      >
                        Got a great resume? Let AI match you with the best opportunities based on your skills.
                      </motion.p>
                      <button
                        onClick={() => setShowUploadDialog(true)}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border bg-transparent px-6 py-3 text-base text-primary transition-colors hover:border-border-bright hover:bg-surface/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <Upload className="h-4 w-4" aria-hidden="true" />
                        <span>Upload resume</span>
                        <ArrowRightIcon className="h-4 w-4 ml-auto" aria-hidden="true" />
                      </button>
                      <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-[0.65rem] text-muted">
                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                        <span>Powered by AI &mdash; your data is never stored</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile: CTA below content */}
          <div className="lg:hidden mt-8">
            <AnimatePresence mode="wait">
              {profileData ? (
                <motion.div
                  key="profile-mobile"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                  <ResumeProfileBanner
                    profileData={profileData}
                    onClear={() => {
                      sessionStorage.removeItem("resume_recommendations_cache")
                      setProfileData(null)
                    }}
                    onViewMatches={handleViewMatches}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="cta-mobile"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                  <div className="card-surface bg-surface/70 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <Brain className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h4 className="font-display text-base font-semibold text-primary">
                        Get personalized matches
                      </h4>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed mb-4">
                      Got a great resume? Let AI match you with the best opportunities based on your skills.
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-start gap-2"
                      onClick={() => setShowUploadDialog(true)}
                    >
                      <Upload className="h-4 w-4" aria-hidden="true" />
                      <span>Upload resume</span>
                      <ArrowRightIcon className="h-4 w-4 ml-auto" aria-hidden="true" />
                    </Button>
                    <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-[0.65rem] text-muted">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      <span>Powered by AI &mdash; your data is never stored</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ResumeUploadDialog
        isOpen={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onUploadComplete={handleUploadComplete}
      />
    </section>
  )
}