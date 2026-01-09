import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, Ticket, Bell, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockArtists, mockEvents } from "@/lib/mock-data"

export function UserDashboardContent() {
  const followedArtists = mockArtists.slice(0, 4)
  const myTickets = mockEvents.slice(0, 2)
  const notifications = [
    {
      id: "1",
      type: "event",
      message: "Elena Rodriguez is going live in 1 hour",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "2",
      type: "workshop",
      message: "Your workshop 'Abstract Art Fundamentals' starts tomorrow",
      time: "3 hours ago",
      read: false,
    },
    {
      id: "3",
      type: "follow",
      message: "Marcus Chen posted new content",
      time: "1 day ago",
      read: true,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with the artists you follow</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <Users className="h-5 w-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{followedArtists.length}</p>
          <p className="text-sm text-muted-foreground">Following</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <Ticket className="h-5 w-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{myTickets.length}</p>
          <p className="text-sm text-muted-foreground">Tickets</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <Calendar className="h-5 w-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">3</p>
          <p className="text-sm text-muted-foreground">Workshops</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <Bell className="h-5 w-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{notifications.filter((n) => !n.read).length}</p>
          <p className="text-sm text-muted-foreground">Unread</p>
        </div>
      </div>

      {/* Following */}
      <section className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold text-foreground">Artists You Follow</h2>
          <Link href="/dashboard/following">
            <Button variant="ghost" size="sm">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {followedArtists.map((artist) => (
            <Link key={artist.id} href={`/artist/${artist.id}`} className="group">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mx-auto mb-2 ring-2 ring-transparent group-hover:ring-primary transition-all">
                  <Image
                    src={artist.image || "/placeholder.svg"}
                    alt={artist.name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="text-sm font-medium text-foreground truncate">{artist.name}</p>
                <p className="text-xs text-muted-foreground">{artist.artForms[0]}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold text-foreground">My Tickets</h2>
          <Link href="/dashboard/tickets">
            <Button variant="ghost" size="sm">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {myTickets.map((event) => (
            <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{event.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {event.date} • {event.time}
                </p>
              </div>
              <Badge variant="outline">{event.type}</Badge>
            </div>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold text-foreground">Recent Notifications</h2>
          <Link href="/dashboard/notifications">
            <Button variant="ghost" size="sm">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${notification.read ? "bg-transparent" : "bg-primary/5"}`}
            >
              <div
                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.read ? "bg-muted" : "bg-primary"}`}
              />
              <div className="flex-1">
                <p className={`text-sm ${notification.read ? "text-muted-foreground" : "text-foreground"}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
