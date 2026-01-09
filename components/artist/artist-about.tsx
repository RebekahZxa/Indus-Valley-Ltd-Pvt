interface ArtistAboutProps {
  bio: string
}

export function ArtistAbout({ bio }: ArtistAboutProps) {
  return (
    <section className="bg-card rounded-xl p-6 border border-border">
      <h2 className="font-serif text-xl font-semibold mb-4 text-foreground">About</h2>
      <p className="text-muted-foreground leading-relaxed">{bio}</p>
    </section>
  )
}
