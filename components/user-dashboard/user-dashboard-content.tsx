"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"

type Props = {
	profile: {
		full_name: string | null
		username: string | null
		bio: string | null
		avatar_url: string | null
	}
	stats: {
		followers: number
		following: number
		notifications: number
		posts?: number
	}
}

export default function UserDashboardContent({ profile, stats }: Props) {
	const router = useRouter()
	const avatarUrl = profile.avatar_url
		? supabase.storage
				.from("avatars")
				.getPublicUrl(profile.avatar_url).data.publicUrl +
			`?v=${Date.now()}`
		: "/avatar-placeholder.png"

	return (
		<div className="space-y-8">
			{/* Profile header */}
			<div className="flex items-center gap-6 rounded-2xl border bg-card p-6">
				<div className="relative h-24 w-24 rounded-full bg-linear-to-br from-pink-400 to-purple-500 p-0.5 overflow-hidden shrink-0">
					<Image
						src={avatarUrl}
						alt="Avatar"
						width={96}
						height={96}
						unoptimized
						className="h-full w-full rounded-full object-cover"
					/>
				</div>

				<div className="flex-1">
					<h1 className="text-xl font-semibold">
						{profile.full_name || "Unnamed User"}
					</h1>
					<p className="text-sm text-muted-foreground">
						@{profile.username || "username"}
					</p>
					<p className="mt-2 text-sm">{profile.bio}</p>
				</div>

				<div className="flex flex-col gap-2">
					<Link href="/dashboard/profile">
						<Button>Edit profile</Button>
					</Link>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-3 gap-4">
				<StatCard label="Followers" value={stats.followers} />
				<StatCard label="Following" value={stats.following} />
				<StatCard label="Unread" value={stats.notifications} />
			</div>
		</div>
	)
}

function StatCard({ label, value }: { label: string; value: number }) {
	return (
		<div className="rounded-xl border bg-card p-4 text-center">
			<p className="text-2xl font-bold">{value}</p>
			<p className="text-sm text-muted-foreground">{label}</p>
		</div>
	)
}

function Stat({ label, value }: { label: string; value: number }) {
	return (
		<div className="rounded-xl border bg-card p-5">
			<p className="text-sm text-muted-foreground">{label}</p>
			<p className="text-2xl font-semibold">{value}</p>
		</div>
	)
}
