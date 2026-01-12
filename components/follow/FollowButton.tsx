"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/AuthContext/AuthContext"

interface FollowButtonProps {
  targetUserId: string
}

export default function FollowButton({ targetUserId }: FollowButtonProps) {
  const { user } = useAuth()
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    async function checkFollow() {
      const { data } = await supabase
        .from("follows")
        .select("follower_id")
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId)
        .maybeSingle()

      setIsFollowing(!!data)
    }

    checkFollow()
  }, [user, targetUserId])

  async function toggleFollow() {
    if (!user) return
    setLoading(true)

    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId)
    } else {
      await supabase.from("follows").insert({
        follower_id: user.id,
        following_id: targetUserId,
      })
    }

    setIsFollowing(!isFollowing)
    setLoading(false)
  }

  if (!user || user.id === targetUserId || isFollowing === null) {
    return null
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      onClick={toggleFollow}
      disabled={loading}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  )
}
