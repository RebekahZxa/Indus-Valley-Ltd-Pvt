import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface Artist {
  id: string
  name: string
  image: string
  artForms: string[]
  region: string
  followers?: number
  isVerified?: boolean
}

interface ArtistCardProps {
  artist: Artist
  className?: string
  size?: "sm" | "md" | "lg"
}

export function ArtistCard({ artist, className, size = "md" }: ArtistCardProps) {
  const heights = {
    sm: "h-48",
    md: "h-64",
    lg: "h-80",
  }

  return (
    <Link href={`/artist/${artist.id}`}>
      <article
        className={cn(
          "group relative overflow-hidden rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300",
          className,
        )}
      >
        <div className={cn("relative w-full", heights[size])}>
          <Image
            src={artist.image || "/placeholder.svg"}
            alt={artist.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-card truncate">{artist.name}</h3>
            {artist.isVerified && (
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-card/80 text-sm mb-2">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{artist.region}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {artist.artForms.slice(0, 2).map((form) => (
              <Badge key={form} variant="secondary" className="text-xs bg-card/20 text-card border-none">
                {form}
              </Badge>
            ))}
            {artist.artForms.length > 2 && (
              <Badge variant="secondary" className="text-xs bg-card/20 text-card border-none">
                +{artist.artForms.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
