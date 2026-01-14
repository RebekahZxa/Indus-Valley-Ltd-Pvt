import Image from "next/image"
import { Calendar, MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const exhibitions = [
  {
    id: "1",
    title: "Colors of the Soul",
    venue: "Modern Art Gallery, Barcelona",
    date: "Jan 15 - Feb 28, 2026",
    status: "ongoing",
    image: "/exhibition-gallery-modern.jpg",
  },
  {
    id: "2",
    title: "Nature Reimagined",
    venue: "Contemporary Art Museum, Paris",
    date: "Mar 10 - Apr 30, 2026",
    status: "upcoming",
    image: "/exhibition-nature-art.jpg",
  },
]

export function ArtistExhibitions() {
  return (
    <section className="bg-card rounded-xl p-6 border border-border">
      <h2 className="font-serif text-xl font-semibold mb-6 text-foreground">Digital Exhibitions</h2>

      <div className="space-y-4">
        {exhibitions.map((exhibition) => (
          <div
            key={exhibition.id}
            className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="w-full sm:w-32 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={exhibition.image || "/placeholder.svg"}
                alt={exhibition.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-foreground">{exhibition.title}</h3>
                <Badge
                  variant={exhibition.status === "ongoing" ? "default" : "secondary"}
                  className={exhibition.status === "ongoing" ? "gradient-primary text-primary-foreground" : ""}
                >
                  {exhibition.status === "ongoing" ? "Ongoing" : "Upcoming"}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                <span>{exhibition.venue}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" />
                <span>{exhibition.date}</span>
              </div>
              <Button variant="link" className="p-0 h-auto mt-2 text-primary">
                View Exhibition <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
