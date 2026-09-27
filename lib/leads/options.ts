export const productTypes = [
  { id: "web-app", label: "Web application", hint: "Portal, dashboard, platform" },
  { id: "mobile-app", label: "Mobile app", hint: "Android / iOS" },
  { id: "saas", label: "SaaS product", hint: "Subscriptions, multi-tenant" },
  { id: "internal-tool", label: "Business software", hint: "CRM, ERP, inventory, booking" },
  { id: "ai", label: "AI feature or product", hint: "Chatbot, RAG, automation" },
  { id: "ecommerce", label: "E-commerce / ordering", hint: "Catalogue, cart, payments" },
  { id: "mvp", label: "Startup MVP", hint: "First version to validate" },
  { id: "website", label: "Business website", hint: "Marketing site, landing pages" },
  { id: "not-sure", label: "Not sure yet", hint: "Help me figure it out" }
] as const

export const userTypes = [
  { id: "customers", label: "Customers / public users" },
  { id: "staff", label: "Our staff / team" },
  { id: "vendors", label: "Vendors, partners or drivers" },
  { id: "admins", label: "Admins / management" }
] as const

export const platformOptions = [
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile app" },
  { id: "both", label: "Web + mobile" },
  { id: "not-sure", label: "Not sure" }
] as const

export const featureOptions = [
  { id: "auth", label: "User accounts / login" },
  { id: "payments", label: "Online payments" },
  { id: "admin", label: "Admin dashboard" },
  { id: "notifications", label: "SMS / email / WhatsApp alerts" },
  { id: "realtime", label: "Chat, live tracking or live updates" },
  { id: "ai", label: "AI features" },
  { id: "integrations", label: "Connect to other tools / APIs" },
  { id: "existing-system", label: "Replace or migrate an existing system" }
] as const

export const orgTypes = [
  { id: "founder", label: "Startup / founder" },
  { id: "small-business", label: "Small or medium business" },
  { id: "company", label: "Established company" },
  { id: "agency", label: "Agency / consultant" },
  { id: "other", label: "Other" }
] as const

export const industries = [
  { id: "healthcare", label: "Healthcare / clinics" },
  { id: "education", label: "Education / coaching" },
  { id: "retail", label: "Retail / distribution" },
  { id: "restaurant", label: "Restaurants / food" },
  { id: "logistics", label: "Logistics / delivery" },
  { id: "real-estate", label: "Real estate" },
  { id: "finance", label: "Finance / fintech" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "professional-services", label: "Professional services" },
  { id: "travel", label: "Travel / hospitality" },
  { id: "saas-tech", label: "Software / tech" },
  { id: "other", label: "Other" }
] as const

export const stages = [
  { id: "idea", label: "Just an idea" },
  { id: "designs", label: "Have designs or detailed specs" },
  { id: "existing-product", label: "Improving or rebuilding an existing product" }
] as const

export const timelines = [
  { id: "asap", label: "As soon as possible (< 1 month)" },
  { id: "1-3-months", label: "Within 1–3 months" },
  { id: "3-6-months", label: "Within 3–6 months" },
  { id: "flexible", label: "Flexible / exploring" }
] as const

export const budgets = [
  { id: "under-1l", label: "Under ₹1 lakh", usd: "under ~$1.2k" },
  { id: "1-3l", label: "₹1 – 3 lakh", usd: "~$1.2k – 3.5k" },
  { id: "3-7l", label: "₹3 – 7 lakh", usd: "~$3.5k – 8k" },
  { id: "7l-plus", label: "₹7 lakh+", usd: "~$8k+" },
  { id: "not-sure", label: "Not sure yet", usd: "" }
] as const

export const contactMethods = [
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone call" },
  { id: "whatsapp", label: "WhatsApp" }
] as const

type Ids<T extends readonly { id: string }[]> = T[number]["id"]

export type ProductType = Ids<typeof productTypes>
export type UserType = Ids<typeof userTypes>
export type Platform = Ids<typeof platformOptions>
export type Feature = Ids<typeof featureOptions>
export type OrgType = Ids<typeof orgTypes>
export type Industry = Ids<typeof industries>
export type Stage = Ids<typeof stages>
export type Timeline = Ids<typeof timelines>
export type Budget = Ids<typeof budgets>
export type ContactMethod = Ids<typeof contactMethods>

export function ids<T extends readonly { id: string }[]>(options: T) {
  return options.map((option) => option.id) as [Ids<T>, ...Ids<T>[]]
}

export function labelFor(options: readonly { id: string; label: string }[], id: string) {
  return options.find((option) => option.id === id)?.label ?? id
}

export function isProductType(value: string | null | undefined): value is ProductType {
  return productTypes.some((option) => option.id === value)
}
