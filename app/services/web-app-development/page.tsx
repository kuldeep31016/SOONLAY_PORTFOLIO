import type { Metadata } from "next"
import { ServiceDetail } from "@/components/sections/ServiceDetail"
import { pageMetadata } from "@/lib/metadata"
import { getServicePage } from "@/lib/service-pages"

const page = getServicePage("web-app-development")

export const metadata: Metadata = pageMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: "/services/web-app-development"
})

export default function WebAppDevelopmentPage() {
  return <ServiceDetail page={page} />
}
