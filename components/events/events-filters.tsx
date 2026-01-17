"use client"

import { Button } from "@/components/ui/button"

type EventsFiltersProps = {
  type: string | null
  region: string | null
  onChangeType: (v: string | null) => void
  onChangeRegion: (v: string | null) => void
  onClear: () => void
}

const TYPES = [
  { label: "All", value: null },
  { label: "Events", value: "concert" },
  { label: "Workshops", value: "workshop" },
  { label: "Exhibitions", value: "exhibition" },
  { label: "Live", value: "live" },
]

export default function EventsFilters({
  type,
  region,
  onChangeType,
  onChangeRegion,
  onClear,
}: EventsFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <Button
            key={t.label}
            variant={type === t.value ? "default" : "outline"}
            onClick={() => onChangeType(t.value)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <Button variant="ghost" size="sm" onClick={onClear}>
        Clear all
      </Button>
    </div>
  )
}
