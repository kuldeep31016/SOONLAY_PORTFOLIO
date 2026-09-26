"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { X, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/Button"

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

interface ResumeProfileBannerProps {
  profileData: ProfileData
  onClear: () => void
  onViewMatches: () => void
}

export function ResumeProfileBanner({ profileData, onClear, onViewMatches }: ResumeProfileBannerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const experienceText = profileData.preferredRoles[0] || "developer"

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="relative w-full"
    >
      <div className="card-surface bg-surface/70 border-accent/30 p-5 lg:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <h4 className="font-display text-base font-semibold text-primary">
              Your AI-Generated Profile
            </h4>
          </div>

          <div className="mb-4 space-y-2">
            <p className="text-sm text-secondary leading-relaxed">
              You&apos;re an <span className="text-primary font-medium">{profileData.experienceLevel} {experienceText}</span>{" "}
              with <span className="text-primary font-medium">{profileData.yearsExperience}+ years</span> experience.
            </p>
            <p className="text-xs text-muted">
              {profileData.summary}
            </p>
          </div>

          {profileData.skills.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-muted mb-2">Top Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {profileData.skills.slice(0, 6).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[0.65rem] font-medium text-accent"
                  >
                    {skill}
                  </span>
                ))}
                {profileData.skills.length > 6 && (
                  <span className="inline-flex items-center rounded-full border border-border bg-surface px-2 py-0.5 text-[0.65rem] text-muted">
                    +{profileData.skills.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-secondary mb-4">
            You&apos;d be a great asset in these roles.
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[0.65rem] text-muted">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            <span>Powered by AI &mdash; your data is never stored</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="ghost" size="sm" onClick={onClear} className="text-muted hover:text-secondary">
              <X className="h-4 w-4 mr-1" aria-hidden="true" />
              Clear
            </Button>
            <Button size="sm" onClick={onViewMatches} showArrow>
              View my matches
              <ArrowRight className="h-4 w-4 ml-auto" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}