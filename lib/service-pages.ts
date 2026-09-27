import type { ProductType } from "@/lib/leads/options"

export interface ServicePage {
  slug: string
  name: string
  navTitle: string
  metaTitle: string
  metaDescription: string
  heading: [string, string]
  intro: string
  projectType: ProductType
  primary: { title: string; items: string[] }
  secondary: { title: string; items: string[] }
  fit: { title: string; items: string[] }
  outcomes?: { title: string; items: string[] }
  cta: { title: string; body: string; label: string }
  guide?: { title: string; href: string }
}

export const servicePages: ServicePage[] = [
  {
    slug: "web-app-development",
    name: "Web Application Development",
    navTitle: "Web Development",
    metaTitle: "Web Application Development Company in India",
    metaDescription:
      "Custom web application development with Next.js, React, Node.js and TypeScript — dashboards, portals, admin panels and platforms built for businesses and startups.",
    heading: ["Web Application", "Development"],
    intro:
      "We design and build production-grade web applications tailored to your product vision — fast, secure, and ready to scale with your users. You get a clean, maintainable codebase using Next.js, React, and TypeScript.",
    projectType: "web-app",
    primary: {
      title: "When you need this",
      items: [
        "You have a SaaS or platform idea and need a production-ready v1.",
        "Your existing prototype needs to be rebuilt on a solid foundation.",
        "You want a custom dashboard, admin panel, or internal tool.",
        "You need a technical team that can think in terms of both UX and architecture."
      ]
    },
    secondary: {
      title: "Tech we use",
      items: [
        "Next.js, React, TypeScript, Tailwind CSS",
        "Node.js, REST/GraphQL APIs",
        "PostgreSQL, Prisma, Redis where needed",
        "Deployed on Vercel, AWS, Railway, or your preferred cloud"
      ]
    },
    fit: {
      title: "What this service includes",
      items: [
        "Architecture and technical planning around your goals.",
        "UI design and implementation of every screen and flow.",
        "Backend, database, authentication and admin tooling.",
        "Testing, deployment and launch support."
      ]
    },
    outcomes: {
      title: "Outcomes you can expect",
      items: [
        "Clearly scoped MVP or v1, prioritised around your goals.",
        "Clean, modular codebase that can be extended by any senior developer.",
        "Responsive UI that feels fast on modern devices.",
        "Monitoring, logging, and error tracking wired in from day one."
      ]
    },
    cta: {
      title: "Ready to build your web product?",
      body: "Tell us about your idea and current stage. We'll respond within one business day with next steps and a realistic timeline.",
      label: "Start a web project"
    },
    guide: { title: "Hiring a software development agency: what to prepare", href: "/guides/hiring-a-software-development-agency" }
  },
  {
    slug: "mobile-app-development",
    name: "Mobile App Development",
    navTitle: "Mobile App Development",
    metaTitle: "Mobile App Development Company — Android & iOS Apps",
    metaDescription:
      "Android and iOS app development with React Native and Kotlin. Soonlay designs, builds and ships production-ready mobile apps with admin panels and backends.",
    heading: ["Mobile App", "Development"],
    intro:
      "We build mobile apps that feel native, using React Native and a modern backend — from consumer apps to internal tools.",
    projectType: "mobile-app",
    primary: {
      title: "What we focus on",
      items: [
        "Smooth onboarding flows, navigation, and in-app journeys.",
        "Offline-friendly behaviour where it matters.",
        "Secure auth and backend communication.",
        "Deployments to TestFlight, App Store, and Play Store."
      ]
    },
    secondary: {
      title: "Tech stack",
      items: [
        "React Native with TypeScript.",
        "Expo or bare React Native depending on your needs.",
        "Native modules where performance requires it.",
        "Backends built with Node.js, GraphQL/REST, and cloud services."
      ]
    },
    fit: {
      title: "Good fits for mobile builds",
      items: [
        "Products where mobile is the primary interface.",
        "Companion apps for an existing web or SaaS product.",
        "Internal tools that need to work in the field, not just at a desk.",
        "Startups that want one shared codebase for iOS and Android."
      ]
    },
    cta: {
      title: "Planning a mobile app?",
      body: "Tell us who your users are and what they need to do on the go. We'll help shape a focused v1 that can ship to the stores.",
      label: "Talk about your mobile app"
    },
    guide: { title: "How much does it cost to build an app in India?", href: "/guides/app-development-cost-india" }
  },
  {
    slug: "saas-platforms",
    name: "SaaS Platform Development",
    navTitle: "SaaS Development",
    metaTitle: "SaaS Development Company — Build Your SaaS Platform",
    metaDescription:
      "SaaS platform development: multi-tenant architecture, subscriptions and billing, roles and permissions, analytics and secure infrastructure from day one.",
    heading: ["SaaS Platform", "Development"],
    intro:
      "We build SaaS products that are subscription-ready, multi-tenant, and designed to handle growth — not just a handful of users.",
    projectType: "saas",
    primary: {
      title: "Typical SaaS features we build",
      items: [
        "Authentication, organisations / workspaces, and role-based access control.",
        "Stripe, Razorpay or Paddle subscriptions with trials, upgrades, and invoices.",
        "Analytics dashboards and reporting for your customers.",
        "Admin tooling to manage tenants, plans, and support."
      ]
    },
    secondary: {
      title: "Architecture considerations",
      items: [
        "Single-tenant vs multi-tenant data models depending on your risk profile.",
        "Background jobs for billing, notifications, and heavy processing.",
        "API-first design so you can open up integrations later.",
        "Logging, monitoring, and backups as part of the initial build."
      ]
    },
    fit: {
      title: "When this is the right fit",
      items: [
        "You're building a B2B or B2C subscription product.",
        "You want to charge from day one instead of staying in “beta” forever.",
        "You care about clean permissions, data isolation, and uptime.",
        "You want a team that knows the common SaaS traps to avoid."
      ]
    },
    cta: {
      title: "Planning a SaaS product?",
      body: "Share your market, pricing idea, and core feature set. We'll help you shape a realistic SaaS v1 that can start generating revenue.",
      label: "Talk about your SaaS"
    },
    guide: { title: "How to scope an MVP: deciding what goes into version 1", href: "/guides/how-to-scope-an-mvp" }
  },
  {
    slug: "ai-solutions",
    name: "AI & LLM Application Development",
    navTitle: "AI Solutions",
    metaTitle: "AI & LLM App Development — Chatbots, RAG & Automation",
    metaDescription:
      "AI and LLM application development: chatbots, copilots, document Q&A (RAG) and workflow automation built on OpenAI, Gemini and Claude, integrated into your product.",
    heading: ["AI & LLM Product", "Development"],
    intro:
      "We help you turn AI from buzzword into working product — carefully designed around your data, workflows, and users.",
    projectType: "ai",
    primary: {
      title: "What we build",
      items: [
        "Chatbots and assistants for your product or support team.",
        "Copilots embedded into existing tools or dashboards.",
        "RAG (Retrieval Augmented Generation) systems over your knowledge base.",
        "Automations that connect AI with your CRM, ticketing, or internal tools."
      ]
    },
    secondary: {
      title: "How we build safely",
      items: [
        "We design prompts and flows to minimise hallucinations.",
        "We log and monitor model behaviour from day one.",
        "We respect data boundaries and PII handling requirements.",
        "We work with OpenAI, Gemini, and Claude depending on your use case."
      ]
    },
    fit: {
      title: "When AI actually makes sense",
      items: [
        "You have high-touch, repetitive workflows that can be guided by AI.",
        "You sit on unstructured data (docs, tickets, chats) that should be searchable and summarised.",
        "Your product becomes much more useful with a smart assistant layer.",
        "You want a focused, ROI-driven experiment instead of vague “AI transformation”."
      ]
    },
    cta: {
      title: "Explore an AI use case with us",
      body: "Share your data sources and the problem you want to solve. We can usually suggest a concrete AI experiment in a single call.",
      label: "Talk about AI for your product"
    }
  },
  {
    slug: "custom-systems",
    name: "Custom Business Software, CRM & ERP Development",
    navTitle: "Business Software",
    metaTitle: "Custom Business Software, CRM & ERP Development",
    metaDescription:
      "Custom CRM, ERP, inventory, booking and internal tools built around how your business actually runs — plus automation that replaces manual spreadsheet work.",
    heading: ["Custom Systems", "& Automation"],
    intro:
      "When off-the-shelf tools don't fit, we design and build systems that follow your workflows instead of forcing you to change them.",
    projectType: "internal-tool",
    primary: {
      title: "Examples of custom work",
      items: [
        "Internal dashboards stitching together data from multiple tools.",
        "Automated workflows that replace manual spreadsheet operations.",
        "Custom CRMs or back-office systems tailored to your process.",
        "Lightweight ERP modules: inventory, purchase orders, billing and multi-branch stock.",
        "Booking, scheduling and customer portals for service businesses.",
        "Backends powering hardware, IoT, or operational tooling."
      ]
    },
    secondary: {
      title: "Our approach",
      items: [
        "We map your current process before proposing any tech.",
        "We prioritise reliability and observability over flashy UI.",
        "We design for operators: clear states, logs, and failure modes.",
        "We integrate with the tools you already rely on where it makes sense."
      ]
    },
    fit: {
      title: "When to choose a custom system",
      items: [
        "You're juggling work across spreadsheets, email, and half a dozen SaaS tools.",
        "You have a process that gives you an edge and can't be modelled in generic software.",
        "You want automation but need control and visibility at every step.",
        "You're hitting the limits of your current cobbled-together stack."
      ]
    },
    cta: {
      title: "Have a workflow that needs upgrading?",
      body: "Describe how your team works today and where the friction is. We can usually see 2–3 automation wins quickly.",
      label: "Talk about a custom system"
    },
    guide: { title: "Custom software vs off-the-shelf tools: how to decide", href: "/guides/custom-software-vs-off-the-shelf" }
  },
  {
    slug: "mvp-development",
    name: "MVP Development",
    navTitle: "MVP Development",
    metaTitle: "MVP Development for Startups — Launch in Weeks",
    metaDescription:
      "MVP development for founders: we scope a focused first version, build it in weekly sprints with live demos, and launch it so you can validate with real users.",
    heading: ["MVP", "Development"],
    intro:
      "You have the idea. We turn it into a lean, launch-ready product that proves there is demand — without overbuilding.",
    projectType: "mvp",
    primary: {
      title: "Who this is for",
      items: [
        "Non-technical founders who need a reliable build partner.",
        "Teams who validated manually and now need a product.",
        "Founders preparing for investor demos or accelerators.",
        "Anyone who wants to avoid wasting months on the wrong features."
      ]
    },
    secondary: {
      title: "How we approach MVPs",
      items: [
        "We start from your core value proposition and user journeys.",
        "We strip the scope to the smallest version that delivers that value.",
        "We plan a 4–8 week build with weekly demos and feedback loops.",
        "We design the architecture so it can grow into v1 and beyond."
      ]
    },
    fit: {
      title: "What you get at launch",
      items: [
        "Deployed MVP on your own domain and infrastructure.",
        "Core analytics in place so you can see what users do.",
        "Basic documentation and a clear roadmap for v1.",
        "Technical foundation that doesn't need to be thrown away."
      ]
    },
    cta: {
      title: "Have an MVP in mind?",
      body: "Share your idea, target audience, and deadline. We'll outline a realistic MVP scope and timeline with zero fluff.",
      label: "Talk about your MVP"
    },
    guide: { title: "How to scope an MVP: deciding what goes into version 1", href: "/guides/how-to-scope-an-mvp" }
  }
]

export function getServicePage(slug: string): ServicePage {
  const page = servicePages.find((candidate) => candidate.slug === slug)
  if (!page) throw new Error(`Unknown service page: ${slug}`)
  return page
}
