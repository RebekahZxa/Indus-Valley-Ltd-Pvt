import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { UserDashboardContent } from "@/components/dashboard/user-dashboard-content"

export const metadata: Metadata = {
  title: "Dashboard - Artistry",
  description: "Manage your Artistry account",
}

export default function UserDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn />
      <div className="flex-1 flex">
        <DashboardSidebar userType="user" />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <UserDashboardContent />
        </main>
      </div>
    </div>
  )
}
