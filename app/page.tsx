import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturedArtistsSection } from "@/components/landing/featured-artists-section"
import { CategoriesSection } from "@/components/landing/categories-section"
import { UpcomingEventsSection } from "@/components/landing/upcoming-events-section"
import { ValuePropositionSection } from "@/components/landing/value-proposition-section"
import { CTASection } from "@/components/landing/cta-section"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ValuePropositionSection />
        <FeaturedArtistsSection />
        <CategoriesSection />
        <UpcomingEventsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
