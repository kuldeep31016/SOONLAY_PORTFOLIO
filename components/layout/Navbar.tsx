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
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={cn(
          "mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full pl-3 pr-2 transition-all duration-500 sm:pl-4 lg:h-16 lg:px-3",
          scrolled || open ? "glass" : "lg:bg-transparent lg:shadow-none"
        )}
      >
        <Link href="/" aria-label="Soonlay home" className="flex-shrink-0">
          <Logo priority />
        </Link>

        <nav className="glass hidden h-12 items-center gap-1 rounded-full p-1.5 pl-3 lg:flex">
          {links.map((link) => {
            const isActive = isActivePath(pathname, link.href)
            const label = (
              <span
                className={cn(
                  "flex items-center gap-1 rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors duration-300",
                  isActive ? "bg-white/10 text-primary" : "text-secondary hover:bg-white/[0.06] hover:text-primary"
                )}
              >
                {link.label}
                {link.href === "/services" && (
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:rotate-180" />
                )}
              </span>
            )

            if (link.href !== "/services") {
              return (
                <Link key={link.href} href={link.href} aria-current={isActive ? "page" : undefined}>
                  {label}
                </Link>
              )
            }

            return (
              <div key={link.href} className="group relative">
                <Link href={link.href} aria-current={isActive ? "page" : undefined}>
                  {label}
                </Link>
                <div className="invisible absolute left-1/2 top-full w-[480px] -translate-x-1/2 translate-y-2 pt-4 opacity-0 transition-all duration-500 [transition-timing-function:var(--ease-spring)] group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="grid grid-cols-2 gap-1 rounded-[1.6rem] bg-[#0c1a17]/95 p-2 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10 backdrop-blur-2xl">
                    {serviceLinks.map((service, index) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        style={{ transitionDelay: `${index * 40}ms` }}
                        className="rounded-2xl p-3.5 opacity-0 transition-all duration-500 [transition-timing-function:var(--ease-spring)] hover:bg-white/[0.07] group-focus-within:opacity-100 group-hover:opacity-100"
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
          <button
            type="button"
            onClick={() => openModal({ source: "navbar" })}
            className="group ml-2 inline-flex items-center gap-3 rounded-full bg-accent-2 py-1 pl-4 pr-1 text-[13.5px] font-semibold text-ink transition-transform duration-500 [transition-timing-function:var(--ease-spring)] active:scale-[0.97]"
          >
            Start a Project
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-accent-2 transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:translate-x-0.5">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>
        </nav>

        <p className="hidden w-[150px] text-right text-[13px] text-secondary lg:block">
          <span className="hidden xl:inline">Software, built with care.</span>
        </p>

        <button
          className="glass inline-flex h-10 w-10 items-center justify-center rounded-full text-primary lg:hidden"
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
