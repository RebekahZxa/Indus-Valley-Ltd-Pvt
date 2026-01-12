"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import UserDashboardContent from "@/components/dashboard/user-dashboard-content"
import { useAuth } from "@/AuthContext/AuthContext"
import { supabase } from "@/lib/supabase/client"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    following: 0,
    followers: 0,
    notifications: 0,
  })
  const [pageLoading, setPageLoading] = useState(true)

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [loading, user, router])

  // 📊 Load dashboard data
  useEffect(() => {
    if (!user) return

    async function loadDashboard() {
      const [
        profileRes,
        followingRes,
        followersRes,
        notificationsRes,
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, username, bio, avatar_url, role")
          .eq("id", user.id)
          .single(),

        supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", user.id),

        supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("following_id", user.id),

        supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("read", false),
      ])

      setProfile(profileRes.data)

      setStats({
        following: followingRes.count ?? 0,
        followers: followersRes.count ?? 0,
        notifications: notificationsRes.count ?? 0,
      })

      setPageLoading(false)
    }

    loadDashboard()
  }, [user])

  if (loading || pageLoading) {
    return <div className="p-8">Loading dashboard…</div>
  }

  if (!profile) {
    return <div className="p-8">Profile not found</div>
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn />

      <div className="flex flex-1">
        <DashboardSidebar userType={profile.role ?? "user"} />

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <UserDashboardContent profile={profile} stats={stats} />
        </main>
      </div>
    </div>
  )
}
