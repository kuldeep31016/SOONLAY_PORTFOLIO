import type { Metadata } from "next"
import "./globals.css"
import { Fraunces, DM_Sans, JetBrains_Mono } from "next/font/google"
import { siteMetadata } from "@/lib/metadata"
import { organizationSchema, websiteSchema } from "@/lib/schema"
import { Analytics } from "@vercel/analytics/react"
import { ReactNode } from "react"
import { ContactModalProvider } from "@/components/layout/ContactModalContext"
import { JsonLd } from "@/components/ui/JsonLd"
import { RevealObserver } from "@/components/ui/RevealObserver"

const display = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  variable: "--font-display",
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
      className={`${display.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.setAttribute('data-js','')" }} />
      </head>
      <body className="min-h-screen bg-background text-primary">
        <JsonLd data={[organizationSchema, websiteSchema]} />
        <ContactModalProvider>
          {children}
        </ContactModalProvider>
        <RevealObserver />
        <Analytics />
      </body>
    </html>
  )
}

