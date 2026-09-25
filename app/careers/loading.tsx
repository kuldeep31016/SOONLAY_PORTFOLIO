import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CareersPageSkeleton } from "@/components/careers/CareersPageSkeleton"

export default function CareersLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <CareersPageSkeleton />
      </main>
      <Footer />
    </div>
  )
}
