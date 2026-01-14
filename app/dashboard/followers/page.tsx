"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/AuthContext/AuthContext"
import Image from "next/image"

export default function FollowersPage() {
  const { user } = useAuth()
  const [followers, setFollowers] = useState<any[]>([])

  useEffect(() => {
    if (!user) return

    supabase
      .from("follows")
      .select(`
        follower:profiles!follows_follower_id_fkey (
          id,
          full_name,
          username,
          avatar_url
        )
      `)
      .eq("following_id", user.id)
      .then(({ data }) => {
        setFollowers(data?.map((f) => f.follower) || [])
      })
  }, [user])

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Followers</h1>

      {followers.map((u) => {
        const avatar =
          u.avatar_url
            ? supabase.storage
                .from("avatars")
                .getPublicUrl(u.avatar_url).data.publicUrl
            : "/avatar-placeholder.png"

        return (
          <div
            key={u.id}
            className="flex items-center gap-4 rounded-xl border p-4"
          >
            <Image
              src={avatar}
              width={40}
              height={40}
              unoptimized
              alt=""
              className="rounded-full"
            />
            <div>
              <p className="font-medium">{u.full_name}</p>
              <p className="text-sm text-muted-foreground">
                @{u.username}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
