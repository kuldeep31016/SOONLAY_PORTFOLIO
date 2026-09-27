import type { Metadata } from "next"
import { ServiceDetail } from "@/components/sections/ServiceDetail"
import { pageMetadata } from "@/lib/metadata"
import { getServicePage } from "@/lib/service-pages"

const page = getServicePage("custom-systems")

export const metadata: Metadata = pageMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: "/services/custom-systems"
})

export default function CustomSystemsPage() {
  return <ServiceDetail page={page} />
}
