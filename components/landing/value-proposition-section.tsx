import { Shield, Globe, Banknote, Users } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Safe & Verified",
    description: "All artists are verified. A trustworthy space for art lovers and collectors.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connect with audiences and collaborators worldwide. Your art, no borders.",
  },
  {
    icon: Banknote,
    title: "Monetize Your Art",
    description: "Sell tickets, host workshops, offer commissions. Multiple revenue streams.",
  },
  {
    icon: Users,
    title: "Professional Network",
    description: "Build meaningful connections with fellow artists and industry professionals.",
  },
]

export function ValuePropositionSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">Built for Artists, By Artists</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A professional platform designed to help you focus on what matters most — your art.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-card border border-border hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
