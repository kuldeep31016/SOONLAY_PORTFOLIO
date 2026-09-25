import { requireAdmin } from "@/lib/careers/auth"
import { adminErrorResponse, adminResponse, readJsonBody } from "@/lib/careers/http"
import { createJob, listAdminJobs, parseAdminJobQuery } from "@/lib/careers/repository"
import { parseCreateJobInput } from "@/lib/careers/validation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    await requireAdmin(request)
    const searchParams = new URL(request.url).searchParams
    const query = parseAdminJobQuery(searchParams)
    const result = await listAdminJobs(query)
    return adminResponse(result)
  } catch (error) {
    return adminErrorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request)
    const body = await readJsonBody(request)
    const input = parseCreateJobInput(body)
    const job = await createJob(input)
    return adminResponse({ job }, 201)
  } catch (error) {
    return adminErrorResponse(error)
  }
}
