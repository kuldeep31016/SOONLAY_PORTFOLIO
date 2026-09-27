import { CONTACT_EMAIL, SITE_NAME, SITE_URL, SOCIAL_LINKS, absoluteUrl } from "@/lib/site"

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/logo.png"),
  image: absoluteUrl("/opengraph-image"),
  description:
    "Soonlay is a product development studio that designs and builds web apps, mobile apps, SaaS platforms, AI features, and custom business software.",
  email: CONTACT_EMAIL,
  foundingDate: "2025",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bangalore",
    addressRegion: "Karnataka",
    addressCountry: "IN"
  },
  areaServed: "Worldwide",
  knowsAbout: [
    "Web application development",
    "Mobile app development",
    "SaaS development",
    "AI and LLM application development",
    "MVP development",
    "Custom business software",
    "CRM and ERP development",
    "Workflow automation"
  ],
  sameAs: Object.values(SOCIAL_LINKS)
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` }
}

export function serviceSchema(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    serviceType: name,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "Worldwide"
  }
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  }
}

export function articleSchema(input: {
  title: string
  description: string
  path: string
  datePublished: string
  dateModified: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    mainEntityOfPage: absoluteUrl(input.path),
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    image: absoluteUrl("/opengraph-image")
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  }
}
