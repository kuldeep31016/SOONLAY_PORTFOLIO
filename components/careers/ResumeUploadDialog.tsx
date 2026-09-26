"use client"

import { useRef, useCallback, useEffect } from "react"
import { Brain, X } from "lucide-react"
import { ResumeRecommendations } from "./ResumeRecommendations"

interface ResumeUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete?: () => void
}

export function ResumeUploadDialog({ isOpen, onClose, onUploadComplete }: ResumeUploadDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal()
    } else if (!isOpen && dialogRef.current) {
      dialogRef.current.close()
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleUploadComplete = useCallback(() => {
    onUploadComplete?.()
    onClose()
  }, [onUploadComplete, onClose])

  if (!isOpen) return null

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
      onClose={handleClose}
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
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface/80 text-secondary hover:border-border-bright hover:text-primary transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <ResumeRecommendations onUploadComplete={handleUploadComplete} />
        </div>
      </div>
    </dialog>
  )
}