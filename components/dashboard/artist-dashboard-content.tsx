import Link from "next/link"
import {
  ArrowRight,
  Users,
  ImageIcon,
  Calendar,
  Banknote,
  TrendingUp,
  Video,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function ArtistDashboardContent() {
  const profileCompletion = 75
  const stats = {
    followers: 12500,
    followersChange: "+12%",
    views: 45200,
    viewsChange: "+8%",
    earnings: "$2,450",
    earningsChange: "+23%",
    events: 5,
  }

  const notifications = [
    {
      id: "1",
      type: "success",
      message: "Your workshop 'Color Theory' has been approved",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "alert",
      message: "Complete your profile to unlock monetization features",
      time: "1 day ago",
    },
    {
      id: "3",
      type: "info",
      message: "New follower: Sarah Johnson",
      time: "2 days ago",
    },
  ]

  const quickActions = [
    { label: "Upload Work", icon: ImageIcon, href: "/dashboard/artist/content" },
    { label: "Create Event", icon: Calendar, href: "/dashboard/artist/events" },
    { label: "Go Live", icon: Video, href: "/dashboard/artist/live" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Artist Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your profile, content, and earnings</p>
      </div>

      {/* Profile Completion */}
      <section className="bg-card rounded-xl p-6 border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-semibold text-foreground">Profile Completion</h2>
            <p className="text-sm text-muted-foreground">Complete your profile to attract more followers</p>
          </div>
          <Badge variant={profileCompletion === 100 ? "default" : "secondary"}>{profileCompletion}% Complete</Badge>
        </div>
        <Progress value={profileCompletion} className="h-2" />
        {profileCompletion < 100 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-transparent">
              Add bio
            </Badge>
            <Badge variant="outline" className="bg-transparent">
              Upload portfolio
            </Badge>
            <Badge variant="outline" className="bg-transparent">
              Connect social accounts
            </Badge>
          </div>
        )}
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stats.followersChange}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.followers.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Followers</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between mb-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stats.viewsChange}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.views.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Profile Views</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between mb-2">
            <Banknote className="h-5 w-5 text-primary" />
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stats.earningsChange}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.earnings}</p>
          <p className="text-sm text-muted-foreground">This Month</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <Calendar className="h-5 w-5 text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{stats.events}</p>
          <p className="text-sm text-muted-foreground">Upcoming Events</p>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="bg-card rounded-xl p-6 border border-border">
        <h2 className="font-serif text-lg font-semibold mb-4 text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2 bg-transparent">
                <action.icon className="h-6 w-6 text-primary" />
                <span>{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </section>

      {/* Content Management */}
      <section className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold text-foreground">Content Management</h2>
          <Link href="/dashboard/artist/content">
            <Button variant="ghost" size="sm">
              Manage <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-3xl font-bold text-foreground">24</p>
            <p className="text-sm text-muted-foreground">Portfolio Items</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-3xl font-bold text-foreground">3</p>
            <p className="text-sm text-muted-foreground">Exhibitions</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-3xl font-bold text-foreground">8</p>
            <p className="text-sm text-muted-foreground">Workshops</p>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold text-foreground">Recent Activity</h2>
          <Link href="/dashboard/artist/notifications">
            <Button variant="ghost" size="sm">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              {notification.type === "success" && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />}
              {notification.type === "alert" && <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />}
              {notification.type === "info" && <Users className="h-5 w-5 text-primary flex-shrink-0" />}
              <div className="flex-1">
                <p className="text-sm text-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Earnings Summary */}
      <section className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold text-foreground">Earnings Summary</h2>
          <Link href="/dashboard/artist/earnings">
            <Button variant="ghost" size="sm">
              View details <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Ticket Sales</p>
            <p className="text-xl font-bold text-foreground">$1,250</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Workshops</p>
            <p className="text-xl font-bold text-foreground">$850</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Commissions</p>
            <p className="text-xl font-bold text-foreground">$350</p>
          </div>
        </div>
      </section>
    </div>
  )
}
