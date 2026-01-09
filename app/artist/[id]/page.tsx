import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ArtistProfileHeader } from "@/components/artist/artist-profile-header"
import { ArtistAbout } from "@/components/artist/artist-about"
import { ArtistPortfolio } from "@/components/artist/artist-portfolio"
import { ArtistExhibitions } from "@/components/artist/artist-exhibitions"
import { ArtistEvents } from "@/components/artist/artist-events"
import { ArtistWorkshops } from "@/components/artist/artist-workshops"
import { ArtistMonetization } from "@/components/artist/artist-monetization"
import { mockArtists } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Artist Profile - Artistry",
  description: "View artist portfolio, exhibitions, events, and workshops",
}

export default async function ArtistProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // In production, this would fetch from database
  const artist = mockArtists.find((a) => a.id === id) || mockArtists[0]

  // Mock data for this artist's profile
  const artistData = {
    ...artist,
    bio: "Award-winning artist with over 15 years of experience creating works that explore the intersection of nature and human emotion. My art has been exhibited in galleries across three continents, and I'm passionate about sharing my knowledge through workshops and mentorship programs.",
    socialLinks: {
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      website: "https://example.com",
    },
    stats: {
      followers: artist.followers || 0,
      following: 234,
      works: 89,
      exhibitions: 12,
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn />
      <main className="flex-1">
        <ArtistProfileHeader artist={artistData} isOwner={false} />

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <ArtistAbout bio={artistData.bio} />
              <ArtistPortfolio />
              <ArtistExhibitions />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ArtistMonetization />
              <ArtistEvents artistName={artist.name} />
              <ArtistWorkshops artistName={artist.name} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
