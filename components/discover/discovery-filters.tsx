"use client"

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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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

const regions = [
  "India",
  "North America",
  "Europe",
  "Asia",
  "Africa",
  "South America",
  "Oceania",
]

type DiscoveryFiltersProps = {
  categories: string[]
  regions: string[]
  onChangeCategories: (values: string[]) => void
  onChangeRegions: (values: string[]) => void
  onClear: () => void
  onApply?: () => void
}

export function DiscoveryFilters({
  categories,
  regions: selectedRegions,
  onChangeCategories,
  onChangeRegions,
  onClear,
  onApply,
}: DiscoveryFiltersProps) {
  const toggleCategory = (id: string) => {
    onChangeCategories(
      categories.includes(id)
        ? categories.filter((c) => c !== id)
        : [...categories, id],
    )
  }

  const toggleRegion = (region: string) => {
    onChangeRegions(
      selectedRegions.includes(region)
        ? selectedRegions.filter((r) => r !== region)
        : [...selectedRegions, region],
    )
  }

  const activeFiltersCount = categories.length + selectedRegions.length

  return (
    <div className="space-y-6">
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""} active
          </span>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear all
          </Button>
        </div>
      )}

      <Accordion type="multiple" defaultValue={["art-forms", "regions"]}>
        {/* Art Forms */}
        <AccordionItem value="art-forms" className="border rounded-lg px-4">
          <AccordionTrigger>
            <span className="font-medium">Art Forms</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {artForms.map((form) => (
                <div key={form.id} className="flex items-center space-x-3">
                  <Checkbox
                    checked={categories.includes(form.id)}
                    onCheckedChange={() => toggleCategory(form.id)}
                  />
                  <Label
                    className={cn(
                      "flex items-center gap-2 text-sm cursor-pointer",
                      categories.includes(form.id)
                        ? "text-foreground"
                        : "text-muted-foreground",
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

        {/* Regions */}
        <AccordionItem value="regions" className="border rounded-lg px-4">
          <AccordionTrigger>
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
                    checked={selectedRegions.includes(region)}
                    onCheckedChange={() => toggleRegion(region)}
                  />
                  <Label
                    className={cn(
                      "text-sm cursor-pointer",
                      selectedRegions.includes(region)
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {region}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {onApply && (
        <Button
          onClick={onApply}
          className="w-full gradient-primary text-primary-foreground"
        >
          Apply Filters
        </Button>
      )}
    </div>
  )
}
