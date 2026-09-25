import { requireAdmin } from "@/lib/careers/auth"
import { adminErrorResponse, adminResponse } from "@/lib/careers/http"
import { restoreJob } from "@/lib/careers/repository"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request)
    const { id } = await context.params
    const job = await restoreJob(id)
    return adminResponse({ job })
  } catch (error) {
    return adminErrorResponse(error)
  }
}
