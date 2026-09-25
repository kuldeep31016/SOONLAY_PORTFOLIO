import { publicErrorResponse, publicResponse } from "@/lib/careers/http"
import { listPublishedJobs, parsePublicJobQuery } from "@/lib/careers/repository"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams
    const query = parsePublicJobQuery(searchParams)
    const result = await listPublishedJobs(query)
    return publicResponse(result)
  } catch (error) {
    return publicErrorResponse(error)
  }
}
