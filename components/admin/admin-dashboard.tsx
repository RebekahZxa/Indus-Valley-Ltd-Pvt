import { Users, ImageIcon, Calendar, Banknote, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const pendingVerifications = [
  { id: "1", name: "Sarah Johnson", type: "Painter", submitted: "2 days ago", status: "pending" },
  { id: "2", name: "Mike Williams", type: "Musician", submitted: "3 days ago", status: "pending" },
  { id: "3", name: "Lisa Chen", type: "Photographer", submitted: "5 days ago", status: "review" },
]

const contentReports = [
  { id: "1", content: "Portfolio image", reason: "Copyright claim", reporter: "Anonymous", date: "1 hour ago" },
  { id: "2", content: "Event description", reason: "Inappropriate content", reporter: "User123", date: "3 hours ago" },
]

export function AdminDashboard() {
  const stats = {
    totalUsers: 52450,
    usersChange: "+8%",
    totalArtists: 2580,
    artistsChange: "+12%",
    totalEvents: 156,
    eventsChange: "+5%",
    revenue: "$45,200",
    revenueChange: "+23%",
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stats.usersChange}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Users</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between mb-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stats.artistsChange}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalArtists.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Verified Artists</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stats.eventsChange}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalEvents}</p>
          <p className="text-sm text-muted-foreground">Active Events</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between mb-2">
            <Banknote className="h-5 w-5 text-primary" />
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stats.revenueChange}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.revenue}</p>
          <p className="text-sm text-muted-foreground">Monthly Revenue</p>
        </div>
      </div>

      {/* Verification Queue */}
      <section className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold text-foreground">Artist Verification Queue</h2>
          <Badge variant="secondary">{pendingVerifications.length} pending</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b border-border">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Submitted</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingVerifications.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="py-3 font-medium text-foreground">{item.name}</td>
                  <td className="py-3 text-muted-foreground">{item.type}</td>
                  <td className="py-3 text-muted-foreground">{item.submitted}</td>
                  <td className="py-3">
                    <Badge variant={item.status === "pending" ? "outline" : "secondary"}>
                      {item.status === "pending" ? (
                        <Clock className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="bg-transparent">
                        Review
                      </Button>
                      <Button size="sm" className="gradient-primary text-primary-foreground">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Content Moderation */}
      <section className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold text-foreground">Content Reports</h2>
          <Badge variant="destructive">{contentReports.length} reports</Badge>
        </div>
        <div className="space-y-3">
          {contentReports.map((report) => (
            <div key={report.id} className="flex items-start justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="font-medium text-foreground">{report.content}</span>
                </div>
                <p className="text-sm text-muted-foreground">Reason: {report.reason}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Reported by {report.reporter} • {report.date}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-transparent">
                  Dismiss
                </Button>
                <Button size="sm" variant="destructive">
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics Placeholder */}
      <section className="bg-card rounded-xl p-6 border border-border">
        <h2 className="font-serif text-lg font-semibold text-foreground mb-4">Platform Analytics</h2>
        <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Analytics charts will be displayed here</p>
        </div>
      </section>
    </div>
  )
}
