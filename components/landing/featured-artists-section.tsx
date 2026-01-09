import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArtistCard } from "@/components/ui/artist-card"
import { mockArtists } from "@/lib/mock-data"

export function FeaturedArtistsSection() {
  const featuredArtists = mockArtists.slice(0, 4)

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-balance">Featured Artists</h2>
            <p className="text-muted-foreground">Discover talented creators from around the world</p>
          </div>
          <Link href="/discover">
            <Button variant="ghost" className="group">
              View all artists
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
    </section>
  )
}
