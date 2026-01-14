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
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    bio: "",
    avatar_url: "",
  })

  useEffect(() => {
    if (!user) return

    supabase
      .from("profiles")
      .select("full_name, username, bio, avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            full_name: data.full_name ?? "",
            username: data.username ?? "",
            bio: data.bio ?? "",
            avatar_url: data.avatar_url ?? "",
          })
        }
      })
  }, [user])

  async function handleSave() {
    setLoading(true)

    await supabase
      .from("profiles")
      .update({
        full_name: form.full_name || null,
        username: form.username || null,
        bio: form.bio || null,
        avatar_url: form.avatar_url || null,
      })
      .eq("id", user!.id)

    setLoading(false)

    // ✅ Redirect back to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-8">
        {/* PAGE HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold">Edit profile</h1>
          <p className="text-muted-foreground">
            Update how you appear to others on Indus Valley
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="rounded-2xl border bg-card p-8 space-y-8">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Image
              src={form.avatar_url || "/avatar-placeholder.png"}
              alt="Avatar"
              width={96}
              height={96}
              className="rounded-full border object-cover"
            />

            <div className="w-full space-y-2">
              <Label>Avatar URL</Label>
              <Input
                placeholder="https://image.url"
                value={form.avatar_url}
                onChange={(e) =>
                  setForm({ ...form, avatar_url: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Image uploads coming soon
              </p>
            </div>
          </div>

          {/* FORM GRID */}
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Used in your public profile URL
              </p>
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                rows={4}
                placeholder="Tell people a little about yourself"
                value={form.bio}
                onChange={(e) =>
                  setForm({ ...form, bio: e.target.value })
                }
              />
            </div>
          </div>

          {/* ACTION BAR */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
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
