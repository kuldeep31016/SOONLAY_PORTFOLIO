import { requireAdmin } from "@/lib/careers/auth"
import { adminErrorResponse, adminResponse, readJsonBody } from "@/lib/careers/http"
import { updateJobStatus } from "@/lib/careers/repository"
import { parseJobStatusInput } from "@/lib/careers/validation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request)
    const { id } = await context.params
    const body = await readJsonBody(request)
    const { status } = parseJobStatusInput(body)
    const job = await updateJobStatus(id, status)
    return adminResponse({ job })
  } catch (error) {
    return adminErrorResponse(error)
  }
}
