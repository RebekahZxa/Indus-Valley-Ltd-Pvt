import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { EventsListing } from "@/components/events/events-listing"
import { EventsFilters } from "@/components/events/events-filters"

export const metadata: Metadata = {
  title: "Events - Artistry",
  description: "Discover exhibitions, performances, and premieres from artists worldwide",
}

export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showSearch />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-balance">Events</h1>
            <p className="text-muted-foreground">Discover exhibitions, performances, and premieres</p>
          </div>

          <EventsFilters />
          <EventsListing />
        </div>
      </main>
      <Footer />
    </div>
  )
}
