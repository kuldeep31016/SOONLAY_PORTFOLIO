import type { Metadata } from "next"
import { ServiceDetail } from "@/components/sections/ServiceDetail"
import { pageMetadata } from "@/lib/metadata"
import { getServicePage } from "@/lib/service-pages"

const page = getServicePage("mvp-development")

export const metadata: Metadata = pageMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: "/services/mvp-development"
})

export default function MvpDevelopmentPage() {
  return <ServiceDetail page={page} />
}
