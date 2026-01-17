"use client"

import { useEffect, useState } from "react"
import { fetchEvents } from "@/lib/db/public"

type Workshop = {
  id: string
  title: string
  description: string | null
  event_type: "workshop"
  event_date: string
  location: string | null
  category: string | null
  profiles: {
    full_name: string | null
  }[]
}

type WorkshopsListingProps = {
  category: string | null
}

export function WorkshopsListing({ category }: WorkshopsListingProps) {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    fetchEvents("workshop").then(({ data, error }) => {
      if (error || !data) {
        console.error("Error fetching workshops:", error)
        setWorkshops([])
        setLoading(false)
        return
      }

      let results = data as Workshop[]

      if (category) {
        results = results.filter((w) => w.category === category)
      }

      setWorkshops(results)
      setLoading(false)
    })
  }, [category])

  if (loading) {
    return <p className="text-muted-foreground">Loading workshops...</p>
  }

  if (workshops.length === 0) {
    return <p className="text-muted-foreground">No workshops found.</p>
  }

  return (
    <div className="grid gap-6">
      {workshops.map((w) => (
        <div
          key={w.id}
          className="rounded-xl border bg-card p-4 hover:shadow-md transition"
        >
          <h3 className="font-semibold text-lg">{w.title}</h3>

          {w.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {w.description}
            </p>
          )}

          <p className="text-xs text-muted-foreground mt-2">
            {w.category ?? "Uncategorized"}
          </p>
        </div>
      ))}
    </div>
  )
}
