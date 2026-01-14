import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface Event {
  id: string
  title: string
  image: string
  date: string
  time: string
  location: string
  type: "event" | "workshop" | "premiere"
  artist: string
  attendees?: number
  price?: string
}

interface EventCardProps {
  event: Event
  className?: string
}

export function EventCard({ event, className }: EventCardProps) {
  const typeColors = {
    event: "bg-primary text-primary-foreground",
    workshop: "bg-secondary text-secondary-foreground",
    premiere: "bg-accent text-accent-foreground",
  }

  return (
    <Link href={`/events/${event.id}`}>
      <article
        className={cn(
          "group overflow-hidden rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300",
          className,
        )}
      >
        <div className="relative h-40 w-full">
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Badge className={cn("absolute top-3 left-3", typeColors[event.type])}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </Badge>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{event.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">by {event.artist}</p>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {event.date} • {event.time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{event.location}</span>
            </div>
            {event.attendees && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{event.attendees} attending</span>
              </div>
            )}
          </div>

          {event.price && (
            <div className="mt-3 pt-3 border-t border-border">
              <span className="font-semibold text-primary">{event.price}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
