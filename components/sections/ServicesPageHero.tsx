"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Code2, Cloud, Smartphone, Globe2 } from "lucide-react"
import { useContactModal } from "@/components/layout/ContactModalContext"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "backOut" }
  }
}

const services = [
  {
    title: "Web App Development",
    icon: Globe2,
    description:
      "Custom, responsive, and scalable web applications using modern frameworks like Next.js and TypeScript."
  },
  {
    title: "Mobile App Development",
    icon: Smartphone,
    description:
      "Native-feel mobile apps for iOS and Android built with React Native and a focus on smooth UX."
  },
  {
    title: "SaaS Development",
    icon: Cloud,
    description:
      "Multi-tenant SaaS platforms with billing, user management, analytics dashboards, and secure infrastructure."
  },
  {
    title: "AI & LLM Solutions",
    icon: Code2,
    description:
      "Intelligent products using OpenAI, Gemini, and Claude — from chatbots and agents to RAG search and automation."
  }
]

export function ServicesPageHero() {
  const { openModal } = useContactModal()

  return (
    <section className="relative overflow-hidden bg-gradient-dark pb-20 pt-24 sm:pt-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="mesh-gradient" />
        <div className="absolute -left-40 top-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-accent-2/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-5"
          >
            <Badge>Services</Badge>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="mb-4 font-display text-3xl tracking-tight text-primary sm:text-4xl md:text-5xl"
          >
            Our Services
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="max-w-xl text-sm text-secondary sm:text-base"
          >
            From concept to launch, we specialize in building scalable,
            production-ready digital products tailored to how founders actually
            operate.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.45 }}
            className="mt-6"
          >
            <Button size="md" className="group" onClick={openModal}>
              <span className="mr-1">Start a Project</span>
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Button>
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 md:grid-cols-2"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={scaleIn}
              className={cn(
                "card-surface card-hover-glow relative flex flex-col justify-between overflow-hidden p-6 sm:p-7 md:p-8",
                "bg-surface/80"
              )}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-accent/40" />
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <service.icon className="h-5 w-5" />
                </div>
                <h2 className="font-display text-lg text-primary sm:text-xl">
                  {service.title}
                </h2>
              </div>
              <p className="mb-6 text-sm text-secondary">
                {service.description}
              </p>
              <button className="group inline-flex items-center text-xs font-medium text-accent">
                Learn More{" "}
                <span className="ml-1 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

