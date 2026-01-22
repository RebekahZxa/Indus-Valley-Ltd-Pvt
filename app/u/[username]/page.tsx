"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/AuthContext/AuthContext"
import { Button } from "@/components/ui/button"
import { MessageButton } from "@/components/profile/MessageButton"


type Profile = {
  id: string
  username: string
  full_name: string | null
  bio: string | null
  avatar_url: string | null
}

export default function PublicProfilePage() {
  const params = useParams()
  const username =
    typeof params.username === "string"
      ? params.username
      : params.username?.[0]

  const { user } = useAuth()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  /* -------------------------------
     LOAD PROFILE
  -------------------------------- */
  useEffect(() => {
    if (!username) return

    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, full_name, bio, avatar_url")
        .eq("username", username)
        .single()

      if (!data) {
        setProfile(null)
        setLoading(false)
        return
      }

      setProfile(data)
    }

    loadProfile()
  }, [username])

  /* -------------------------------
     LOAD FOLLOW STATS (DB TRUTH)
  -------------------------------- */
  const loadStats = async (profileId: string) => {
    const { data } = await supabase.rpc("get_profile_follow_stats", {
      p_profile_id: profileId,
      p_viewer_id: user?.id ?? profileId, // safe fallback
    })

    if (data && data.length > 0) {
      setFollowers(Number(data[0].followers))
      setFollowing(Number(data[0].following))
      setIsFollowing(data[0].is_following)
    }
  }

  useEffect(() => {
    if (!profile) return
    loadStats(profile.id).finally(() => setLoading(false))
  }, [profile, user])

  /* -------------------------------
     FOLLOW / UNFOLLOW
  -------------------------------- */
  const toggleFollow = async () => {
    if (!user || !profile) return

    if (isFollowing) {
      await supabase.rpc("unfollow_vendor", { p_vendor: profile.id })
    } else {
      await supabase.rpc("follow_vendor", { p_vendor: profile.id })
    }

    // 🔥 single source of truth
    await loadStats(profile.id)
  }

  /* -------------------------------
     RENDER
  -------------------------------- */
  if (loading) return <div className="p-10">Loading…</div>
  if (!profile) return <div className="p-10">Profile not found</div>

  const isOwnProfile = user?.id === profile.id

  return (
    <div className="flex justify-center px-4 py-12">
      <div className="w-full max-w-4xl space-y-10">

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
              <div className="flex gap-6 mt-2 text-sm">
                <span><b>{followers}</b> followers</span>
                <span><b>{following}</b> following</span>
              </div>
            </div>
          </div>

          {!isOwnProfile && user && (
  <div className="flex gap-2">
    <Button
      variant={isFollowing ? "outline" : "default"}
      onClick={toggleFollow}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>

    <MessageButton targetProfileId={profile.id} />
  </div>
)}

        </div>

        <section className="rounded-xl border p-6">
          <h2 className="font-medium mb-2">About</h2>
          <p className="text-muted-foreground">
            {profile.bio || "No bio available."}
          </p>
        </section>

      </div>
    </div>
  )
}
