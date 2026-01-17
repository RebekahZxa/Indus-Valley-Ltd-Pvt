"use client"

import Image from "next/image"
import { Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchEvents } from "@/lib/db/public"
import { useEffect, useState } from "react"

export function UpcomingPremieres() {
  const [events, setEvents] = useState<Premiere[]>([])

  useEffect(() => {
    fetchEvents("live").then(({ data }) => {
      const now = new Date()
      const upcoming =
        data?.filter(e => new Date(e.event_date) > now) ?? []

      setEvents(upcoming)
    })
  }, [])

  if (events.length === 0) return null

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {events.map(event => (
        <article
          key={event.id}
          className="flex gap-4 bg-card rounded-xl border border-border p-4"
        >
          <div className="relative w-48 h-32 rounded-lg overflow-hidden">
            <Image src="/premiere-placeholder.jpg" alt={event.title} fill />
            <Badge className="absolute top-2 left-2 gradient-primary text-primary-foreground">
              Premiere
            </Badge>
          </div>

          <div className="flex-1">
            <h3 className="font-semibold mb-2">{event.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {event.profiles?.full_name ?? "Artist"}
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              {new Date(event.event_date).toLocaleString()}
            </p>
            <Button variant="outline" size="sm">Set Reminder</Button>
          </div>
        </article>
      ))}
    </div>
  )
}
