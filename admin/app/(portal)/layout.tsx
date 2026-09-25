import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { requirePortalSession } from "@/lib/session"
import AdminShell from "@/components/admin-shell"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  robots: { index: false, follow: false }
}

export default async function PortalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requirePortalSession()
  if (!session) {
    redirect("/login")
  }
  return <AdminShell email={session.email}>{children}</AdminShell>
}
