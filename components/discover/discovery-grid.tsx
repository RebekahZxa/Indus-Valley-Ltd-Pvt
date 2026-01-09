"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { ArtistCard } from "@/components/ui/artist-card"
import { mockArtists } from "@/lib/mock-data"
import type { Artist } from "@/components/ui/artist-card"

// Extend mock data for infinite scroll demonstration
const extendedArtists: Artist[] = [
  ...mockArtists,
  {
    id: "9",
    name: "Ana Martinez",
    image: "/female-muralist-street-art-painting.jpg",
    artForms: ["Muralist", "Street Artist"],
    region: "Mexico City, Mexico",
    followers: 8200,
    isVerified: true,
  },
  {
    id: "10",
    name: "Raj Sharma",
    image: "/male-musician-sitar-classical-indian.jpg",
    artForms: ["Musician", "Sitar Player"],
    region: "Delhi, India",
    followers: 4500,
    isVerified: false,
  },
  {
    id: "11",
    name: "Ingrid Larsen",
    image: "/female-glassblower-artisan-craft.jpg",
    artForms: ["Glassblower", "Artisan"],
    region: "Copenhagen, Denmark",
    followers: 3800,
    isVerified: true,
  },
  {
    id: "12",
    name: "Chen Wei",
    image: "/male-traditional-chinese-painter.jpg",
    artForms: ["Painter", "Calligrapher"],
    region: "Beijing, China",
    followers: 12000,
    isVerified: true,
  },
]

export function DiscoveryGrid() {
  const [artists, setArtists] = useState<Artist[]>(extendedArtists.slice(0, 8))
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const currentLength = artists.length
    const nextArtists = extendedArtists.slice(currentLength, currentLength + 4)

    if (nextArtists.length === 0) {
      setHasMore(false)
    } else {
      setArtists((prev) => [...prev, ...nextArtists])
    }

    setIsLoading(false)
  }

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      { threshold: 0.1 },
    )

    const sentinel = document.getElementById("scroll-sentinel")
    if (sentinel) {
      observer.observe(sentinel)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading])

  // Pinterest-style masonry with varying heights
  const getRandomHeight = (index: number) => {
    const heights = ["h-64", "h-72", "h-80", "h-64", "h-72"]
    return heights[index % heights.length]
  }

  return (
    <div>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {artists.map((artist, index) => (
          <div key={artist.id} className="break-inside-avoid">
            <ArtistCard artist={artist} className={getRandomHeight(index)} />
          </div>
        ))}
      </div>

      {/* Scroll sentinel for infinite loading */}
      <div id="scroll-sentinel" className="h-20 flex items-center justify-center mt-8">
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more artists...</span>
          </div>
        )}
        {!hasMore && artists.length > 0 && (
          <p className="text-muted-foreground text-sm">You&apos;ve seen all artists</p>
        )}
      </div>
    </div>
  )
}
