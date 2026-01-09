"use client"

import { useState } from "react"
import { Clock, Users, Star, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const artForms = ["All", "Painting", "Music", "Dance", "Film", "Crafts", "Photography"]
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"]

export function WorkshopsFilters() {
  const [selectedArtForm, setSelectedArtForm] = useState("All")

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap gap-2">
        {artForms.map((form) => (
          <Button
            key={form}
            variant={selectedArtForm === form ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedArtForm(form)}
            className={cn(selectedArtForm === form && "gradient-primary text-primary-foreground", "bg-transparent")}
          >
            {form}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <Button variant="outline" className="bg-transparent">
          <Clock className="h-4 w-4 mr-2" />
          Any Duration
        </Button>
        <Button variant="outline" className="bg-transparent">
          <Users className="h-4 w-4 mr-2" />
          All Levels
        </Button>
        <Button variant="outline" className="bg-transparent">
          <Star className="h-4 w-4 mr-2" />
          4+ Rating
        </Button>
        <Button variant="outline" className="bg-transparent">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>
    </div>
  )
}
