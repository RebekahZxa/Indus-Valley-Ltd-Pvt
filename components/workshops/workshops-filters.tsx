"use client"

import { Button } from "@/components/ui/button"

const CATEGORIES = [
  { label: "All", value: null },
  { label: "Painting", value: "painting" },
  { label: "Music", value: "music" },
  { label: "Dance", value: "dance" },
  { label: "Film", value: "film" },
  { label: "Crafts", value: "crafts" },
  { label: "Photography", value: "photography" },
]

export function WorkshopsFilters({
  category,
  onChangeCategory,
  onClear,
}: any) {
  return (
    
    <div className="flex flex-wrap gap-3 mb-6">
      {CATEGORIES.map((c) => (
        <Button
          key={c.label}
          variant={category === c.value ? "default" : "outline"}
          onClick={() => onChangeCategory(c.value)}
        >
          {c.label}
        </Button>
      ))}

      <Button variant="ghost" size="sm" onClick={onClear}>
        Clear all
      </Button>
    </div>
  )
}
