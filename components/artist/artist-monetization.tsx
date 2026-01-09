import { Gift, MessageSquare, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ArtistMonetization() {
  return (
    <section className="bg-card rounded-xl p-6 border border-border">
      <h2 className="font-serif text-lg font-semibold mb-4 text-foreground">Support This Artist</h2>

      <div className="space-y-3">
        <Button className="w-full gradient-primary text-primary-foreground justify-start" size="lg">
          <Gift className="h-5 w-5 mr-3" />
          Commission a Work
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
          <MessageSquare className="h-5 w-5 mr-3" />
          Request Consultation
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
          <Calendar className="h-5 w-5 mr-3" />
          Book Private Session
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">Secure payments powered by Stripe</p>
    </section>
  )
}
