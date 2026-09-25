import { publicErrorResponse, publicResponse } from "@/lib/careers/http"
import { getPublishedJobBySlug } from "@/lib/careers/repository"
import { NotFoundError } from "@/lib/careers/errors"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params
    const job = await getPublishedJobBySlug(slug)

    if (job === null) {
      throw new NotFoundError("Job not found")
    }

    return publicResponse({ job })
  } catch (error) {
    return publicErrorResponse(error)
  }
}
