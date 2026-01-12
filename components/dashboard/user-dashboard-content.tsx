"use client"

import Image from "next/image"
import Link from "next/link"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UserDashboardContent({
  profile,
  stats,
}: {
  profile: {
    full_name?: string | null
    username?: string | null
    bio?: string | null
    avatar_url?: string | null
  }
  stats: {
    following: number
    followers: number
    notifications: number
  }
}) {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Image
            src={profile.avatar_url || "/avatar-placeholder.png"}
            alt="Avatar"
            width={72}
            height={72}
            className="rounded-full border object-cover"
          />

          <div>
            <h1 className="text-2xl font-semibold">
              {profile.full_name || "Your profile"}
            </h1>
            <p className="text-muted-foreground">
              @{profile.username || "username"}
            </p>
          </div>
        </div>

        {/* ✏️ EDIT PROFILE */}
        <Link href="/dashboard/profile">
          <Button variant="outline" size="sm" className="gap-2">
            <Pencil size={14} />
            Edit profile
          </Button>
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Following" value={stats.following} />
        <Stat label="Followers" value={stats.followers} />
        <Stat label="Unread notifications" value={stats.notifications} />
      </div>

      {/* BIO */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="font-medium mb-2">About</h2>
        <p className="text-muted-foreground leading-relaxed">
          {profile.bio || "You haven’t added a bio yet."}
        </p>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  )
}
