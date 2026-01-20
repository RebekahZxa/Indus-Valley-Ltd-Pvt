import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ArtistDashboardContent } from "@/components/artist-dashboard/artist-dashboard-content"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Artist Dashboard - Indus Valley Digital",
  description: "Manage your artist profile, content, and earnings",
}

export default function ArtistDashboardPage() {
  // TODO: Fetch artist stats and role, pass as props
  return <ArtistDashboardContent role="artist" />;
}
