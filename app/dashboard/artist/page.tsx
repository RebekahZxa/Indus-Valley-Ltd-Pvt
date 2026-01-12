import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ArtistDashboardContent } from "@/components/dashboard/artist-dashboard-content"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Artist Dashboard - Indus Valley Pvt Ltd",
  description: "Manage your artist profile, content, and earnings",
}

export default async function ArtistDashboardPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 🔐 Auth guard
  if (!user) {
    redirect("/login")
  }

  // 🔐 Role guard
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "artist") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn />
      <div className="flex-1 flex">
        <DashboardSidebar userType="artist" />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <ArtistDashboardContent />
        </main>
      </div>
    </div>
  )
}
