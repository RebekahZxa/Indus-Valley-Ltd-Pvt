import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Play, Users, Radio, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Live - Artistry",
  description: "Watch live streams and premieres from artists",
}

const liveStreams = [
  {
    id: "1",
    title: "Live Painting Session",
    artist: "Elena Rodriguez",
    artistImage: "/female-portrait-artist-painting-studio.jpg",
    thumbnail: "/live-painting-session.jpg",
    viewers: 342,
    isLive: true,
  },
  {
    id: "2",
    title: "Piano Improvisation",
    artist: "Johan Berg",
    artistImage: "/male-musician-piano-concert-hall.jpg",
    thumbnail: "/live-piano-session.jpg",
    viewers: 189,
    isLive: true,
  },
]

const upcomingPremieres = [
  {
    id: "1",
    title: "Documentary Premiere: The Art of Silence",
    artist: "Marcus Chen",
    artistImage: "/male-filmmaker-with-camera-cinematography.jpg",
    thumbnail: "/premiere-documentary.jpg",
    date: "Feb 25, 2026",
    time: "8:00 PM EST",
    interested: 1250,
  },
  {
    id: "2",
    title: "Dance Performance: Rhythms of Life",
    artist: "Aisha Patel",
    artistImage: "/female-dancer-classical-indian-dance.jpg",
    thumbnail: "/premiere-dance.jpg",
    date: "Mar 1, 2026",
    time: "7:00 PM IST",
    interested: 890,
  },
]

export default function LivePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-balance">Live</h1>
              <p className="text-muted-foreground">Watch live streams and premieres from artists</p>
            </div>
            <Button className="gradient-primary text-primary-foreground">
              <Radio className="h-4 w-4 mr-2" />
              Go Live
            </Button>
          </div>

          {/* Live Now */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <h2 className="font-serif text-xl font-semibold text-foreground">Live Now</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveStreams.map((stream) => (
                <Link key={stream.id} href={`/live/${stream.id}`}>
                  <article className="group relative bg-card rounded-xl overflow-hidden border border-border">
                    <div className="relative aspect-video">
                      <Image
                        src={stream.thumbnail || "/placeholder.svg"}
                        alt={stream.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-card/90 flex items-center justify-center">
                          <Play className="h-6 w-6 text-foreground fill-current" />
                        </div>
                      </div>
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white border-none">
                        <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                        LIVE
                      </Badge>
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-foreground/80 text-card px-2 py-1 rounded text-sm">
                        <Users className="h-3 w-3" />
                        {stream.viewers}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-2">{stream.title}</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                          <Image
                            src={stream.artistImage || "/placeholder.svg"}
                            alt={stream.artist}
                            width={24}
                            height={24}
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{stream.artist}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>

          {/* Upcoming Premieres */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-xl font-semibold text-foreground">Upcoming Premieres</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {upcomingPremieres.map((premiere) => (
                <article
                  key={premiere.id}
                  className="flex flex-col sm:flex-row gap-4 bg-card rounded-xl overflow-hidden border border-border p-4"
                >
                  <div className="relative w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={premiere.thumbnail || "/placeholder.svg"}
                      alt={premiere.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-2 left-2 gradient-primary text-primary-foreground">Premiere</Badge>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{premiere.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <Image
                          src={premiere.artistImage || "/placeholder.svg"}
                          alt={premiere.artist}
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{premiere.artist}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      <p>
                        {premiere.date} • {premiere.time}
                      </p>
                      <p>{premiere.interested.toLocaleString()} interested</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Set Reminder
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
