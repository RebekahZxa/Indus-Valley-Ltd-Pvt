"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/AuthContext/AuthContext"
import { Button } from "@/components/ui/button"

/* --------------------------------
   TYPES
--------------------------------- */
type Message = {
  id: string
  sender_id: string
  encrypted_body: string
  created_at: string
  client_id?: string
  sender_username: string
  sender_avatar_url: string | null
}

type Peer = {
  id: string
  username: string
  avatar_url: string | null
  last_seen_at: string | null
}

/* --------------------------------
   AVATAR URL NORMALIZER
--------------------------------- */
const buildAvatarSrc = (
  avatarUrl: string | null,
  version?: string | null
) => {
  if (!avatarUrl) return "/avatar-placeholder.png"

  if (avatarUrl.startsWith("http")) {
    return version
      ? `${avatarUrl}?v=${new Date(version).getTime()}`
      : avatarUrl
  }

  const base =
    process.env.NEXT_PUBLIC_SUPABASE_URL +
    "/storage/v1/object/public/"

  return base + avatarUrl
}

export default function ConversationPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const bottomRef = useRef<HTMLDivElement>(null)

  const conversationId =
    typeof params.conversationId === "string"
      ? params.conversationId
      : params.conversationId?.[0]

  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const [peer, setPeer] = useState<Peer | null>(null)

  /* --------------------------------
     PROFILE NAVIGATION (KEY ADDITION)
  --------------------------------- */
  const openPeerProfile = () => {
    if (!peer || !user) return

    if (peer.id === user.id) {
      router.push("/u/me")
      return
    }

    router.push(`/u/${peer.username}`)
  }

  /* --------------------------------
     LOAD PEER
  --------------------------------- */
  useEffect(() => {
    if (!conversationId || !user) return

    const loadPeer = async () => {
      const { data: convo } = await supabase
        .from("conversations")
        .select("user_id, vendor_id")
        .eq("id", conversationId)
        .single()

      if (!convo) return

      const peerId =
        convo.user_id === user.id
          ? convo.vendor_id
          : convo.user_id

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, last_seen_at")
        .eq("id", peerId)
        .single()

      setPeer(profile)
    }

    loadPeer()
  }, [conversationId, user])

  /* --------------------------------
     LOAD + REALTIME MESSAGES
  --------------------------------- */
  useEffect(() => {
    if (!conversationId || !user) return

    const load = async () => {
      const { data } = await supabase.rpc(
        "get_conversation_messages",
        { p_conversation_id: conversationId }
      )

      setMessages(data ?? [])
      scrollToBottom()
    }

    load()

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const incoming = payload.new as any

          setMessages((prev) => {
            if (
              prev.some(
                (m) =>
                  m.id === incoming.id ||
                  (incoming.client_id &&
                    m.client_id === incoming.client_id)
              )
            ) {
              return prev
            }

            return [
              ...prev,
              {
                id: incoming.id,
                sender_id: incoming.sender_id,
                encrypted_body: incoming.encrypted_body,
                created_at: incoming.created_at,
                client_id: incoming.client_id,
                sender_username:
                  incoming.sender_id === user.id
                    ? "You"
                    : peer?.username ?? "User",
                sender_avatar_url:
                  incoming.sender_id === user.id
                    ? null
                    : peer?.avatar_url ?? null,
              },
            ]
          })

          scrollToBottom()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, user, peer])

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    })
  }

  /* --------------------------------
     SEND MESSAGE
  --------------------------------- */
  const send = async () => {
    if (!text.trim() || !conversationId || !user) return

    const clientId = crypto.randomUUID()

    const optimistic: Message = {
      id: clientId,
      sender_id: user.id,
      encrypted_body: text,
      created_at: new Date().toISOString(),
      client_id: clientId,
      sender_username: "You",
      sender_avatar_url: null,
    }

    setMessages((m) => [...m, optimistic])
    scrollToBottom()
    setText("")

    await supabase.rpc("send_message_secure", {
      p_conversation_id: conversationId,
      p_encrypted_body: text,
      p_sender_role: "user",
      p_client_id: clientId,
    })
  }

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

  if (!user) return null

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#0E0E18] via-[#141423] to-[#1B0E18]">

      {/* HEADER (CLICKABLE) */}
      <div
        onClick={openPeerProfile}
        role="button"
        aria-label="Open profile"
        className="flex items-center gap-4 px-6 py-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition"
      >
        <Image
          src={buildAvatarSrc(peer?.avatar_url, peer?.last_seen_at)}
          alt=""
          width={44}
          height={44}
          className="rounded-full border border-white/20"
          unoptimized
        />
        <div>
          <p className="font-medium text-white">
            {peer?.username || "Conversation"}
          </p>
          <p className="text-xs text-white/60">
            {peer?.last_seen_at
              ? `Last seen ${new Date(peer.last_seen_at).toLocaleString()}`
              : "Offline"}
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.map((m) => {
          const isMe = m.sender_id === user.id

          return (
            <div
              key={m.id}
              className={`flex gap-3 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isMe && (
                <Image
                  src={buildAvatarSrc(m.sender_avatar_url)}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded-full cursor-pointer hover:opacity-80"
                  unoptimized
                  onClick={openPeerProfile}
                />
              )}

              <div className="max-w-[65%]">
                {!isMe && (
                  <p className="text-xs text-white/60 mb-1">
                    {m.sender_username}
                  </p>
                )}

                <div
                  className={`px-4 py-2 text-sm ${
                    isMe
                      ? "bg-gradient-to-r from-[#6A00FF] to-[#800020] text-white rounded-2xl rounded-br-sm"
                      : "bg-white/10 text-white rounded-2xl rounded-bl-sm"
                  }`}
                >
                  {m.encrypted_body}
                </div>

                <p className="text-[11px] text-white/40 mt-1 text-right">
                  {formatTime(m.created_at)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="border-t border-white/10 px-6 py-4">
        <div className="flex gap-3">
          <input
            className="flex-1 rounded-full px-4 py-3 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#8B1EFF]"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <Button
            onClick={send}
            className="rounded-full px-6 bg-gradient-to-r from-[#6A00FF] to-[#800020]"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
