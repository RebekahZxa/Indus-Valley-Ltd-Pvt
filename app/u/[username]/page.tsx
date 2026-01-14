"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/AuthContext/AuthContext"
import { Button } from "@/components/ui/button"

export default function PublicProfilePage() {
  const { username } = useParams()
  const { user } = useAuth()

  const [profile, setProfile] = useState<any>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followers, setFollowers] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!username) return

    async function loadProfile() {
      // 1️⃣ Load profile by username
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, full_name, username, bio, avatar_url, role")
        .eq("username", username)
        .single()

      if (!profileData) {
        setLoading(false)
        return
      }

      setProfile(profileData)

      // 2️⃣ Followers count
      const { count } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", profileData.id)

      setFollowers(count ?? 0)

      // 3️⃣ Is following?
      if (user) {
        const { data } = await supabase
          .from("follows")
          .select("follower_id")
          .eq("follower_id", user.id)
          .eq("following_id", profileData.id)
          .single()

        setIsFollowing(!!data)
      }

      setLoading(false)
    }

    loadProfile()
  }, [username, user])

  async function toggleFollow() {
    if (!user || !profile) return

    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", profile.id)

      setIsFollowing(false)
      setFollowers((f) => f - 1)
    } else {
      await supabase.from("follows").insert({
        follower_id: user.id,
        following_id: profile.id,
      })

      setIsFollowing(true)
      setFollowers((f) => f + 1)
    }
  }

  if (loading) {
    return <div className="p-8">Loading profile…</div>
  }

  if (!profile) {
    return <div className="p-8">Profile not found</div>
  }

  const isOwnProfile = user?.id === profile.id

  return (
    <div className="flex justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-8">
        {/* PROFILE HEADER */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Image
              src={profile.avatar_url || "/avatar-placeholder.png"}
              alt="Avatar"
              width={96}
              height={96}
              className="rounded-full border object-cover"
            />

            <div>
              <h1 className="text-2xl font-semibold">
                {profile.full_name || profile.username}
              </h1>
              <p className="text-muted-foreground">@{profile.username}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {followers} follower{followers !== 1 && "s"}
              </p>
            </div>
          </div>

          {/* FOLLOW BUTTON */}
          {!isOwnProfile && user && (
            <Button
              variant={isFollowing ? "outline" : "default"}
              onClick={toggleFollow}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>

        {/* BIO */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-medium mb-2">About</h2>
          <p className="text-muted-foreground">
            {profile.bio || "No bio available."}
          </p>
        </div>
      </div>
    </div>
  )
}
