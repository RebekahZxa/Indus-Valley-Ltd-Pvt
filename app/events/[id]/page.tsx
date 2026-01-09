import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Calendar, MapPin, Users, Clock, Share2, Heart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockEvents, mockArtists } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Event Details - Artistry",
  description: "View event details and get tickets",
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = mockEvents.find((e) => e.id === id) || mockEvents[0]
  const artist = mockArtists[0]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn />
      <main className="flex-1">
        {/* Hero */}
        <div className="relative h-64 md:h-96">
          <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
          <div className="absolute top-4 left-4">
            <Link href="/events">
              <Button variant="secondary" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Button>
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl p-6 border border-border">
                <Badge className="mb-4 gradient-primary text-primary-foreground">
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </Badge>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">{event.title}</h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={artist.image || "/placeholder.svg"}
                      alt={event.artist}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{event.artist}</p>
                    <p className="text-sm text-muted-foreground">{artist.artForms.join(", ")}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="h-5 w-5" />
                    <div>
                      <p className="font-medium text-foreground">{event.date}</p>
                      <p className="text-sm">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <div>
                      <p className="font-medium text-foreground">{event.location}</p>
                      <p className="text-sm">View on map</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Users className="h-5 w-5" />
                    <div>
                      <p className="font-medium text-foreground">{event.attendees} attending</p>
                      <p className="text-sm">Limited spots available</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <div>
                      <p className="font-medium text-foreground">2 hours</p>
                      <p className="text-sm">Duration</p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <h3 className="text-foreground font-semibold">About this event</h3>
                  <p>
                    Join us for an unforgettable evening celebrating the intersection of art and emotion. This exclusive
                    event features live performances, interactive installations, and the opportunity to meet the artist
                    in person.
                  </p>
                  <p>
                    Whether you&apos;re an art enthusiast or new to the scene, this event promises to inspire and
                    captivate. Limited tickets available to ensure an intimate experience for all attendees.
                  </p>
                  <h3 className="text-foreground font-semibold">What to expect</h3>
                  <ul>
                    <li>Live demonstration by the artist</li>
                    <li>Q&A session</li>
                    <li>Networking with fellow art lovers</li>
                    <li>Complimentary refreshments</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-primary">{event.price}</p>
                  <p className="text-sm text-muted-foreground">per ticket</p>
                </div>

                <Button className="w-full gradient-primary text-primary-foreground mb-3" size="lg">
                  Get Tickets
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground mt-4">Secure checkout powered by Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
