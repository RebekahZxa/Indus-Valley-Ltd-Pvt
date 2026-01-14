import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Profile = {
  full_name: string | null
  username: string | null
  bio: string | null
  avatar_url: string | null
}

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="flex items-center gap-6 rounded-xl border bg-card p-6">
      {/* Avatar */}
      <div className="relative h-20 w-20 rounded-full overflow-hidden bg-muted">
        <Image
          src={profile.avatar_url || "/avatar-placeholder.png"}
          alt="Avatar"
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold truncate">
          {profile.full_name || "Unnamed User"}
        </h2>
        <p className="text-sm text-muted-foreground truncate">
          @{profile.username || "username"}
        </p>

        {profile.bio && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {profile.bio}
          </p>
        )}
      </div>

      {/* Edit */}
      <Link href="/dashboard/profile">
        <Button variant="outline">Edit Profile</Button>
      </Link>
    </div>
  )
}
