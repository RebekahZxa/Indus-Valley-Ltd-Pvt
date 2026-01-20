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
import { ImageCropper, type CropData } from "@/components/ImageCropper"
import { Upload } from "lucide-react"
import { ArtistPostCreator } from "@/components/artist/ArtistPostCreator"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [avatarPath, setAvatarPath] = useState<string | null>(null)
  const [avatarVersion, setAvatarVersion] = useState(Date.now())
  const [showCropper, setShowCropper] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

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

  // 🔹 Handle avatar file selection - show cropper
  async function handleAvatarSelect(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
  }

  // 🔹 Handle crop completion
  async function handleCropComplete(croppedImageBlob: Blob, cropData: CropData) {
    if (!user) return

    // Create a file from blob
    const file = new File([croppedImageBlob], `avatar_${user.id}_cropped.png`, { type: "image/png" })
    
    // Upload to storage
    const ext = "png"
    const filePath = `avatars/${user.id}.${ext}`

    await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        cacheControl: "0",
      })

    // Save path to profiles
    await supabase
      .from("profiles")
      .update({ avatar_url: filePath })
      .eq("id", user.id)

    setAvatarPath(filePath)
    setAvatarVersion(Date.now())
    setShowCropper(false)
    setSelectedImage(null)
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
          {/* Avatar - Circular Display */}
          <div className="flex flex-col items-center gap-6">
            {/* Circular Profile Photo */}
            <div className="relative shrink-0 cursor-pointer group">
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={128}
                height={128}
                unoptimized
                className="h-32 w-32 rounded-full border-4 border-pink-400 object-cover"
                priority
              />
              
              {/* Upload overlay on hover */}
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100">
                <Upload className="text-white h-6 w-6" />
              </div>
            </div>

            {/* File input */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleAvatarSelect(e.target.files[0])
                }
              }}
              className="hidden"
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload">
              <Button asChild variant="outline" className="cursor-pointer">
                <span>Change Photo</span>
              </Button>
            </label>

            <p className="text-xs text-muted-foreground text-center">
              Click "Change Photo" to upload and crop your profile picture in a circle
            </p>
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

      {/* Artist post creator removed from shared profile page to prevent user access */}

      {/* Image Cropper Modal */}
      {showCropper && selectedImage && (
        <ImageCropper
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false)
            setSelectedImage(null)
          }}
        />
      )}
    </div>
  )
}
