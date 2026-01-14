"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DiscoveryGrid } from "@/components/discover/discovery-grid"
import { DiscoveryFilters } from "@/components/discover/discovery-filters"
import { DiscoverySearch } from "@/components/discover/discovery-search"

export default function DiscoverClient() {
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [regions, setRegions] = useState<string[]>([])

  const clearAll = () => {
    setSearch("")
    setCategories([])
    setRegions([])
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showSearch />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-balance">
              Discover Artists
            </h1>
            <p className="text-muted-foreground">
              Explore talented creators from around the world
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <DiscoveryFilters
                categories={categories}
                regions={regions}
                onChangeCategories={setCategories}
                onChangeRegions={setRegions}
                onClear={clearAll}
              />
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <DiscoverySearch
                value={search}
                onChange={setSearch}
                onClear={clearAll}
              />

              <DiscoveryGrid
                search={search}
                categories={categories}
                region={regions[0]} // using first region for now
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
