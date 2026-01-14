import { createSupabaseServerClient } from "@/lib/supabase/server"
import FollowButton from "@/components/follow/FollowButton"
import Image from "next/image"

export default async function ArtistProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createSupabaseServerClient()

  const { data: artist } = await supabase
    .from("profiles")
    .select("id, full_name, username, bio, avatar_url")
    .eq("id", params.id)
    .single()

  if (!artist) {
    return <div>User not found</div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Image
          src={artist.avatar_url ?? "/avatar-placeholder.png"}
          alt="avatar"
          width={80}
          height={80}
          className="rounded-full"
        />

        <div>
          <h1 className="text-2xl font-bold">
            {artist.full_name ?? "Unnamed Artist"}
          </h1>
          <p className="text-muted-foreground">
            @{artist.username ?? "username"}
          </p>
        </div>
      </div>

      <p>{artist.bio ?? "No bio yet."}</p>

      {/* 👇 FOLLOW BUTTON HERE */}
      <FollowButton targetUserId={artist.id} />
    </div>
  )
}
