"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/AuthContext/AuthContext"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

/* -----------------------------
   TYPES
------------------------------ */
type Profile = {
  id: string
  username: string
  full_name: string | null
  bio: string | null
  avatar_url: string | null
}

/* -----------------------------
   AVATAR NORMALIZER
------------------------------ */
const buildAvatarSrc = (url: string | null) => {
  if (!url) return "/avatar-placeholder.png"
  if (url.startsWith("http")) return url

  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL +
    "/storage/v1/object/public/" +
    url
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [posts, setPosts] = useState(0)
  const [loading, setLoading] = useState(true)

  /* -----------------------------
     LOAD PROFILE + STATS
  ------------------------------ */
  useEffect(() => {
    if (!user) return

    const load = async () => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, full_name, bio, avatar_url")
        .eq("id", user.id)
        .single()

      setProfile(profileData)

      const { data: stats } = await supabase.rpc(
        "get_profile_follow_stats",
        {
          p_profile_id: user.id,
          p_viewer_id: user.id,
        }
      )

      if (stats && stats.length > 0) {
        setFollowers(Number(stats[0].followers))
        setFollowing(Number(stats[0].following))
      }

      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      setPosts(count ?? 0)
      setLoading(false)
    }

    load()
  }, [user])

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-10">
          {loading && (
            <div className="text-muted-foreground">
              Loading dashboard…
            </div>
          )}

          {!loading && profile && (
            <div className="max-w-4xl mx-auto space-y-10">

              {/* PROFILE HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <Image
                  src={buildAvatarSrc(profile.avatar_url)}
                  alt=""
                  width={96}
                  height={96}
                  className="rounded-full border"
                  unoptimized
                />

                <div className="flex-1">
                  <h1 className="text-2xl font-semibold">
                    {profile.full_name || profile.username}
                  </h1>
                  <p className="text-muted-foreground">
                    @{profile.username}
                  </p>

                  <div className="flex gap-6 mt-3 text-sm">
                    <span>
                      <b>{followers}</b> followers
                    </span>
                    <span>
                      <b>{following}</b> following
                    </span>
                    <span>
                      <b>{posts}</b> posts
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href="/dashboard/profile">
                    <Button variant="outline">
                      Edit Profile
                    </Button>
                  </Link>

                  <Link href={`/u/${profile.username}`}>
                    <Button>
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>

              {/* BIO */}
              <div className="rounded-xl border bg-card p-6">
                <h2 className="font-medium mb-2">
                  About
                </h2>
                <p className="text-muted-foreground">
                  {profile.bio || "No bio added yet."}
                </p>
              </div>

              {/* QUICK ACTIONS */}
              <div className="grid sm:grid-cols-3 gap-6">
                <Link
                  href="/messages"
                  className="rounded-xl border bg-card p-6 hover:bg-accent transition"
                >
                  <p className="font-medium">Messages</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    View your conversations
                  </p>
                </Link>

                <Link
                  href="/dashboard/settings"
                  className="rounded-xl border bg-card p-6 hover:bg-accent transition"
                >
                  <p className="font-medium">Settings</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Account & privacy
                  </p>
                </Link>

                <Link
                  href="/dashboard/monetization"
                  className="rounded-xl border bg-card p-6 hover:bg-accent transition"
                >
                  <p className="font-medium">Monetization</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sessions, workshops, pricing
                  </p>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
