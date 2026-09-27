import type { Metadata } from "next"
import { ServiceDetail } from "@/components/sections/ServiceDetail"
import { pageMetadata } from "@/lib/metadata"
import { getServicePage } from "@/lib/service-pages"

const page = getServicePage("mobile-app-development")

export const metadata: Metadata = pageMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: "/services/mobile-app-development"
})

export default function MobileAppDevelopmentPage() {
  return <ServiceDetail page={page} />
}
