"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WorkshopsFilters } from "@/components/workshops/workshops-filters"
import { WorkshopsListing } from "@/components/workshops/workshops-listing"

export default function WorkshopsClient() {
  const [category, setCategory] = useState<string | null>(null)

  const clearAll = () => {
    setCategory(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
            Workshops
          </h1>
          <p className="text-muted-foreground mb-6">
            Learn from professional artists through hands-on workshops
          </p>

          <WorkshopsFilters
            category={category}
            onChangeCategory={setCategory}
            onClear={clearAll}
          />

          <WorkshopsListing category={category} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
