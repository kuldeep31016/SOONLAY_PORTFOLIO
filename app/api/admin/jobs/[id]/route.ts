import { requireAdmin } from "@/lib/careers/auth"
import { NotFoundError } from "@/lib/careers/errors"
import { adminErrorResponse, adminResponse, readJsonBody } from "@/lib/careers/http"
import { archiveJob, getAdminJobById, updateJob } from "@/lib/careers/repository"
import { parseUpdateJobInput } from "@/lib/careers/validation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface JobRouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, context: JobRouteContext) {
  try {
    await requireAdmin(request)
    const { id } = await context.params
    const job = await getAdminJobById(id)

    if (job === null) {
      throw new NotFoundError("Job not found")
    }

    return adminResponse({ job })
  } catch (error) {
    return adminErrorResponse(error)
  }
}

export async function PUT(request: Request, context: JobRouteContext) {
  try {
    await requireAdmin(request)
    const { id } = await context.params
    const body = await readJsonBody(request)
    const input = parseUpdateJobInput(body)
    const job = await updateJob(id, input)
    return adminResponse({ job })
  } catch (error) {
    return adminErrorResponse(error)
  }
}

export async function DELETE(request: Request, context: JobRouteContext) {
  try {
    await requireAdmin(request)
    const { id } = await context.params
    const job = await archiveJob(id)
    return adminResponse({ job })
  } catch (error) {
    return adminErrorResponse(error)
  }
}
