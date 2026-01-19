"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/**
 * UI labels → DB canonical values
 * DB ONLY accepts lowercase canonical values
 */
const ARTIST_CATEGORIES = [
  { label: "Musician / Singer", value: "music" },
  { label: "Filmmaker", value: "film" },
  { label: "Dancer", value: "dance" },
  { label: "Painter", value: "painting" },
  { label: "Sculptor", value: "sculpture" },
  { label: "Craftsman / Artisan", value: "crafts" },
  { label: "Photographer", value: "photography" },
  { label: "Actor / Theater Artist", value: "theater" },
  { label: "Writer / Poet", value: "writing" },
  { label: "Fashion Designer", value: "fashion" },
  { label: "Other", value: "other" }, // frontend-only
]

export function ArtistOnboardingForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    category: "",
    otherCategory: "",
    country: "",
    state: "",
    city: "",
  })

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("You must be logged in to continue")
      }

      const isOther = form.category === "other"

      if (isOther && !form.otherCategory.trim()) {
        throw new Error("Please specify your art type")
      }

      const payload = {
        profile_id: user.id, // REQUIRED (FK + RLS)
        category: isOther ? null : form.category, // MUST be null for "other"
        bio: isOther
          ? `Unverified art type submitted: ${form.otherCategory}`
          : null,
        country: form.country,
        state: form.state,
        city: form.city || null,
        onboarding_completed: true,
      }

      console.log("UPSERT PAYLOAD:", payload)

      const { error } = await supabase
        .from("artists")
        .upsert(payload, {
          onConflict: "profile_id", // 🔑 CRITICAL FIX
        })

      if (error) throw error

      window.location.assign("/dashboard")
    } catch (err: any) {
      setError(err?.message ?? "Failed to save artist profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ERROR */}
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* CATEGORY */}
      <div className="space-y-2">
        <Label>What kind of artist are you?</Label>
        <select
          required
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2"
        >
          <option value="">Select your category</option>
          {ARTIST_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* OTHER CATEGORY */}
      {form.category === "other" && (
        <div className="space-y-2">
          <Label>Please specify your art type</Label>
          <Input
            placeholder="e.g. Calligraphy, Tattoo Artist, Digital Sculptor"
            value={form.otherCategory}
            onChange={(e) => update("otherCategory", e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Our team will review and verify your art category shortly.
          </p>
        </div>
      )}

      {/* LOCATION */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Country</Label>
          <Input
            required
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>State</Label>
          <Input
            required
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>City (optional)</Label>
        <Input
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
        />
      </div>

      {/* SUBMIT */}
      <Button
        type="submit"
        className="w-full gradient-primary text-primary-foreground"
        disabled={loading}
      >
        {loading ? "Saving..." : "Complete profile"}
      </Button>
    </form>
  )
}
