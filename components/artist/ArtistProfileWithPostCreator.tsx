"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/AuthContext/AuthContext"

interface ArtistProfile {
  id: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
}

export function ArtistProfileWithPostCreator() {
    console.log("ArtistProfileWithPostCreator RENDERED")

  const { user } = useAuth()
  const [profile, setProfile] = useState<ArtistProfile | null>(null)

  useEffect(() => {
    if (!user) return

    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url")
        .eq("id", user.id)
        .single()

      setProfile(data)
    }

    loadProfile()
  }, [user])

  // Listen for create-post requests from other UI locations (e.g., ProfileCard button)
  useEffect(() => {
    const handler = () => {
      const input = document.getElementById("post-file-input") as HTMLInputElement | null
      if (input) {
        input.click()
      } else {
        console.warn("DEBUG: post-file-input not found when requested")
      }
    }

    window.addEventListener("request-post-file", handler)
    return () => window.removeEventListener("request-post-file", handler)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      ;(window as any).__pendingPostFile = file
      window.dispatchEvent(
        new CustomEvent("post-file-selected", { detail: { file } })
      )
    }
  }

  // Dev-only diagnostics: locate the create-post button, log computed styles and any ancestor overflow
  useEffect(() => {
    if (typeof window === "undefined") return

    const timer = setTimeout(() => {
      const btn = document.querySelector('button[title="Create post"]') as HTMLElement | null
      console.log("DEBUG: create-post button present:", !!btn, btn)
      if (btn) {
        const rect = btn.getBoundingClientRect()
        console.log("DEBUG: btn rect:", rect)
        const cs = window.getComputedStyle(btn)
        console.log("DEBUG: btn styles:", {
          display: cs.display,
          visibility: cs.visibility,
          opacity: cs.opacity,
          zIndex: cs.zIndex,
        })

        // walk up to find any ancestor with overflow hidden/clip
        let el: HTMLElement | null = btn.parentElement
        while (el) {
          const style = window.getComputedStyle(el)
          if (/(hidden|clip)/.test(style.overflow + style.overflowX + style.overflowY)) {
            console.log("DEBUG: ancestor clipping overflow found:", el, {
              overflow: style.overflow,
              overflowX: style.overflowX,
              overflowY: style.overflowY,
            })
            break
          }
          el = el.parentElement
        }
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [profile])

  const avatarUrl = profile?.avatar_url
    ? supabase.storage
        .from("avatars")
        .getPublicUrl(profile.avatar_url).data.publicUrl
    : "/avatar-placeholder.png"

  return (
    <div className="flex items-center gap-6 rounded-2xl border bg-card p-6 mb-6">
      {/* Avatar with embedded Plus icon */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-visible">
        {/* Avatar */}
        <div className="relative h-full w-full rounded-full bg-gradient-to-br from-pink-400 to-purple-500 p-0.5 overflow-visible">
          <img
            src={avatarUrl}
            alt={profile?.full_name || "Profile"}
            className="h-full w-full rounded-full object-cover bg-background"
          />

          {/* Hidden File Input (moved inside wrapper) */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="post-file-input"
          />

          {/* Removed dev debug red dot to avoid showing a red badge in the UI */}

          {/* Floating create post button (artist-only) - positioned at bottom-right of avatar */}
          <button
            title="Create post"
            aria-label="Create post"
            onClick={(e) => {
              // Directly click the local hidden input so browser treats it as a trusted user activation
              const input = document.getElementById("post-file-input") as HTMLInputElement | null
              if (input) {
                input.click()
                return
              }

              // Fallback: dispatch events the post creator listens to
              try {
                window.dispatchEvent(new Event("open-post-creator"))
              } catch (err) {
                window.dispatchEvent(new Event("request-post-file"))
              }
            }}
            className="absolute -right-2 -bottom-2 h-10 w-10 inline-flex items-center justify-center rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 z-20"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      

      {/* Profile Info */}
      <div className="flex-1">
        <h1 className="text-xl font-semibold">
          {profile?.full_name || "Artist"}
        </h1>
        <p className="text-sm text-muted-foreground">
          @{profile?.username || "username"}
        </p>
      </div>
    </div>
  )
}
