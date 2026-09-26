import { NextRequest, NextResponse } from "next/server"
import { parseResumeWithGrok } from "@/lib/careers/grok"
import { scoreJobsForResume } from "@/lib/careers/recommendations"
import { listPublishedJobs } from "@/lib/careers/repository"
import { parsePublicJobQuery } from "@/lib/careers/query"
import { toSearchParams } from "@/components/careers/queryState"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // pdf-parse is a CommonJS module, use dynamic import with require
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse")
  const data = await pdfParse(buffer)
  return data.text
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth")
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("resume") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded", code: "NO_FILE" },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF or DOCX file.", code: "INVALID_TYPE" },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB.", code: "FILE_TOO_LARGE" },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Extract text based on file type
    let resumeText: string
    if (file.type === "application/pdf") {
      resumeText = await extractTextFromPDF(buffer)
    } else {
      resumeText = await extractTextFromDOCX(buffer)
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract sufficient text from the resume. Please ensure the file is not scanned/image-based.", code: "EXTRACTION_FAILED" },
        { status: 400 }
      )
    }

    // Parse resume with Grok
    const parsedResume = await parseResumeWithGrok(resumeText)

    // Fetch published jobs
    const jobsResult = await listPublishedJobs(
      parsePublicJobQuery(toSearchParams({}))
    )

    // Score jobs
    const recommendations = scoreJobsForResume(jobsResult.jobs, parsedResume)

    return NextResponse.json({
      success: true,
      parsedResume: {
        skills: parsedResume.skills,
        experienceLevel: parsedResume.experienceLevel,
        yearsExperience: parsedResume.yearsExperience,
        preferredRoles: parsedResume.preferredRoles,
        preferredLocations: parsedResume.preferredLocations,
        employmentTypes: parsedResume.employmentTypes,
        industries: parsedResume.industries,
        summary: parsedResume.summary
      },
      recommendations: recommendations.map(r => ({
        job: r.job,
        score: r.score,
        reasons: r.reasons,
        matchDetails: r.matchDetails
      }))
    })

  } catch (error) {
    console.error("[resume/upload] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process resume", code: "PROCESSING_ERROR" },
      { status: 500 }
    )
  }
}