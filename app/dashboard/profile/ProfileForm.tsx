"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"

type Profile = {
  id: string
  email: string
  full_name: string | null
  username: string | null
  bio: string | null
  role: string
  avatar_url: string | null
}

export default function ProfileForm({
  initialProfile,
}: {
  initialProfile: Profile
}) {
  const [profile, setProfile] = useState(initialProfile)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSave() {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        username: profile.username,
        bio: profile.bio,
      })
      .eq("id", profile.id)

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="space-y-4">
      {/* Email (read-only) */}
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          value={profile.email}
          disabled
          className="w-full rounded border px-3 py-2 bg-muted"
        />
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium">Full name</label>
        <input
          value={profile.full_name ?? ""}
          onChange={(e) =>
            setProfile({ ...profile, full_name: e.target.value })
          }
          className="w-full rounded border px-3 py-2"
        />
      </div>

      {/* Username */}
      <div>
        <label className="block text-sm font-medium">Username</label>
        <input
          value={profile.username ?? ""}
          onChange={(e) =>
            setProfile({ ...profile, username: e.target.value })
          }
          className="w-full rounded border px-3 py-2"
        />
        <p className="text-xs text-muted-foreground">
          This will be public
        </p>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium">Bio</label>
        <textarea
          value={profile.bio ?? ""}
          onChange={(e) =>
            setProfile({ ...profile, bio: e.target.value })
          }
          className="w-full rounded border px-3 py-2"
          rows={4}
        />
      </div>

      {/* Feedback */}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">Profile updated</p>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save changes"}
      </button>
    </div>
  )
}
