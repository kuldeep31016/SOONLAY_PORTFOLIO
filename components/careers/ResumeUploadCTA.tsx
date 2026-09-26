"use client"

import { useRef, useCallback } from "react"
import { Upload, Brain, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ResumeRecommendations } from "./ResumeRecommendations"

export function ResumeUploadCTA() {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const openDialog = useCallback(() => {
    dialogRef.current?.showModal()
  }, [])

  const closeDialog = useCallback(() => {
    dialogRef.current?.close()
  }, [])

  return (
    <>
      <div className="card-surface bg-surface/70 p-5 lg:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Brain className="h-5 w-5" aria-hidden="true" />
            </div>
            <h4 className="font-display text-base font-semibold text-primary">
              Get personalized matches
            </h4>
          </div>
          <p className="text-xs text-secondary leading-relaxed mb-4">
            Upload your resume to unlock AI-powered career recommendations tailored to your skills and experience.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={openDialog}
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            <span>Upload resume</span>
            <ArrowRight className="h-4 w-4 ml-auto" aria-hidden="true" />
          </Button>
        </div>
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-[0.65rem] text-muted">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          <span>Powered by AI &mdash; your data is never stored</span>
        </div>
      </div>

      {/* Dialog for Resume Recommendations */}
      <dialog
        ref={dialogRef}
        className="fixed inset-0 z-50 m-auto max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
        onClose={closeDialog}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Brain className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-semibold text-primary">
                Personalized Career Matches
              </h3>
            </div>
            <button
              onClick={closeDialog}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface/80 text-secondary hover:border-border-bright hover:text-primary transition-colors"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <ResumeRecommendations />
          </div>
        </div>
      </dialog>
    </>
  )
}