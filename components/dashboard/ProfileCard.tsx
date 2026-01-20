"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn } from "lucide-react"

type Profile = {
  full_name: string | null
  username: string | null
  bio: string | null
  avatar_url: string | null
}

export function ProfileCard({ profile }: { profile: Profile }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="flex items-center gap-6 rounded-xl border bg-card p-6">
        <div
          className="relative shrink-0 cursor-pointer group h-20 w-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 p-0.5 overflow-hidden"
          onClick={() => setShowModal(true)}
        >
          <Image
            src={profile.avatar_url || "/avatar-placeholder.png"}
            alt="Avatar"
            width={80}
            height={80}
            className="h-full w-full rounded-full object-cover"
            priority
          />
          <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold truncate">{profile.full_name || "Unnamed User"}</h2>
          <p className="text-sm text-muted-foreground truncate">@{profile.username || "username"}</p>
          {profile.bio && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/dashboard/profile">
            <Button variant="outline">Edit Profile</Button>
          </Link>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setShowModal(false)}>
          <div className="relative max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl">✕</button>
            <Image src={profile.avatar_url || "/avatar-placeholder.png"} alt={profile.full_name || "Profile"} width={288} height={288} className="h-72 w-72 rounded-full border-4 border-pink-400 object-cover" priority />
            <div className="mt-6 text-center text-white">
              <h3 className="text-xl font-semibold">{profile.full_name || "User"}</h3>
              <p className="text-sm text-gray-300 mt-1">@{profile.username || "username"}</p>
              {profile.bio && <p className="text-sm text-gray-200 mt-3">{profile.bio}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
