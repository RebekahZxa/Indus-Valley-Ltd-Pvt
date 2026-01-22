"use client"

import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/AuthContext/AuthContext"
import { Button } from "@/components/ui/button"

export function MessageButton({
  targetProfileId,
}: {
  targetProfileId: string
}) {
  const { user } = useAuth()
  const router = useRouter()

  const startChat = async () => {
    console.log("MESSAGE CLICKED")

    if (!user) {
      alert("User not logged in")
      return
    }

    console.log("USER ID:", user.id)
    console.log("TARGET PROFILE ID:", targetProfileId)

    const { data, error } = await supabase.rpc(
      "get_or_create_conversation",
      {
        p_user_id: user.id,
        p_vendor_id: targetProfileId,
      }
    )

    console.log("RPC DATA:", data)
    console.log("RPC ERROR:", error)

    if (error || !data) {
      alert("Failed to create conversation. Check console.")
      return
    }

    router.push(`/messages/${data}`)
  }

  return (
    <Button variant="outline" onClick={startChat}>
      Message
    </Button>
  )
}
