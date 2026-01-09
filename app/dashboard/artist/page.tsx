import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ArtistDashboardContent } from "@/components/dashboard/artist-dashboard-content"

export const metadata: Metadata = {
  title: "Artist Dashboard - Artistry",
  description: "Manage your artist profile, content, and earnings",
}

export default function ArtistDashboardPage() {
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
