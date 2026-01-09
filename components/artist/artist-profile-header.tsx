"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Instagram, Twitter, Globe, Share2, Settings, Users, ImageIcon, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Artist } from "@/components/ui/artist-card"

interface ArtistProfileHeaderProps {
  artist: Artist & {
    bio?: string
    socialLinks?: {
      instagram?: string
      twitter?: string
      website?: string
    }
    stats?: {
      followers: number
      following: number
      works: number
      exhibitions: number
    }
  }
  isOwner?: boolean
}

export function ArtistProfileHeader({ artist, isOwner = false }: ArtistProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-48 md:h-64 lg:h-80 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-80" />
        <div className="absolute inset-0 bg-[url('/artist-cover-pattern.svg')] opacity-10" />
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-20 md:-mt-24 pb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-background shadow-lg">
                <Image src={artist.image || "/placeholder.svg"} alt={artist.name} fill className="object-cover" />
              </div>
              {artist.isVerified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center border-2 border-background">
                  <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">{artist.name}</h1>
                    {artist.isVerified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{artist.region}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {isOwner ? (
                    <Button variant="outline" className="bg-transparent">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => setIsFollowing(!isFollowing)}
                        className={
                          isFollowing
                            ? "bg-muted text-foreground hover:bg-muted/80"
                            : "gradient-primary text-primary-foreground"
                        }
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                      <Button variant="outline" size="icon" className="bg-transparent">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Art Forms */}
              <div className="flex flex-wrap gap-2 mt-4">
                {artist.artForms.map((form) => (
                  <Badge key={form} variant="outline" className="bg-transparent">
                    {form}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              {artist.stats && (
                <div className="flex flex-wrap gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{artist.stats.followers.toLocaleString()}</span>
                    <span className="text-muted-foreground text-sm">followers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{artist.stats.works}</span>
                    <span className="text-muted-foreground text-sm">works</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{artist.stats.exhibitions}</span>
                    <span className="text-muted-foreground text-sm">exhibitions</span>
                  </div>
                </div>
              )}

              {/* Social Links */}
              {artist.socialLinks && (
                <div className="flex gap-3 mt-4">
                  {artist.socialLinks.instagram && (
                    <a
                      href={artist.socialLinks.instagram}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  {artist.socialLinks.twitter && (
                    <a
                      href={artist.socialLinks.twitter}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {artist.socialLinks.website && (
                    <a
                      href={artist.socialLinks.website}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Website"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
