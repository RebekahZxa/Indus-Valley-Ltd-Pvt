import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata: Metadata = {
  title: "Admin Panel - Artistry",
  description: "Platform administration and moderation",
}

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn />
      <div className="flex-1 flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <AdminDashboard />
        </main>
      </div>
    </div>
  )
}
