"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase" // ✅ FIXED IMPORT
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

    const checkFollow = async () => {
      const { data, error } = await supabase.rpc("is_following", {
        p_user: user.id,
        p_vendor: targetUserId,
      })

      if (!error) setIsFollowing(data === true)
    }

    checkFollow()
  }, [user, targetUserId])

  const toggleFollow = async () => {
    if (!user || isFollowing === null) return
    setLoading(true)

    if (isFollowing) {
      await supabase.rpc("unfollow_vendor", {
        p_vendor: targetUserId,
      })
      setIsFollowing(false)
    } else {
      await supabase.rpc("follow_vendor", {
        p_vendor: targetUserId,
      })
      setIsFollowing(true)
    }

    setLoading(false)
  }

  if (!user || user.id === targetUserId || isFollowing === null) return null

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
