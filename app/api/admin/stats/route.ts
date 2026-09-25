import { requireAdmin } from "@/lib/careers/auth"
import { adminErrorResponse, adminResponse } from "@/lib/careers/http"
import { getJobStats } from "@/lib/careers/repository"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    await requireAdmin(request)
    const stats = await getJobStats()
    return adminResponse({ stats })
  } catch (error) {
    return adminErrorResponse(error)
  }
}
