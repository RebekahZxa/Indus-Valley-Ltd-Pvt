"use client"

import { ProfileCard } from "@/components/dashboard/ProfileCard"
import { PostGrid } from "@/components/posts/PostGrid"

export function DashboardWithPosts({ profile, stats }: any) {
  return (
    <div className="space-y-8">
      {/* Profile Card with Plus Button */}
      <ProfileCard profile={profile} />

      {/* Posts Grid */}
      <PostGrid userId={profile.id} />
    </div>
  )
}
