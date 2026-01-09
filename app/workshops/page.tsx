import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WorkshopsListing } from "@/components/workshops/workshops-listing"
import { WorkshopsFilters } from "@/components/workshops/workshops-filters"

export const metadata: Metadata = {
  title: "Workshops - Indus Valley Pvt Ltd",
  description: "Learn from professional artists through workshops and masterclasses",
}

export default function WorkshopsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showSearch />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-balance">Workshops</h1>
            <p className="text-muted-foreground">Learn from professional artists through hands-on workshops</p>
          </div>

          <WorkshopsFilters />
          <WorkshopsListing />
        </div>
      </main>
      <Footer />
    </div>
  )
}
