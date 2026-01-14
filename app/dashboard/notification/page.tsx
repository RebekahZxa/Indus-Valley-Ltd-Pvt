"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/AuthContext/AuthContext"
import { supabase } from "@/lib/supabase/client"

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (!user) return

    async function load() {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      setNotifications(data ?? [])

      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
    }

    load()
  }, [user])

  if (!user) return null

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">Notifications</h1>

      {notifications.length === 0 && (
        <p className="text-muted-foreground">No notifications</p>
      )}

      {notifications.map((n) => (
        <Link
          key={n.id}
          href={n.link ?? "#"}
          className="block rounded border p-4 hover:bg-muted"
        >
          <p>{n.message}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(n.created_at).toLocaleString()}
          </p>
        </Link>
      ))}
    </div>
  )
}
