"use client"

import { useEffect, useState } from "react"
import { fetchEvents } from "@/lib/db/public"

export default function EventsListing({
  type,
  region,
}: {
  type: string | null
  region: string | null
}) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    fetchEvents().then(({ data, error }) => {
      if (error || !data) {
        console.error(error)
        setEvents([])
        setLoading(false)
        return
      }

      let results = data

      if (type) {
        results = results.filter((e) => e.event_type === type)
      }

      if (region) {
        results = results.filter(
          (e) => e.location?.toLowerCase() === region.toLowerCase()
        )
      }

      setEvents(results)
      setLoading(false)
    })
  }, [type, region])

  if (loading) return <p>Loading events...</p>
  if (events.length === 0) return <p>No events found.</p>

  return (
    <div className="grid gap-6">
      {events.map((event) => (
        <div key={event.id} className="rounded-lg border p-4">
          <h3 className="font-semibold">{event.title}</h3>
          <p className="text-sm text-muted-foreground">
            {event.location} • {new Date(event.event_date).toDateString()}
          </p>
          <span className="text-xs">{event.event_type}</span>
        </div>
      ))}
    </div>
  )
}
