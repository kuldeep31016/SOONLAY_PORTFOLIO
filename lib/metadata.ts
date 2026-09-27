import type { Metadata } from "next"
import { SITE_NAME, SITE_URL } from "@/lib/site"

const defaultTitle =
  "Soonlay — Custom Software, App & SaaS Development Studio in India"
const defaultDescription =
  "Soonlay designs and builds web apps, mobile apps, SaaS platforms, AI features, and custom business software for startups and growing businesses. Get a scoped plan and quote for your project."

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_NAME}`
  },
  description: defaultDescription,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: SITE_NAME,
    title: defaultTitle,
    description: defaultDescription
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    site: "@SoonlayTech",
    creator: "@SoonlayTech"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  ...(googleVerification ? { verification: { google: googleVerification } } : {})
}

interface PageMetadataInput {
  title: string
  description: string
  path: string
  absoluteTitle?: boolean
  type?: "website" | "article"
}

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  type = "website"
}: PageMetadataInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "en_IN",
      url: path,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [ogImage]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.url]
    }
  }
}

const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Soonlay — custom software, app and SaaS development studio"
}
