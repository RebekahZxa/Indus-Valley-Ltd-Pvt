import Image from "next/image"
import Link from "next/link"
import { Clock, Users, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const workshops = [
  {
    id: "1",
    title: "Abstract Art Fundamentals",
    artist: "Elena Rodriguez",
    artistImage: "/female-portrait-artist-painting-studio.jpg",
    image: "/workshop-abstract-painting.jpg",
    duration: "4 hours",
    participants: "15 max",
    level: "Beginner",
    rating: 4.9,
    reviews: 128,
    price: "€75",
    nextDate: "Feb 20, 2026",
  },
  {
    id: "2",
    title: "Documentary Filmmaking 101",
    artist: "Marcus Chen",
    artistImage: "/male-filmmaker-with-camera-cinematography.jpg",
    image: "/workshop-filmmaking.jpg",
    duration: "8 hours",
    participants: "20 max",
    level: "Intermediate",
    rating: 4.8,
    reviews: 89,
    price: "$150",
    nextDate: "Mar 5, 2026",
  },
  {
    id: "3",
    title: "Classical Kathak Dance",
    artist: "Aisha Patel",
    artistImage: "/female-dancer-classical-indian-dance.jpg",
    image: "/workshop-dance.jpg",
    duration: "6 hours",
    participants: "12 max",
    level: "All Levels",
    rating: 5.0,
    reviews: 56,
    price: "₹2,500",
    nextDate: "Feb 28, 2026",
  },
  {
    id: "4",
    title: "Japanese Pottery Techniques",
    artist: "Yuki Tanaka",
    artistImage: "/female-ceramicist-pottery-artisan-craft.jpg",
    image: "/workshop-pottery.jpg",
    duration: "5 hours",
    participants: "8 max",
    level: "Beginner",
    rating: 4.9,
    reviews: 72,
    price: "¥8,000",
    nextDate: "Mar 10, 2026",
  },
]

export function WorkshopsListing() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {workshops.map((workshop) => (
        <Link key={workshop.id} href={`/workshops/${workshop.id}`}>
          <article className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-md transition-all duration-300">
            <div className="relative h-40">
              <Image
                src={workshop.image || "/placeholder.svg"}
                alt={workshop.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Badge className="absolute top-3 left-3 bg-card text-foreground">{workshop.level}</Badge>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{workshop.title}</h3>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <Image
                    src={workshop.artistImage || "/placeholder.svg"}
                    alt={workshop.artist}
                    width={24}
                    height={24}
                    className="object-cover"
                  />
                </div>
                <span className="text-sm text-muted-foreground">{workshop.artist}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{workshop.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{workshop.participants}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-current" />
                  <span className="font-medium text-foreground">{workshop.rating}</span>
                  <span className="text-sm text-muted-foreground">({workshop.reviews})</span>
                </div>
                <span className="font-bold text-primary">{workshop.price}</span>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}
