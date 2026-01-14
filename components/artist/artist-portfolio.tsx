"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Play, Volume2, ImageIcon, Film, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type MediaType = "all" | "images" | "videos" | "audio"

const portfolioItems = [
  { id: "1", type: "image", src: "/portfolio-abstract-painting.jpg", title: "Abstract Dreams" },
  { id: "2", type: "video", src: "/portfolio-video-thumbnail.jpg", title: "Creation Process" },
  { id: "3", type: "image", src: "/portfolio-nature-art.jpg", title: "Nature's Whisper" },
  { id: "4", type: "audio", src: "/portfolio-audio-cover.jpg", title: "Ambient Sounds" },
  { id: "5", type: "image", src: "/portfolio-portrait-art.jpg", title: "Soul Portrait" },
  { id: "6", type: "image", src: "/portfolio-landscape-art.jpg", title: "Distant Horizons" },
]

export function ArtistPortfolio() {
  const [filter, setFilter] = useState<MediaType>("all")

  const filters: { value: MediaType; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
    { value: "all", label: "All", icon: ImageIcon },
    { value: "images", label: "Images", icon: ImageIcon },
    { value: "videos", label: "Videos", icon: Film },
    { value: "audio", label: "Audio", icon: Music },
  ]

  const filteredItems = filter === "all" ? portfolioItems : portfolioItems.filter((item) => item.type + "s" === filter)

  return (
    <section className="bg-card rounded-xl p-6 border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="font-serif text-xl font-semibold text-foreground">Portfolio</h2>
        <div className="flex gap-2">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(f.value)}
              className={cn(filter === f.value && "gradient-primary text-primary-foreground")}
            >
              <f.icon className="h-4 w-4 mr-1" />
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer">
            <Image src={item.src || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center">
              {item.type === "video" && (
                <div className="w-12 h-12 rounded-full bg-card/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-5 w-5 text-foreground fill-current" />
                </div>
              )}
              {item.type === "audio" && (
                <div className="w-12 h-12 rounded-full bg-card/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Volume2 className="h-5 w-5 text-foreground" />
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-card text-sm font-medium truncate">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
