"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"

type Props = {
  profile: {
    full_name: string | null
    username: string | null
    bio: string | null
    avatar_url: string | null
  }
  stats: {
    followers: number
    following: number
    notifications: number
  }
}

export default function UserDashboardContent({ profile, stats }: Props) {
  const avatarUrl = profile.avatar_url
    ? supabase.storage
        .from("avatars")
        .getPublicUrl(profile.avatar_url).data.publicUrl +
      `?v=${Date.now()}`
    : "/avatar-placeholder.png"

  return (
    <div className="space-y-8">
      {/* Profile header */}
      <div className="flex items-center gap-6 rounded-2xl border bg-card p-6">
        <Image
          src={avatarUrl}
          alt="Avatar"
          width={96}
          height={96}
          unoptimized
          className="rounded-full border"
        />

        <div className="flex-1">
          <h1 className="text-xl font-semibold">
            {profile.full_name || "Unnamed User"}
          </h1>
          <p className="text-sm text-muted-foreground">
            @{profile.username || "username"}
          </p>
          <p className="mt-2 text-sm">{profile.bio}</p>
        </div>

        <Link href="/dashboard/profile">
          <Button>Edit profile</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Followers" value={stats.followers} />
        <StatCard label="Following" value={stats.following} />
        <StatCard label="Unread" value={stats.notifications} />
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
