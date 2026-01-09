import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative gradient-hero overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                For Professional Artists
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Where Art Meets <span className="text-primary">Opportunity</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                The trusted platform for filmmakers, musicians, painters, craftsmen, dancers, and artisans to showcase
                their work, connect with audiences, and grow professionally.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup?role=artist">
                <Button size="lg" className="gradient-primary text-primary-foreground w-full sm:w-auto group">
                  Join as Artist
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/discover">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Explore Artists
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-card bg-muted overflow-hidden">
                    <Image
                      src={`/artist-portrait.png?height=40&width=40&query=artist portrait ${i}`}
                      alt=""
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold text-foreground">2,500+</span>
                <span className="text-muted-foreground"> verified artists</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/hero-artist-collage.jpg"
                alt="Diverse artists creating their masterpieces"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
            </div>

            <div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 bg-card rounded-xl p-4 shadow-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                  <Play className="h-5 w-5 text-primary-foreground fill-current" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Live Now</p>
                  <p className="text-sm text-muted-foreground">12 artists streaming</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-card rounded-xl p-4 shadow-lg border border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">150+</p>
                <p className="text-xs text-muted-foreground">Events this week</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
