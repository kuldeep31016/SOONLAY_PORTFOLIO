"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, Briefcase, MapPin, Clock, CheckCircle, XCircle, Loader2, Brain, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface ParsedResume {
  skills: string[]
  experienceLevel: string
  yearsExperience: number
  preferredRoles: string[]
  preferredLocations: string[]
  employmentTypes: string[]
  industries: string[]
  summary: string
}

interface ScoredJob {
  job: {
    id: string
    title: string
    slug: string
    department: string
    location: string
    employmentType: string
    experienceLevel: string | null
    skills: string[]
    shortDescription: string
  }
  score: number
  reasons: string[]
  matchDetails: {
    skills: { matched: string[] }
    experienceLevel: boolean
    location: boolean
    role: boolean
    employmentType: boolean
    industry: { matched: string[] }
  }
}

interface ResumeRecommendationsProps {
  initialRecommendations?: ScoredJob[]
  initialParsedResume?: ParsedResume
  onUploadComplete?: () => void
}

export function ResumeRecommendations({ initialRecommendations, initialParsedResume, onUploadComplete }: ResumeRecommendationsProps) {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<ScoredJob[]>(initialRecommendations ?? [])
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(initialParsedResume ?? null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [activeTab, setActiveTab] = useState<"recommendations" | "profile">("recommendations")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sessionKey = "resume_recommendations_cache"

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(sessionKey)
      if (cached) {
        const data = JSON.parse(cached)
        const now = Date.now()
        // 5 minutes TTL
        if (now - data.timestamp < 5 * 60 * 1000) {
          setRecommendations(data.recommendations ?? [])
          setParsedResume(data.parsedResume ?? null)
        } else {
          sessionStorage.removeItem(sessionKey)
        }
      }
    } catch {
      // Ignore parsing errors
    }
  }, [])

  // Save to sessionStorage
  const saveToCache = useCallback((recs: ScoredJob[], resume: ParsedResume) => {
    try {
      sessionStorage.setItem(sessionKey, JSON.stringify({
        recommendations: recs,
        parsedResume: resume,
        timestamp: Date.now()
      }))
    } catch {
      // Ignore quota errors
    }
  }, [])

  // Upload file handler - must be defined before handlers that use it
  const uploadFile = useCallback(async (file: File) => {
    if (!["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
      setError("Please upload a PDF or DOCX file.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5MB.")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("resume", file)

      const response = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error codes with user-friendly messages
        const errorCode = data.code
        let userMessage = data.error || "Failed to process resume"
        
        switch (errorCode) {
          case "SERVICE_UNAVAILABLE":
            userMessage = "Resume analysis is currently unavailable. Please try again later or contact support."
            break
          case "PROVIDERS_UNAVAILABLE":
            userMessage = "AI resume analysis is temporarily unavailable. Please try again in a few moments."
            break
          case "NO_FILE":
            userMessage = "No file was uploaded. Please select a file and try again."
            break
          case "INVALID_TYPE":
            userMessage = "Invalid file type. Please upload a PDF or DOCX file."
            break
          case "FILE_TOO_LARGE":
            userMessage = "File is too large. Maximum size is 5MB."
            break
          case "EXTRACTION_FAILED":
            userMessage = "Could not read the file. Please ensure it's not password-protected or scanned."
            break
          default:
            userMessage = data.error || "Something went wrong. Please try again."
        }
        
        throw new Error(userMessage)
      }

      setRecommendations(data.recommendations ?? [])
      setParsedResume(data.parsedResume ?? null)
      saveToCache(data.recommendations ?? [], data.parsedResume)
      onUploadComplete?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload resume")
    } finally {
      setIsUploading(false)
    }
  }, [saveToCache, onUploadComplete])

  const clearCache = useCallback(() => {
    sessionStorage.removeItem(sessionKey)
    setRecommendations([])
    setParsedResume(null)
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files[0]
    if (file) await uploadFile(file)
  }, [uploadFile])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await uploadFile(file)
    // Reset input so same file can be uploaded again
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [uploadFile])

  const navigateToJob = (slug: string) => {
    router.push(`/careers/${slug}`)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    if (score >= 40) return "text-orange-400"
    return "text-red-400"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500/20"
    if (score >= 60) return "bg-yellow-500/20"
    if (score >= 40) return "bg-orange-500/20"
    return "bg-red-500/20"
  }

  if (!parsedResume && recommendations.length === 0) {
    // Upload state
    return (
      <div className="card-surface border border-border bg-surface/60 p-6 sm:p-8">
        <div
          className={cn(
            "relative rounded-2xl border-2 border-dashed transition-colors p-8 text-center",
            dragActive ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
            aria-label="Upload resume"
          />
          <div className="relative z-10">
            <Upload className="mx-auto h-12 w-12 text-muted" aria-hidden="true" />
            <h3 className="mt-4 font-display text-lg text-primary">
              Upload your resume for AI-powered job matches
            </h3>
            <p className="mt-2 text-sm text-secondary max-w-md mx-auto">
              Drag & drop a PDF or DOCX (max 5MB). We&apos;ll extract your skills and experience
              to find the best matching roles for you.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                Choose file
              </Button>
              {isUploading && (
                <Loader2 className="h-5 w-5 text-accent animate-spin" aria-hidden="true" />
              )}
            </div>
            <p className="mt-3 text-xs text-muted">
              Your resume is processed in memory and never stored. Results cached for 5 minutes.
            </p>
          </div>
        </div>
        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400" role="alert">
            {error}
          </div>
        )}
      </div>
    )
  }

  // Results state
  return (
    <div className="space-y-6">
      {/* Header with profile summary */}
      <div className="card-surface border border-border bg-surface/60 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="font-display text-lg text-primary">Your AI-Generated Profile</h3>
            </div>
            <p className="mt-2 text-sm text-secondary">{parsedResume?.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {parsedResume?.skills.slice(0, 8).map((skill) => (
                <span key={skill} className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-secondary">
                  {skill}
                </span>
              ))}
              {(parsedResume?.skills.length ?? 0) > 8 && (
                <span className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-muted">
                  +{(parsedResume?.skills.length ?? 0) - 8} more
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCache}
              className="text-muted hover:text-secondary"
            >
              <XCircle className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Clear recommendations</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="mr-2 h-4 w-4" aria-hidden="true" />
              New Resume
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-surface px-4 py-3 text-center">
            <div className="font-display text-2xl text-primary">{parsedResume?.experienceLevel}</div>
            <div className="text-xs text-muted">Experience Level</div>
          </div>
          <div className="rounded-xl border border-border bg-surface px-4 py-3 text-center">
            <div className="font-display text-2xl text-primary">{parsedResume?.yearsExperience}+</div>
            <div className="text-xs text-muted">Years Experience</div>
          </div>
          <div className="rounded-xl border border-border bg-surface px-4 py-3 text-center">
            <div className="font-display text-2xl text-primary">{recommendations.length}</div>
            <div className="text-xs text-muted">Matches Found</div>
          </div>
          <div className="rounded-xl border border-border bg-surface px-4 py-3 text-center">
            <div className="font-display text-2xl text-primary">{parsedResume?.skills.length}</div>
            <div className="text-xs text-muted">Skills Detected</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("recommendations")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
            activeTab === "recommendations"
              ? "border-accent text-primary"
              : "border-transparent text-muted hover:text-secondary"
          )}
        >
          <Brain className="mr-2 h-4 w-4 inline" aria-hidden="true" />
          Recommendations ({recommendations.length})
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
            activeTab === "profile"
              ? "border-accent text-primary"
              : "border-transparent text-muted hover:text-secondary"
          )}
        >
          <FileText className="mr-2 h-4 w-4 inline" aria-hidden="true" />
          Full Profile
        </button>
      </div>

      {/* Recommendations Tab */}
      {activeTab === "recommendations" && (
        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="card-surface border border-border bg-surface/60 p-8 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-muted" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg text-primary">No matching positions found</h3>
              <p className="mt-2 text-sm text-secondary">
                We couldn&apos;t find roles matching your profile. Try updating your resume
                or check back later for new openings.
              </p>
            </div>
          ) : (
            recommendations.map((rec) => (
              <article
                key={rec.job.id}
                className={cn(
                  "card-surface border bg-surface/60 p-6 transition-all",
                  rec.score >= 80 ? "border-green-500/30" : "border-border"
                )}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-display text-lg text-primary">{rec.job.title}</h4>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-secondary">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                            {rec.job.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                            {rec.job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            {rec.job.employmentType}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "rounded-full px-3 py-1 text-center text-xs font-medium",
                            getScoreBg(rec.score),
                            getScoreColor(rec.score)
                          )}
                        >
                          {rec.score}% Match
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-secondary line-clamp-2">{rec.job.shortDescription}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {rec.reasons.map((reason, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs text-accent"
                        >
                          <CheckCircle className="h-3 w-3" aria-hidden="true" />
                          {reason}
                        </span>
                      ))}
                    </div>
                    {rec.matchDetails.skills.matched.length > 0 && (
                      <div className="mt-3 text-sm">
                        <span className="text-muted mr-2">Matching skills:</span>
                        <span className="text-secondary">
                          {rec.matchDetails.skills.matched.slice(0, 6).join(", ")}
                          {rec.matchDetails.skills.matched.length > 6 && "…"}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigateToJob(rec.job.slug)}
                    showArrow
                  >
                    View Details
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && parsedResume && (
        <div className="space-y-6">
          <div className="card-surface border border-border bg-surface/60 p-6">
            <h4 className="font-display text-lg text-primary">Professional Summary</h4>
            <p className="mt-3 text-sm text-secondary whitespace-pre-wrap">{parsedResume.summary}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="card-surface border border-border bg-surface/60 p-6">
              <h4 className="font-display text-lg text-primary flex items-center gap-2">
                <Brain className="h-5 w-5" aria-hidden="true" />
                Technical Skills ({parsedResume.skills.length})
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {parsedResume.skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-secondary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="card-surface border border-border bg-surface/60 p-6">
              <h4 className="font-display text-lg text-primary flex items-center gap-2">
                <Briefcase className="h-5 w-5" aria-hidden="true" />
                Preferred Roles
              </h4>
              <ul className="mt-3 space-y-2">
                {parsedResume.preferredRoles.map((role, i) => (
                  <li key={i} className="text-sm text-secondary flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                    {role}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-surface border border-border bg-surface/60 p-6">
              <h4 className="font-display text-lg text-primary flex items-center gap-2">
                <MapPin className="h-5 w-5" aria-hidden="true" />
                Preferred Locations
              </h4>
              <ul className="mt-3 space-y-2">
                {parsedResume.preferredLocations.map((loc, i) => (
                  <li key={i} className="text-sm text-secondary flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                    {loc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-surface border border-border bg-surface/60 p-6">
              <h4 className="font-display text-lg text-primary flex items-center gap-2">
                <Clock className="h-5 w-5" aria-hidden="true" />
                Employment Preferences
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {parsedResume.employmentTypes.map((type) => (
                  <span key={type} className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-secondary">
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="card-surface border border-border bg-surface/60 p-6">
              <h4 className="font-display text-lg text-primary flex items-center gap-2">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                Industries
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {parsedResume.industries.map((ind) => (
                  <span key={ind} className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-secondary">
                    {ind}
                  </span>
                ))}
              </div>
            </div>

            <div className="card-surface border border-border bg-surface/60 p-6">
              <h4 className="font-display text-lg text-primary">Experience Details</h4>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
                <dt className="text-muted">Level</dt>
                <dd className="text-secondary">{parsedResume.experienceLevel}</dd>
                <dt className="text-muted">Years</dt>
                <dd className="text-secondary">{parsedResume.yearsExperience}+</dd>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}