import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Radio, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LiveNow } from "@/components/live/live-now"
import { UpcomingPremieres } from "@/components/live/upcoming-premieres"

export const metadata: Metadata = {
  title: "Live - Indus Valley Digital",
  description: "Watch live streams and premieres from artists",
}

export default function LivePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showSearch />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                Live
              </h1>
              <p className="text-muted-foreground">
                Watch live streams and premieres from artists
              </p>
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
              <h2 className="font-serif text-xl font-semibold">
                Live Now
              </h2>
            </div>
            <LiveNow />
          </section>

          {/* Upcoming Premieres */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-xl font-semibold">
                Upcoming Premieres
              </h2>
            </div>
            <UpcomingPremieres />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
