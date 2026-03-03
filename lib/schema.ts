export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Soonlay",
  url: "https://soonlay.tech",
  logo: "https://soonlay.tech/logo.svg",
  description:
    "Soonlay is a product development studio that builds web apps, mobile apps, SaaS platforms, and AI products for startup founders.",
  email: "soonlay.tech@gmail.com",
  foundingDate: "2025",
  areaServed: "Worldwide",
  serviceType: [
    "Web Development",
    "Mobile App Development",
    "SaaS Development",
    "AI Product Development",
    "MVP Development"
  ],
  sameAs: [
    "https://linkedin.com/company/soonlay",
    "https://github.com/soonlay",
    "https://twitter.com/soonlay"
  ]
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Soonlay",
  url: "https://soonlay.tech",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://soonlay.tech/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

