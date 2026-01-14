"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/AuthContext/AuthContext"

import { Header } from "@/components/layout/header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import UserDashboardContent from "@/components/dashboard/user-dashboard-content"
import { ProfileCard } from "@/components/dashboard/ProfileCard"

type Profile = {
  id: string
  full_name: string | null
  username: string | null
  bio: string | null
  avatar_url: string | null
  role: string
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState({
    following: 0,
    followers: 0,
    notifications: 0,
  })
  const [pageLoading, setPageLoading] = useState(true)

  // 🔐 Redirect if unauthenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [loading, user, router])

  // 🔄 ALWAYS refetch dashboard data on mount
  useEffect(() => {
    if (!user) return

    async function loadDashboard() {
      setPageLoading(true)

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

      setProfile(profileRes.data ?? null)
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
        <DashboardSidebar userType={profile.role} />

        <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-auto">
          {/* 👤 Profile summary */}
          {/* <ProfileCard profile={profile} /> */}

          {/* 📊 Main dashboard */}
          <UserDashboardContent profile={profile} stats={stats} />
        </main>
      </div>
    </div>
  )
}
