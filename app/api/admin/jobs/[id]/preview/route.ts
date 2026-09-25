import { requireAdmin } from "@/lib/careers/auth"
import { NotFoundError } from "@/lib/careers/errors"
import { adminErrorResponse, adminResponse } from "@/lib/careers/http"
import { buildPreviewUrl, createPreviewToken } from "@/lib/careers/preview"
import { getAdminJobById } from "@/lib/careers/repository"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request)
    const { id } = await context.params
    const job = await getAdminJobById(id)

    if (job === null) {
      throw new NotFoundError("Job not found")
    }

    const token = await createPreviewToken(job)

    return adminResponse({ url: buildPreviewUrl(job.slug, token) })
  } catch (error) {
    return adminErrorResponse(error)
  }
}
