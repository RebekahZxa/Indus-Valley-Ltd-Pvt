"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EventCard } from "@/components/ui/event-card"
import { supabase } from "@/lib/supabase/client"

type UpcomingEvent = {
  id: string
  title: string
  event_type: string
  event_date: string
  location: string | null
  profiles: {
    full_name: string | null
  }[]
}

export function UpcomingEventsSection() {
  const [events, setEvents] = useState<UpcomingEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from("events")
      .select(`
        id,
        title,
        event_type,
        event_date,
        location,
        profiles:created_by (
          full_name
        )
      `)
      .gt("event_date", new Date().toISOString())
      .order("event_date", { ascending: true })
      .limit(3)
      .then(({ data, error }) => {
        if (!error && data) {
          setEvents(data)
        }
        setLoading(false)
      })
  }, [])

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-balance">
              Upcoming Events
            </h2>
            <p className="text-muted-foreground">
              Don&apos;t miss out on workshops, exhibitions, and performances
            </p>
          </div>
          <Link href="/events">
            <Button variant="ghost" className="group">
              View all events
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading events…</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const organizer = event.profiles[0]

              return (
                <EventCard
                  key={event.id}
                  event={{
                    id: event.id,
                    title: event.title,
                    date: event.event_date,
                    location: event.location,
                    organizer: organizer?.full_name ?? "Indus Valley",
                    type: event.event_type, // ✅ THIS FIXES THE CRASH
                  }}
                />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
