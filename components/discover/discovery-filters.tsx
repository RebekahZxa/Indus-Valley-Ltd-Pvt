"use client"

import { useState } from "react"
import {
  Music,
  Film,
  Sparkles,
  Palette,
  Box,
  Scissors,
  Camera,
  Drama,
  PenTool,
  Shirt,
  MapPin,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

const artForms = [
  { id: "music", label: "Music", icon: Music },
  { id: "film", label: "Film & Video", icon: Film },
  { id: "dance", label: "Dance", icon: Sparkles },
  { id: "painting", label: "Painting", icon: Palette },
  { id: "sculpture", label: "Sculpture", icon: Box },
  { id: "crafts", label: "Crafts", icon: Scissors },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "theater", label: "Theater", icon: Drama },
  { id: "writing", label: "Writing", icon: PenTool },
  { id: "fashion", label: "Fashion", icon: Shirt },
]

const regions = ["North America", "Europe", "Asia", "Africa", "South America", "Oceania"]

interface DiscoveryFiltersProps {
  onApply?: () => void
}

export function DiscoveryFilters({ onApply }: DiscoveryFiltersProps) {
  const [selectedArtForms, setSelectedArtForms] = useState<string[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [hasEvents, setHasEvents] = useState(false)
  const [hasWorkshops, setHasWorkshops] = useState(false)

  const toggleArtForm = (id: string) => {
    setSelectedArtForms((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) => (prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]))
  }

  const clearFilters = () => {
    setSelectedArtForms([])
    setSelectedRegions([])
    setHasEvents(false)
    setHasWorkshops(false)
  }

  const activeFiltersCount =
    selectedArtForms.length + selectedRegions.length + (hasEvents ? 1 : 0) + (hasWorkshops ? 1 : 0)

  return (
    <div className="space-y-6">
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""} active
          </span>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}

      <Accordion type="multiple" defaultValue={["art-forms", "regions"]} className="space-y-4">
        <AccordionItem value="art-forms" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="font-medium">Art Forms</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {artForms.map((form) => (
                <div key={form.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`art-${form.id}`}
                    checked={selectedArtForms.includes(form.id)}
                    onCheckedChange={() => toggleArtForm(form.id)}
                  />
                  <Label
                    htmlFor={`art-${form.id}`}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer text-sm font-normal",
                      selectedArtForms.includes(form.id) ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <form.icon className="h-4 w-4" />
                    {form.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="regions" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Regions
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {regions.map((region) => (
                <div key={region} className="flex items-center space-x-3">
                  <Checkbox
                    id={`region-${region}`}
                    checked={selectedRegions.includes(region)}
                    onCheckedChange={() => toggleRegion(region)}
                  />
                  <Label
                    htmlFor={`region-${region}`}
                    className={cn(
                      "cursor-pointer text-sm font-normal",
                      selectedRegions.includes(region) ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {region}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Availability
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="has-events"
                  checked={hasEvents}
                  onCheckedChange={(checked) => setHasEvents(checked as boolean)}
                />
                <Label
                  htmlFor="has-events"
                  className={cn(
                    "cursor-pointer text-sm font-normal",
                    hasEvents ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  Has upcoming events
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="has-workshops"
                  checked={hasWorkshops}
                  onCheckedChange={(checked) => setHasWorkshops(checked as boolean)}
                />
                <Label
                  htmlFor="has-workshops"
                  className={cn(
                    "cursor-pointer text-sm font-normal",
                    hasWorkshops ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  Offers workshops
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {onApply && (
        <Button onClick={onApply} className="w-full gradient-primary text-primary-foreground">
          Apply Filters
        </Button>
      )}
    </div>
  )
}
