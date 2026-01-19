import { ArtistOnboardingForm } from "@/components/artist/ArtistOnboardingForm"

export default function ArtistOnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-serif font-bold mb-2">
          Complete your artist profile
        </h1>

        <p className="text-muted-foreground mb-6">
          This helps people discover you based on your art and location.
        </p>

        <ArtistOnboardingForm />
      </div>
    </div>
  )
}
