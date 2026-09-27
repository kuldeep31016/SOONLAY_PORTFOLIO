import type { Metadata } from "next"
import { ServiceDetail } from "@/components/sections/ServiceDetail"
import { pageMetadata } from "@/lib/metadata"
import { getServicePage } from "@/lib/service-pages"

const page = getServicePage("saas-platforms")

export const metadata: Metadata = pageMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: "/services/saas-platforms"
})

export default function SaasPlatformsPage() {
  return <ServiceDetail page={page} />
}
