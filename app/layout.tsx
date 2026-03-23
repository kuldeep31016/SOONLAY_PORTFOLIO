import type { Metadata } from "next"
import "./globals.css"
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google"
import { siteMetadata } from "@/lib/metadata"
import { organizationSchema, websiteSchema } from "@/lib/schema"
import { Analytics } from "@vercel/analytics/react"
import { ReactNode } from "react"
import { ContactModalProvider } from "@/components/layout/ContactModalContext"

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap"
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap"
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap"
})

export const metadata: Metadata = siteMetadata

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-primary">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema])
          }}
        />
        <ContactModalProvider>
          {children}
        </ContactModalProvider>
        <Analytics />
      </body>
    </html>
  )
}

