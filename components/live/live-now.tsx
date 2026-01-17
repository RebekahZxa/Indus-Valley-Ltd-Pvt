"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { fetchEvents } from "@/lib/db/public"
import { useEffect, useState } from "react"

type LiveEvent = {
  id: string
  title: string
  event_date: string
  profiles?: {
    full_name: string | null
  }
}

export function LiveNow() {
  const [events, setEvents] = useState<LiveEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents("live").then(({ data }) => {
      const now = new Date()
      const liveNow =
        data?.filter(e => new Date(e.event_date) <= now) ?? []

      setEvents(liveNow)
      setLoading(false)
    })
  }, [])

  if (loading) return null
  if (events.length === 0) return <p className="text-muted-foreground">No live streams right now.</p>

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <Link key={event.id} href={`/live/${event.id}`}>
          <article className="group relative bg-card rounded-xl overflow-hidden border border-border">
            <div className="relative aspect-video">
              <Image
                src="/live-placeholder.jpg"
                alt={event.title}
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-card/90 flex items-center justify-center">
                  <Play className="h-6 w-6 fill-current" />
                </div>
              </div>

              <Badge className="absolute top-3 left-3 bg-red-500 text-white border-none">
                LIVE
              </Badge>

              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-foreground/80 text-card px-2 py-1 rounded text-sm">
                <Users className="h-3 w-3" />
                Live
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold mb-2">{event.title}</h3>
              <p className="text-sm text-muted-foreground">
                {event.profiles?.full_name ?? "Artist"}
              </p>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}
