export type ProjectCategory = "all" | "web" | "saas" | "ai" | "mobile"

export interface Project {
  title: string
  description: string
  tags: string[]
  category: Exclude<ProjectCategory, "all">
  /** Extra filters this project also appears under. */
  alsoIn?: Exclude<ProjectCategory, "all">[]
  images: string[]
}

export const projects: Project[] = [
  {
    title: "AI Powered Healthcare System",
    description: "Telemedicine platform connecting doctors and patients in real time.",
    tags: ["Web App", "SaaS", "Healthcare"],
    category: "ai",
    alsoIn: ["saas", "web"],
    images: ["/images/Telemedine-1.png", "/images/Telemedine-2.png", "/images/Telemedine-3.png"]
  },
  {
    title: "Stock Management System",
    description: "Retail management dashboard for store owners and operators.",
    tags: ["Web", "SaaS", "Retail"],
    category: "web",
    alsoIn: ["saas"],
    images: ["/images/mydukan-1.png", "/images/mydukan-2.png", "/images/mydukan-3.png"]
  },
  {
    title: "Travel Booking Website",
    description:
      "Tour and travel website with holiday packages, online booking requests, a photo gallery and customer reviews.",
    tags: ["Web", "Travel", "Booking"],
    category: "web",
    images: ["/images/travel-1.png", "/images/travel-2.png", "/images/travel-3.png"]
  },
  {
    title: "Apna Khaata — Billing & Invoicing App",
    description:
      "Billing app for small businesses: create invoices in seconds, share them as PDF or on WhatsApp, and track daily sales and pending payments.",
    tags: ["Mobile", "SaaS", "Billing"],
    category: "mobile",
    alsoIn: ["saas"],
    images: ["/images/khaata-1.png", "/images/khaata-2.png", "/images/khaata-3.png"]
  },
  {
    title: "Dealora — Coupon Savings App",
    description:
      "Consumer app that brings coupons from shopping apps into one place, tracks expiry dates and reminds users before deals lapse.",
    tags: ["Mobile", "B2C", "Savings"],
    category: "mobile",
    images: ["/images/dealora-1.png", "/images/dealora-2.png", "/images/dealora-3.png"]
  },
  {
    title: "Terminal Emulator & File System",
    description: "Android Native terminal emulator with integrated file system.",
    tags: ["Mobile", "B2C"],
    category: "mobile",
    images: ["/images/Betturmux-1.png", "/images/Betturmux-2.png", "/images/Betturmux-3.png"]
  }
]

export const projectFilters: { id: ProjectCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "saas", label: "SaaS" },
  { id: "mobile", label: "Mobile" },
  { id: "ai", label: "AI" }
]
