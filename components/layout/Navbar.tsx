"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { serviceLinks } from "@/lib/services"
import { Logo } from "@/components/ui/Logo"
import { MobileMenu } from "@/components/layout/MobileMenu"
import { useContactModal } from "@/components/layout/ContactModalContext"

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" }
]

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { openModal } = useContactModal()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={cn("fixed inset-x-0 top-0 z-40 border-b bg-surface transition-[box-shadow,border-color] duration-500", scrolled ? "border-border shadow-[0_10px_30px_-20px_rgba(28,24,16,0.35)]" : "border-transparent")}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Soonlay home">
          <Logo priority />
        </Link>

        <nav className="hidden h-full items-center gap-10 lg:flex">
          {links.map((link) => {
            const isActive = isActivePath(pathname, link.href)
            const label = (
              <span
                className={cn(
                  "flex h-full items-center gap-1 text-sm font-medium transition-colors duration-300",
                  isActive ? "text-primary" : "text-secondary group-hover/link:text-primary"
                )}
              >
                <span className="link-underline" data-active={isActive ? "" : undefined}>
                  {link.label}
                </span>
                {link.href === "/services" && (
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:rotate-180" />
                )}
              </span>
            )

            if (link.href !== "/services") {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className="group/link flex h-full items-center"
                >
                  {label}
                </Link>
              )
            }

            return (
              <div key={link.href} className="group relative flex h-full items-center">
                <Link href={link.href} aria-current={isActive ? "page" : undefined} className="group/link flex h-full items-center">
                  {label}
                </Link>
                <div className="invisible absolute left-1/2 top-full w-[460px] -translate-x-1/2 translate-y-2 pt-2 opacity-0 transition-all duration-500 [transition-timing-function:var(--ease-spring)] group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="grid grid-cols-2 gap-1 rounded-[1.4rem] bg-surface p-2 shadow-[0_30px_60px_-20px_rgba(28,24,16,0.28)] ring-1 ring-black/5">
                    {serviceLinks.map((service, index) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        style={{ transitionDelay: `${index * 40}ms` }}
                        className="rounded-2xl p-3.5 opacity-0 transition-all duration-500 [transition-timing-function:var(--ease-spring)] hover:bg-surface-2 group-hover:opacity-100 group-focus-within:opacity-100"
                      >
                        <p className="text-sm font-medium text-primary">{service.title}</p>
                        <p className="mt-0.5 text-xs text-muted">{service.body}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={() => openModal({ source: "navbar" })}
          className="group hidden items-center gap-3 rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white transition-transform duration-500 [transition-timing-function:var(--ease-spring)] active:scale-[0.97] lg:inline-flex"
        >
          Start a Project
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-2 text-primary transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:translate-x-0.5 group-hover:scale-105">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </button>

        <button
          className="inline-flex items-center justify-center rounded-lg border border-border bg-surface p-2 text-primary hover:border-border-bright lg:hidden"
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
