"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/AuthContext/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [avatarPath, setAvatarPath] = useState<string | null>(null)
  const [avatarVersion, setAvatarVersion] = useState(Date.now())

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    bio: "",
  })

  // 🔹 Load profile
  useEffect(() => {
    if (!user) return

    supabase
      .from("profiles")
      .select("full_name, username, bio, avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (!data) return
        setForm({
          full_name: data.full_name ?? "",
          username: data.username ?? "",
          bio: data.bio ?? "",
        })
        setAvatarPath(data.avatar_url)
      })
  }, [user])

  // 🔹 Upload avatar
  async function handleAvatarUpload(file: File) {
    if (!user) return

    const ext = file.name.split(".").pop()
    const filePath = `avatars/${user.id}.${ext}`

    await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        cacheControl: "0",
      })

    // save ONLY path
    await supabase
      .from("profiles")
      .update({ avatar_url: filePath })
      .eq("id", user.id)

    setAvatarPath(filePath)
    setAvatarVersion(Date.now()) // 🔥 bust cache
  }

  // 🔹 Save profile
  async function handleSave() {
    setLoading(true)

    await supabase
      .from("profiles")
      .update({
        full_name: form.full_name || null,
        username: form.username || null,
        bio: form.bio || null,
      })
      .eq("id", user!.id)

    setLoading(false)

    router.refresh()
    router.push("/dashboard")
  }

  const avatarUrl = avatarPath
    ? supabase.storage.from("avatars").getPublicUrl(avatarPath).data.publicUrl +
      `?v=${avatarVersion}`
    : "/avatar-placeholder.png"

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold">Edit profile</h1>
          <p className="text-muted-foreground">
            Update how you appear to others
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-8 space-y-8">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={96}
              height={96}
              unoptimized
              className="rounded-full border object-cover"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleAvatarUpload(e.target.files[0])
              }
            />
          </div>

          {/* Form */}
          <div className="grid gap-6">
            <div>
              <Label>Full name</Label>
              <Input
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Username</Label>
              <Input
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Bio</Label>
              <Textarea
                rows={4}
                value={form.bio}
                onChange={(e) =>
                  setForm({ ...form, bio: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
