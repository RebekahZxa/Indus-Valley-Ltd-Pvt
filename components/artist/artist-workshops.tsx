import { Clock, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ArtistWorkshopsProps {
  artistName: string
}

const workshops = [
  {
    id: "1",
    title: "Abstract Art Fundamentals",
    duration: "4 hours",
    participants: "15 max",
    rating: 4.9,
    price: "€75",
  },
  {
    id: "2",
    title: "Color Theory Masterclass",
    duration: "6 hours",
    participants: "10 max",
    rating: 4.8,
    price: "€120",
  },
]

export function ArtistWorkshops({ artistName }: ArtistWorkshopsProps) {
  return (
    <section className="bg-card rounded-xl p-6 border border-border">
      <h2 className="font-serif text-lg font-semibold mb-4 text-foreground">Workshops</h2>

      <div className="space-y-4">
        {workshops.map((workshop) => (
          <div key={workshop.id} className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-medium text-foreground">{workshop.title}</h3>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                {workshop.rating}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>{workshop.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                <span>{workshop.participants}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="font-semibold text-primary">{workshop.price}</span>
              <Button size="sm" variant="outline" className="bg-transparent">
                Learn More
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
