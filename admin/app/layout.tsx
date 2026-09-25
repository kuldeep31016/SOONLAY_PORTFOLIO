import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Soonlay Careers Admin",
    template: "%s | Soonlay Careers Admin"
  },
  description: "Private careers operations workspace for Soonlay.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light"
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
