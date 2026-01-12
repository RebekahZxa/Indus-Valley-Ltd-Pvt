"use client"

import { useState } from "react"
import Image from "next/image"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function AvatarUpload({
  userId,
  avatarUrl,
  onUploaded,
}: {
  userId: string
  avatarUrl: string | null
  onUploaded: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)

  async function handleUpload(file: File) {
    setUploading(true)

    const ext = file.name.split(".").pop()
    const path = `${userId}.${ext}`

    await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true })

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(path)

    const publicUrl = data.publicUrl

    await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId)

    onUploaded(publicUrl)
    setUploading(false)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 rounded-full overflow-hidden border">
        <Image
          src={avatarUrl ?? "/avatar-placeholder.png"}
          alt="Avatar"
          fill
          className="object-cover"
        />
      </div>

      <label>
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) =>
            e.target.files && handleUpload(e.target.files[0])
          }
        />
        <Button variant="outline" disabled={uploading}>
          {uploading ? "Uploading..." : "Change Avatar"}
        </Button>
      </label>
    </div>
  )
}
