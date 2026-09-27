"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { Dispatch, SetStateAction } from "react"
import { cn } from "@/lib/utils"
import { useContactModal } from "@/components/layout/ContactModalContext"

interface MobileMenuProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  links: { href: string; label: string }[]
}

export function MobileMenu({ open, setOpen, links }: MobileMenuProps) {
  const pathname = usePathname()
  const { openModal } = useContactModal()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 -z-10 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
      {open && (
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.16 }}
          className="mx-auto mt-2 max-w-7xl rounded-[1.75rem] bg-[#0c1a17]/90 p-2 shadow-2xl shadow-black/50 ring-1 ring-white/10 backdrop-blur-2xl lg:hidden"
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 pb-4 pt-2 sm:px-6 lg:px-8">
            {links.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-white/[0.06] font-medium text-primary"
                      : "text-secondary hover:bg-white/[0.07] hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                openModal({ source: "mobile-menu" })
              }}
              className="mt-2 rounded-lg bg-accent-2 px-4 py-2.5 text-sm font-semibold text-ink"
            >
              Start a Project →
            </button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

