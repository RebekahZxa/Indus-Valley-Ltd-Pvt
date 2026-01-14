"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import EventsFilters from "@/components/events/events-filters"
import EventsListing from "@/components/events/events-listing"

export default function EventsClient() {
  const [type, setType] = useState<string | null>(null)
  const [region, setRegion] = useState<string | null>(null)

  const clearAll = () => {
    setType(null)
    setRegion(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
              Events
            </h1>
            <p className="text-muted-foreground">
              Explore upcoming events, workshops, and live experiences
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <EventsFilters
                type={type}
                region={region}
                onChangeType={setType}
                onChangeRegion={setRegion}
                onClear={clearAll}
              />
            </aside>

            {/* Main content */}
            <div className="flex-1">
              <EventsListing type={type} region={region} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
