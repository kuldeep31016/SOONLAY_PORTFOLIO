"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed")
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    )

    const stagger = (el: HTMLElement) => {
      if (el.style.getPropertyValue("--reveal-delay") || !el.parentElement) return
      const siblings = [...el.parentElement.children].filter((c) => c.hasAttribute("data-reveal"))
      const i = siblings.indexOf(el)
      if (i > 0) el.style.setProperty("--reveal-delay", `${Math.min(i, 8) * 70}ms`)
    }

    const watch = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)").forEach((el) => {
        stagger(el)
        io.observe(el)
      })
    }
    watch(document)

    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches("[data-reveal]")) io.observe(node)
            watch(node)
          }
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])

  return null
}
