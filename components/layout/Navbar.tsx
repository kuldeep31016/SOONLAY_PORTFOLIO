"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { MobileMenu } from "@/components/layout/MobileMenu"
import { useContactModal } from "@/components/layout/ContactModalContext"

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { openModal } = useContactModal()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors",
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : ""
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex items-center gap-1">
            <span className="font-display text-xl font-bold tracking-tight">
              Soonlay
            </span>
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative flex flex-col items-center text-sm"
            >
              <span
                className={cn(
                  "transition-colors",
                  pathname === link.href
                    ? "text-primary"
                    : "text-secondary group-hover:text-primary"
                )}
              >
                {link.label}
              </span>
              <span
                className={cn(
                  "mt-1 h-0.5 w-0 rounded-full bg-transparent opacity-0 transition-all duration-300",
                  pathname === link.href &&
                    "w-10 bg-gradient-accent opacity-100 shadow-[0_0_18px_rgba(110,231,183,0.8)]"
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          <Button size="sm" className="group" onClick={openModal}>
            <span className="mr-1">Start a Project</span>
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Button>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-full border border-border bg-surface/80 p-2 text-secondary hover:border-border-bright md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <MobileMenu open={open} setOpen={setOpen} links={links} />
    </header>
  )
}

