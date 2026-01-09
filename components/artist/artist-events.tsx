import { Calendar, MapPin, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ArtistEventsProps {
  artistName: string
}

const events = [
  {
    id: "1",
    title: "Live Painting Session",
    date: "Feb 20, 2026",
    time: "7:00 PM",
    location: "Virtual Event",
    price: "€15",
  },
  {
    id: "2",
    title: "Gallery Opening Night",
    date: "Mar 5, 2026",
    time: "6:00 PM",
    location: "Barcelona, Spain",
    price: "Free",
  },
]

export function ArtistEvents({ artistName }: ArtistEventsProps) {
  return (
    <section className="bg-card rounded-xl p-6 border border-border">
      <h2 className="font-serif text-lg font-semibold mb-4 text-foreground">Upcoming Events</h2>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="p-4 rounded-lg bg-muted/50">
            <h3 className="font-medium text-foreground mb-2">{event.title}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>
                  {event.date} • {event.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="h-3 w-3" />
                <span>{event.price}</span>
              </div>
            </div>
            <Button size="sm" className="w-full mt-3 gradient-primary text-primary-foreground">
              Get Tickets
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
