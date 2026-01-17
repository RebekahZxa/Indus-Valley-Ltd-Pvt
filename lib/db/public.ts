import { supabase } from "@/lib/supabase/client"

/* ================= ARTISTS ================= */

type FetchArtistsParams = {
  search?: string
  categories?: string[]
  region?: string
}

export async function fetchArtists(params?: FetchArtistsParams) {
  let query = supabase
    .from("artists")
    .select(`
      id,
      category,
      location,
      verified,
      profiles:profile_id (
        id,
        full_name,
        username,
        avatar_url
      )
    `)

  // 🔍 Search: name OR category
  if (params?.search) {
    query = query.or(
      `profiles.full_name.ilike.%${params.search}%,category.ilike.%${params.search}%`
    )
  }

  // 🎨 Categories (multi-select)
  if (params?.categories && params.categories.length > 0) {
    query = query.in("category", params.categories)
  }

  // 📍 Region (partial match)
  if (params?.region) {
    query = query.ilike("location", `%${params.region}%`)
  }

  return query
}

/* ================= EVENTS ================= */

export async function fetchEvents(type?: string) {
  let query = supabase
    .from("events")
    .select(`
      id,
      title,
      description,
      event_type,
      event_date,
      location,
      category,
      level,
      duration_type,
      rating,
      created_by,
      profiles:created_by (
        full_name
      )
    `)
    .order("event_date", { ascending: true })

  if (type) {
    query = query.eq("event_type", type)
  }

  return query
}


/* ================= COUNTS ================= */

export async function fetchEventCount() {
  return supabase
    .from("events")
    .select("*", { count: "exact", head: true })
}
