import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EventCard } from "@/components/ui/event-card"
import { mockEvents } from "@/lib/mock-data"

export function UpcomingEventsSection() {
  const upcomingEvents = mockEvents.slice(0, 3)

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-balance">Upcoming Events</h2>
            <p className="text-muted-foreground">Don&apos;t miss out on workshops, exhibitions, and performances</p>
          </div>
          <Link href="/events">
            <Button variant="ghost" className="group">
              View all events
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  )
}
