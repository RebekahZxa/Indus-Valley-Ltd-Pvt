"use client"

import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { DiscoveryFilters } from "./discovery-filters"

type DiscoverySearchProps = {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
}

export function DiscoverySearch({
  value,
  onChange,
  onClear,
}: DiscoverySearchProps) {
  return (
    <div className="mb-6">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            type="search"
            placeholder="Search artists by name, art form, or region..."
            className="pl-10 pr-10"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />

          {value && (
            <button
              onClick={() => {
                onChange("")
                onClear?.()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile Filters */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden bg-transparent"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Filters</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>

            <div className="mt-6 text-sm text-muted-foreground">
              Use filters on larger screens.
            </div>
          </SheetContent>

        </Sheet>
      </div>
    </div>
  )
}
