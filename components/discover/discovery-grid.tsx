"use client"

import { useEffect, useState } from "react"
import { fetchArtists } from "@/lib/db/public"

type ArtistProfile = {
  id: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
}

type Artist = {
  id: string
  category: string | null
  location: string | null
  verified: boolean
  profiles: ArtistProfile[]
}

type DiscoveryGridProps = {
  search?: string
  categories?: string[]
  region?: string
}

export function DiscoveryGrid({
  search = "",
  categories = [],
  region,
}: DiscoveryGridProps) {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    fetchArtists().then(({ data, error }) => {
      if (error || !data) {
        console.error("Error fetching artists:", error)
        setArtists([])
        setLoading(false)
        return
      }

      let results = data as Artist[]

      /* 🔍 SEARCH FILTER */
      if (search.trim() !== "") {
        const q = search.toLowerCase()
        results = results.filter((artist) => {
          const profile = artist.profiles[0]
          return (
            profile?.full_name?.toLowerCase().includes(q) ||
            artist.category?.toLowerCase().includes(q) ||
            artist.location?.toLowerCase().includes(q)
          )
        })
      }

      /* 🎨 CATEGORY FILTER */
      if (categories.length > 0) {
        results = results.filter((artist) =>
          categories.includes(artist.category ?? "")
        )
      }

      /* 🌍 REGION FILTER */
      if (region) {
        results = results.filter(
          (artist) =>
            artist.location?.toLowerCase() === region.toLowerCase()
        )
      }

      setArtists(results)
      setLoading(false)
    })
  }, [search, categories, region])

  if (loading) {
    return <p className="text-muted-foreground">Loading artists...</p>
  }

  if (artists.length === 0) {
    return <p className="text-muted-foreground">No artists found.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {artists.map((artist) => {
        const profile = artist.profiles[0]

        return (
          <div
            key={artist.id}
            className="rounded-lg border bg-card p-4 hover:shadow-md transition"
          >
            <img
              src={profile?.avatar_url || "/placeholder-avatar.png"}
              alt={profile?.full_name || "Artist"}
              className="h-48 w-full object-cover rounded-md mb-4"
            />

            <h3 className="font-semibold text-lg">
              {profile?.full_name || "Unknown Artist"}
            </h3>

            <p className="text-sm text-muted-foreground">
              {artist.category ?? "Uncategorized"} •{" "}
              {artist.location ?? "Unknown location"}
            </p>

            {artist.verified && (
              <span className="inline-block mt-2 text-xs text-green-600 font-medium">
                ✔ Verified
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
