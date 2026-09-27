import type { ProductType } from "@/lib/leads/options"

export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "callout"; text: string }

export interface Guide {
  slug: string
  title: string
  description: string
  published: string
  updated: string
  readingMinutes: number
  relatedService: { label: string; href: string }
  projectType: ProductType
  blocks: GuideBlock[]
  faqs: { question: string; answer: string }[]
}

export const guides: Guide[] = [
  {
    slug: "app-development-cost-india",
    title: "How much does it cost to build an app in India in 2026?",
    description:
      "Indicative price ranges for websites, web apps, mobile apps, MVPs, SaaS platforms and AI features in India — and the factors that actually move the number.",
    published: "2026-09-26",
    updated: "2026-09-26",
    readingMinutes: 7,
    relatedService: { label: "MVP Development", href: "/services/mvp-development" },
    projectType: "mvp",
    blocks: [
      {
        type: "p",
        text: "“How much will my app cost?” is the first question almost every founder and business owner asks, and the honest answer is: it depends on scope. That answer is useless on its own, so this guide gives you realistic ranges and, more importantly, explains which decisions push your project from one range to the next."
      },
      {
        type: "callout",
        text: "The numbers below are indicative ranges for professional studios and experienced freelancers in India in 2026. They are not a quote. A real estimate needs your actual requirements."
      },
      { type: "h2", text: "Indicative cost ranges by project type" },
      {
        type: "table",
        head: ["What you are building", "Typical range (INR)", "Typical timeline"],
        rows: [
          ["Marketing website (5–10 pages, CMS, contact forms)", "₹25,000 – ₹1,00,000", "1–3 weeks"],
          ["Internal tool or simple web app (1–2 user roles, dashboard, reports)", "₹1,00,000 – ₹3,00,000", "3–6 weeks"],
          ["MVP of a web or mobile product (login, core flow, admin panel, payments)", "₹2,00,000 – ₹6,00,000", "5–10 weeks"],
          ["AI feature added to an existing product (chatbot, document Q&A, automation)", "₹1,00,000 – ₹5,00,000", "2–6 weeks"],
          ["Multi-sided platform (customer app + vendor app + admin, notifications, payments)", "₹5,00,000 – ₹20,00,000", "3–6 months"],
          ["SaaS platform (multi-tenant, subscriptions, roles, analytics)", "₹5,00,000 – ₹20,00,000+", "2–6 months"]
        ]
      },
      { type: "h2", text: "What actually drives the cost" },
      {
        type: "p",
        text: "Two apps that look similar on the surface can differ in cost by 3–4×. These are the factors that make the difference:"
      },
      {
        type: "ul",
        items: [
          "Number of user roles. A customer-only app is one product. Customer + delivery partner + restaurant + admin is effectively four products that share a backend.",
          "Platforms. Web only, Android only, or Android + iOS + web. Cross-platform frameworks like React Native reduce the cost of supporting both mobile platforms, but each extra platform still adds testing and release work.",
          "Payments and money movement. Accepting a one-time payment through Razorpay or Stripe is straightforward. Wallets, refunds, split payouts to vendors and subscription billing are each meaningful chunks of work.",
          "Integrations. Every external system — WhatsApp, SMS, maps, ERPs, accounting software, government APIs — adds build and testing time, and some have approval processes you cannot speed up.",
          "Real-time features. Live location tracking, chat and live dashboards need more infrastructure than request-and-response screens.",
          "Admin and reporting. Almost every business app needs an admin panel. Teams often forget to budget for it, and it is frequently 20–30% of the total effort.",
          "Design maturity. If you already have finished designs in Figma, build cost drops. If you are starting from an idea, design and product decisions are part of the work."
        ]
      },
      { type: "h2", text: "Costs people forget to budget for" },
      {
        type: "ul",
        items: [
          "Hosting and infrastructure — usually small at launch (a few thousand rupees a month) but it grows with usage.",
          "Third-party services — SMS, email, maps, AI model usage and payment gateway fees are billed by those providers, not by your developer.",
          "App store accounts — Google Play has a one-time fee and Apple charges an annual developer fee.",
          "Maintenance — OS updates, library upgrades, security fixes and small changes. Many businesses budget roughly 15–20% of the initial build cost per year."
        ]
      },
      { type: "h2", text: "How to keep your first version affordable" },
      {
        type: "ol",
        items: [
          "Start with one user role and one core workflow. Add the second side of the marketplace after the first side proves demand.",
          "Use a web app or admin panel for internal users instead of a native mobile app — your staff do not need an app store download.",
          "Replace automation with manual operations at first. A person approving orders in an admin panel is cheaper than a rules engine you might not need.",
          "Use proven services (auth providers, payment gateways, hosted databases) instead of building them from scratch.",
          "Agree on a fixed scope for version 1 and keep a written “later” list. Scope creep is the most common reason budgets are exceeded."
        ]
      },
      { type: "h2", text: "Fixed price or hourly?" },
      {
        type: "p",
        text: "For a clearly scoped first version, a fixed price per milestone protects both sides: you know what you will pay, and the team knows exactly what “done” means. For ongoing work after launch, where priorities shift week to week, a monthly retainer or time-based billing is usually fairer. Be wary of any fixed quote given before anyone has asked you detailed questions about your users and workflows."
      },
      {
        type: "p",
        text: "If you want a realistic number for your specific idea, describe it in our project form. We will turn it into a scoped plan with the modules, user roles and a preliminary estimate, and a person on our team will review it before we reply."
      }
    ],
    faqs: [
      {
        question: "How much does a basic app cost in India?",
        answer: "A simple web app or internal tool with one or two user roles typically costs between ₹1 lakh and ₹3 lakh. An MVP with login, a core workflow, an admin panel and payments typically falls between ₹2 lakh and ₹6 lakh. These are indicative ranges; the actual cost depends on scope."
      },
      {
        question: "Is it cheaper to build for Android or iOS first?",
        answer: "In India, most consumer apps start with Android because of its larger user base. With a cross-platform framework such as React Native, supporting both platforms costs noticeably less than building two separate native apps, though each platform still needs its own testing and release work."
      },
      {
        question: "What are the ongoing costs after an app launches?",
        answer: "Expect hosting, third-party service fees (SMS, email, maps, AI usage, payment gateway fees), app store fees and maintenance. Many businesses budget roughly 15–20% of the initial build cost per year for maintenance and small improvements."
      }
    ]
  },
  {
    slug: "how-to-scope-an-mvp",
    title: "How to scope an MVP: deciding what goes into version 1",
    description:
      "A practical method for cutting your product idea down to a first version you can build in weeks, launch, and learn from — without shipping something embarrassing.",
    published: "2026-09-26",
    updated: "2026-09-26",
    readingMinutes: 6,
    relatedService: { label: "MVP Development", href: "/services/mvp-development" },
    projectType: "mvp",
    blocks: [
      {
        type: "p",
        text: "Most first versions fail for the same reason: they try to be the finished product. The team spends months building features for users who have not arrived yet, and by launch the budget is gone. A good MVP is not a smaller version of everything — it is the complete version of one thing."
      },
      { type: "h2", text: "Step 1: Write the one sentence your product must make true" },
      {
        type: "p",
        text: "Before listing features, write down the single outcome your first users need. For a clinic booking app it might be “a patient can book a confirmed slot with a doctor in under a minute.” For a B2B dashboard it might be “a store owner can see today's stock and sales without opening a spreadsheet.” Every feature in version 1 must directly support that sentence."
      },
      { type: "h2", text: "Step 2: Pick one user and one path" },
      {
        type: "p",
        text: "List every type of user — customers, staff, vendors, admins — and choose the one whose problem you are validating. Then map the shortest path from “opens the product” to “gets the outcome.” That path, plus the minimum admin tooling needed to operate it, is your MVP."
      },
      { type: "h2", text: "Step 3: Sort every feature into three lists" },
      {
        type: "ul",
        items: [
          "Must have — the product does not work without it (for example: sign up, create a booking, confirmation).",
          "Manual for now — needed, but a person can do it from an admin panel at first (approvals, refunds, assigning delivery partners).",
          "Later — valuable, but not needed to prove the core idea (referrals, loyalty points, advanced analytics, multiple languages)."
        ]
      },
      {
        type: "callout",
        text: "The “manual for now” list is the most powerful budget tool you have. Anything a person can handle for the first 100 users does not need to be automated yet."
      },
      { type: "h2", text: "Step 4: Choose the cheapest platform that reaches your users" },
      {
        type: "p",
        text: "If your users are businesses working at a desk, a web app is almost always the right first platform. If your users are consumers on the move, a mobile app — or a mobile-friendly web app that can be installed to the home screen — may be necessary. Do not build three platforms to validate one idea."
      },
      { type: "h2", text: "Step 5: Define what success looks like before you launch" },
      {
        type: "p",
        text: "Decide in advance which number will tell you the MVP worked: bookings per week, repeat usage, paying customers, or hours saved for your team. Add basic analytics for that number from day one, so the next version is driven by evidence instead of opinions."
      },
      { type: "h2", text: "What a well-scoped MVP typically includes" },
      {
        type: "ul",
        items: [
          "Authentication (email, phone OTP or Google sign-in)",
          "The core workflow for one user type, done properly",
          "A simple admin panel to manage users, data and exceptions",
          "Payments only if charging money is part of what you are validating",
          "Transactional notifications (email, SMS or WhatsApp) for key events",
          "Error tracking and basic analytics"
        ]
      },
      {
        type: "p",
        text: "If you are unsure what belongs in your first version, our project form will turn your idea into a draft scope — user roles, core modules, MVP scope and later scope — which our team then reviews with you."
      }
    ],
    faqs: [
      {
        question: "How long should it take to build an MVP?",
        answer: "A tightly scoped MVP for one user type and one core workflow typically takes 5–10 weeks. If the estimate is several months, the scope usually contains features that can be moved to a later version."
      },
      {
        question: "Should an MVP include payments?",
        answer: "Only if charging money is part of what you are trying to validate. Otherwise, invoice early customers manually or use payment links, and add in-app payments in a later version."
      }
    ]
  },
  {
    slug: "custom-software-vs-off-the-shelf",
    title: "Custom software vs off-the-shelf tools: how growing businesses should decide",
    description:
      "When a ready-made SaaS tool is enough, when custom software (CRM, ERP, inventory, booking) pays for itself, and how to tell the difference for your business.",
    published: "2026-09-26",
    updated: "2026-09-26",
    readingMinutes: 6,
    relatedService: { label: "Custom Systems & Automation", href: "/services/custom-systems" },
    projectType: "internal-tool",
    blocks: [
      {
        type: "p",
        text: "Most businesses should start with off-the-shelf software. It is cheaper upfront, it is ready today, and someone else maintains it. But there is a point where a business spends more time working around its tools than working with them. This guide helps you recognise that point."
      },
      { type: "h2", text: "When off-the-shelf software is the right choice" },
      {
        type: "ul",
        items: [
          "Your process is standard for your industry — accounting, payroll and email marketing rarely need custom software.",
          "Your team is small and the tool covers 80% or more of what you need.",
          "You are still figuring out your process and it changes every month.",
          "The monthly subscription is small compared to what you would spend building and maintaining an alternative."
        ]
      },
      { type: "h2", text: "Signs you have outgrown your tools" },
      {
        type: "ul",
        items: [
          "Staff copy the same data between two or three tools every day.",
          "Critical information lives in spreadsheets that one person understands.",
          "You pay for several SaaS subscriptions and still export to Excel to get the report you actually need.",
          "Customers call or WhatsApp you for things they should be able to see themselves — order status, bookings, invoices.",
          "Per-user pricing means your software bill grows faster than your revenue as you hire.",
          "Your way of working is a genuine advantage, and generic software forces you to give it up."
        ]
      },
      { type: "h2", text: "A simple way to compare the cost" },
      {
        type: "p",
        text: "Add up what the current setup costs per year: subscription fees plus the staff hours spent on manual work, re-entry and fixing mistakes. Compare that with the build cost of a custom system spread over three years, plus roughly 15–20% of the build cost per year for maintenance. If manual work is costing you several hours a day, custom software often pays for itself surprisingly quickly."
      },
      { type: "h2", text: "You do not have to replace everything" },
      {
        type: "p",
        text: "The best option is often a hybrid: keep the off-the-shelf tools that work well (accounting, email) and build a focused custom layer where the friction is — a customer portal, an order and inventory dashboard, or an automation that connects your existing tools so nobody re-types data."
      },
      { type: "h2", text: "Common custom systems for small and mid-sized businesses" },
      {
        type: "ul",
        items: [
          "Inventory and stock management across multiple branches or warehouses",
          "Booking and scheduling systems for clinics, salons, coaching centres and service businesses",
          "Lightweight CRMs built around how your sales team actually works",
          "Customer portals for order tracking, invoices and support requests",
          "Billing and invoicing with GST-ready invoices shared over WhatsApp or email",
          "Internal dashboards that combine data from several tools into one view"
        ]
      },
      {
        type: "p",
        text: "If you are not sure which side of the line you are on, describe your current workflow and where it breaks. We will tell you honestly if an existing tool would serve you better — and if not, what a focused custom system would look like."
      }
    ],
    faqs: [
      {
        question: "Is custom software worth it for a small business?",
        answer: "It is worth it when manual work, duplicated data entry or per-user subscription costs are consuming significant staff time or money, or when your process is a competitive advantage that generic tools cannot support. For standard processes like accounting, off-the-shelf software is usually the better choice."
      },
      {
        question: "Can custom software work with the tools we already use?",
        answer: "Yes. Most custom systems integrate with existing tools through their APIs — for example syncing orders with accounting software or sending updates over WhatsApp — so you replace only the part of your workflow that is causing friction."
      }
    ]
  },
  {
    slug: "hiring-a-software-development-agency",
    title: "Hiring a software development agency: what to prepare and what to ask",
    description:
      "A checklist for founders and business owners: what to prepare before you contact a development team, the questions to ask, and the red flags to watch for.",
    published: "2026-09-26",
    updated: "2026-09-26",
    readingMinutes: 6,
    relatedService: { label: "Web App Development", href: "/services/web-app-development" },
    projectType: "web-app",
    blocks: [
      {
        type: "p",
        text: "The quality of the quote you receive depends heavily on the quality of the brief you send. A two-line message gets a vague, padded estimate. A clear one-page brief gets a precise plan. Here is how to prepare, and how to evaluate who you hire."
      },
      { type: "h2", text: "What to prepare before you reach out" },
      {
        type: "ol",
        items: [
          "The problem, in one paragraph. Who has the problem, what they do today, and why that is not good enough.",
          "Your users. List each type of user (customers, staff, vendors, admins) and what each one needs to do.",
          "The core workflow. Describe the most important thing a user does, step by step.",
          "Must-haves versus later. Separate what version 1 needs from what can wait.",
          "Examples. Links to two or three apps or websites that do something similar, and what you like or dislike about them.",
          "Constraints. Your budget range, your deadline and the reason for it, and any systems the product must connect to.",
          "Existing assets. Designs, a current website or app, brand guidelines, or data that needs to be migrated."
        ]
      },
      {
        type: "callout",
        text: "Sharing a budget range is not a weakness. It lets a good team propose the best version of your product for that budget instead of guessing."
      },
      { type: "h2", text: "Questions to ask any development team" },
      {
        type: "ul",
        items: [
          "Can you show me something similar you have built, and what was hard about it?",
          "Who will actually write the code, and will I be able to talk to them directly?",
          "How often will I see working software? (Weekly demos are a good sign.)",
          "What exactly is included in the price — design, testing, deployment, app store submission, post-launch fixes?",
          "Who owns the source code, and where will it be hosted? You should own your code and your accounts.",
          "What happens after launch? How are bug fixes and changes handled and billed?"
        ]
      },
      { type: "h2", text: "Red flags" },
      {
        type: "ul",
        items: [
          "A fixed quote given before anyone asks you detailed questions.",
          "No written scope — just a total price and a deadline.",
          "No working demo until the very end of the project.",
          "Source code, hosting or app store accounts held in the agency's name with no handover plan.",
          "Every answer is “yes, we can do that” with no trade-offs discussed."
        ]
      },
      { type: "h2", text: "How we handle this at Soonlay" },
      {
        type: "p",
        text: "Our project form walks you through the questions above in a few minutes, and turns your answers into a draft brief — user roles, core modules, MVP scope and a preliminary estimate. A member of our team reviews every brief before we reply, then we agree a written scope before any build work starts."
      }
    ],
    faqs: [
      {
        question: "What should I include in a software project brief?",
        answer: "Include the problem, the types of users and what each needs to do, the core workflow step by step, must-have versus later features, examples of similar products, your budget range and deadline, required integrations, and any existing designs or systems."
      },
      {
        question: "Who should own the source code of my app?",
        answer: "You should. The contract should state that you own the source code and intellectual property, and the code, hosting and app store accounts should be in your name or transferred to you at handover."
      }
    ]
  }
]

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug)
}
