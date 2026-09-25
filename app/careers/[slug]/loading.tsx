import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { JobDetailSkeleton } from "@/components/careers/JobDetailSkeleton"

export default function JobLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <JobDetailSkeleton />
      </main>
      <Footer />
    </div>
  )
}
