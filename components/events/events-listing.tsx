import { EventCard } from "@/components/ui/event-card"
import { mockEvents } from "@/lib/mock-data"

export function EventsListing() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
