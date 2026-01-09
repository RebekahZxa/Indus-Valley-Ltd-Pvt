"use client"

import { useState } from "react"
import { Calendar, MapPin, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const eventTypes = ["All", "Events", "Premieres", "Exhibitions"]
const regions = ["All Regions", "North America", "Europe", "Asia", "Online"]

export function EventsFilters() {
  const [selectedType, setSelectedType] = useState("All")
  const [selectedRegion, setSelectedRegion] = useState("All Regions")

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap gap-2">
        {eventTypes.map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type)}
            className={cn(selectedType === type && "gradient-primary text-primary-foreground", "bg-transparent")}
          >
            {type}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <Button variant="outline" className="bg-transparent">
          <Calendar className="h-4 w-4 mr-2" />
          Any Date
        </Button>
        <Button variant="outline" className="bg-transparent">
          <MapPin className="h-4 w-4 mr-2" />
          {selectedRegion}
        </Button>
        <Button variant="outline" className="bg-transparent">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>
    </div>
  )
}
