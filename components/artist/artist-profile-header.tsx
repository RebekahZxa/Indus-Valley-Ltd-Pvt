"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Instagram, Twitter, Globe, Share2, Settings, Users, ImageIcon, Award, ZoomIn } from "lucide-react"
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
  const [showModal, setShowModal] = useState(false)

  return (
    <>
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
              {/* Avatar - Circular Instagram Style */}
              <div 
                className="relative cursor-pointer group shrink-0"
                onClick={() => setShowModal(true)}
              >
                <Image 
                  src={artist.image || "/placeholder.svg"} 
                  alt={artist.name} 
                  width={160} 
                  height={160} 
                  className="h-40 w-40 rounded-full border-4 border-pink-400 object-cover"
                  priority
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 flex items-center justify-center border-4 border-pink-400">
                  <ZoomIn className="text-white h-6 w-6" />
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
            </div>

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

      {/* Full Profile Photo Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-pointer"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl"
            >
              ✕
            </button>

            {/* Circular photo container */}
            <Image
              src={artist.image || "/placeholder.svg"}
              alt={artist.name}
              width={288}
              height={288}
              className="h-72 w-72 rounded-full border-4 border-pink-400 object-cover"
              priority
            />
            </div>

            {/* Profile info below photo */}
            <div className="mt-6 text-center text-white">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-xl font-semibold">
                  {artist.name}
                </h3>
                {artist.isVerified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              {artist.bio && (
                <p className="text-sm text-gray-200 mt-3">
                  {artist.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
