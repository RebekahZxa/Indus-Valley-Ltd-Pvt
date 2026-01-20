"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function ProfileCard({ profile }: { profile: any }) {
  const router = useRouter()
  return (
    <div className="flex items-center gap-6 rounded-xl border bg-card p-6">
      <Image
        key={profile.avatar_url}
        src={`${profile.avatar_url || "/avatar-placeholder.png"}?t=${Date.now()}`}
        alt="Avatar"
        width={80}
        height={80}
        className="rounded-full border object-cover"
      />

      <div className="flex-1">
        <h2 className="text-lg font-semibold">
          {profile.full_name || "Unnamed"}
        </h2>
        <p className="text-sm text-muted-foreground">
          @{profile.username || "no-username"}
        </p>
        {profile.bio && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {profile.bio}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Link href="/dashboard/profile">
          <Button>Edit profile</Button>
        </Link>
      </div>
    </div>
  )
}
