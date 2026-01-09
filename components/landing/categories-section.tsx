import Link from "next/link"
import { Music, Film, Sparkles, Palette, Box, Scissors, Camera, Drama, PenTool, Shirt } from "lucide-react"

const categories = [
  { id: "music", label: "Music", icon: Music, count: 450 },
  { id: "film", label: "Film & Video", icon: Film, count: 280 },
  { id: "dance", label: "Dance", icon: Sparkles, count: 320 },
  { id: "painting", label: "Painting", icon: Palette, count: 520 },
  { id: "sculpture", label: "Sculpture", icon: Box, count: 180 },
  { id: "crafts", label: "Crafts", icon: Scissors, count: 390 },
  { id: "photography", label: "Photography", icon: Camera, count: 410 },
  { id: "theater", label: "Theater", icon: Drama, count: 150 },
  { id: "writing", label: "Writing", icon: PenTool, count: 220 },
  { id: "fashion", label: "Fashion", icon: Shirt, count: 290 },
]

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-balance">Explore by Art Form</h2>
          <p className="text-muted-foreground">Find artists across diverse creative disciplines</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/discover?category=${category.id}`}
              className="group flex items-center gap-2 px-4 py-3 rounded-full bg-card border border-border hover:border-primary/50 hover:shadow-sm transition-all duration-300"
            >
              <category.icon className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">{category.label}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{category.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
