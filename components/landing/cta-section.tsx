import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 md:p-16 text-center">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 text-balance">
              Ready to Share Your Art with the World?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
              Join thousands of professional artists who trust Indus Valley Pvt Ltd to showcase their work, connect with audiences,
              and build their careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup?role=artist">
                <Button size="lg" className="bg-card text-foreground hover:bg-card/90 w-full sm:w-auto group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto bg-transparent"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  )
}
