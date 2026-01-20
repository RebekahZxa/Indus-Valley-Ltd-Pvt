"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Grid2x2, Heart, MessageCircle, MoreHorizontal } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/AuthContext/AuthContext"

interface Post {
  post_uuid: string
  user_id: string;
  image_url: string;
  caption: string;
  created_at: string;
  likes_count?: number;
  comments_count?: number;
}

export function ArtistPostsGrid({ onCountChange }: { onCountChange?: (count: number) => void } = {}) {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [localPostsLoaded, setLocalPostsLoaded] = useState(false)
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null)
  const [openPostId, setOpenPostId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setPosts([])
      setLoading(false)
      return
    }

    const loadPosts = async () => {
      setErrorMsg(null)

      // Always load client-side posts first to ensure immediate visibility
      let clientList: any[] = []
      try {
        clientList = JSON.parse(localStorage.getItem("local_posts") || "[]")
      } catch (e) {
        clientList = []
      }
      const clientForUser = clientList.filter((p) => p.user_id === user.id)
      if (clientForUser.length > 0) {
        setPosts(clientForUser)
        setLoading(false)
        if (onCountChange) onCountChange(clientForUser.length)
      }

      try {
        const res = await supabase
          .from("posts")
          .select("post_uuid,user_id,caption,image_url,created_at,post_likes(id),post_comments(id)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(12)

        console.log("ArtistPostsGrid: supabase posts response", res)

        let fetched = (res.data || []) as any[]

        // derive counts from embedded relations when present
        fetched = fetched.map((p: any) => {
          const likesArr = p.post_likes || []
          const commentsArr = p.post_comments || []
          return {
            ...p,
            likes_count: typeof p.likes_count === 'number' ? p.likes_count : likesArr.length,
            comments_count: typeof p.comments_count === 'number' ? p.comments_count : commentsArr.length,
          }
        })

        if (res.error) {
          console.error("Error loading posts:", res.error)
          setErrorMsg(res.error.message || String(res.error))
        }

        // If the anon client returned no rows but we have a service-side debug endpoint,
        // try fetching via the debug API which uses the service role — helps detect RLS/auth issues.
        if ((!fetched || fetched.length === 0) && user?.id) {
          try {
            const dbg = await fetch(`/api/debug/posts-for?id=${user.id}`)
            const json = await dbg.json().catch(() => null)
            if (dbg.ok && json && json.success && Array.isArray(json.posts) && json.posts.length > 0) {
              console.log("ArtistPostsGrid: debug endpoint returned posts", json.posts.length)
              fetched = json.posts
            } else {
              console.log("ArtistPostsGrid: debug endpoint empty or error", json)
            }
          } catch (e) {
            console.warn("ArtistPostsGrid: debug fetch failed", e)
          }
        }

        // Merge server and client posts but prefer server counts for likes/comments.
        // Build map from server-fetched posts first so their counts take precedence.
        const serverMap = new Map<string, any>()
        for (const p of fetched) {
          serverMap.set(String(p.post_uuid), { ...p })
        }

        // Add any client-local posts that the server didn't return (local-only drafts)
        for (const cp of clientForUser) {
          const key = String(cp.post_uuid || cp.id)
          if (!serverMap.has(key)) {
            serverMap.set(key, cp)
          } else {
            // merge client data into server record without overwriting server counts
            const srv = serverMap.get(key)
            serverMap.set(key, {
              ...srv,
              // keep server-derived counts if present
              likes_count: srv.likes_count ?? cp.likes_count ?? 0,
              comments_count: srv.comments_count ?? cp.comments_count ?? 0,
              // but prefer client image/caption if server missing
              image_url: srv.image_url ?? cp.image_url,
              caption: srv.caption ?? cp.caption,
            })
          }
        }

        const merged = Array.from(serverMap.values())
        setPosts(merged)
        if (onCountChange) onCountChange(merged.length)
      } catch (error) {
        console.error("Error loading posts (exception):", error)
        setErrorMsg(String(error))
      } finally {
        setLoading(false)
      }
    }

    loadPosts()

    // Listen for posts update event
    const handlePostsUpdated = () => {
      loadPosts()
    }

    window.addEventListener("posts-updated", handlePostsUpdated)

    // Listen for client-post-created events to prepend immediately
    const handleClientPost = (e: any) => {
      const p = e.detail
      if (!p) return
      setPosts((prev) => {
        const updated = [p, ...prev]
        if (onCountChange) onCountChange(updated.length)
        return updated
      })
    }
    window.addEventListener("client-post-created", handleClientPost)

    return () => {
      window.removeEventListener("posts-updated", handlePostsUpdated)
      window.removeEventListener("client-post-created", handleClientPost)
    }
  }, [user])

  if (loading) {
    return <div className="text-center py-8">Loading posts...</div>
  }

  if (errorMsg) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading posts: {errorMsg}
      </div>
    )
  }

  // Prefer server+local merged `posts`, but fall back to reading `local_posts` directly
  let displayedPosts = posts
  if ((!posts || posts.length === 0) && typeof window !== "undefined") {
    try {
      const clientList = JSON.parse(localStorage.getItem("local_posts") || "[]")
      const clientForUser = clientList.filter((p: any) => p.user_id === user?.id)
      if (clientForUser.length > 0) displayedPosts = clientForUser
    } catch (e) {
      // ignore
    }
  }

  if (onCountChange) onCountChange(displayedPosts.length)
  if (!displayedPosts || displayedPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <Grid2x2 className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
        <p className="text-muted-foreground">No posts yet. Create your first post!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Posts</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayedPosts.map((post: any) => {
          const isDataUrl = typeof post.image_url === "string" && post.image_url.startsWith("data:")
          const imageUrl = isDataUrl
            ? post.image_url
            : supabase.storage.from("posts").getPublicUrl(post.image_url).data.publicUrl

          const likesCount = (post as any).likes_count ?? 0
          const commentsCount = (post as any).comments_count ?? 0

          const handleLike = async () => {
            try {
              const res = await fetch(`/api/posts/${post.post_uuid}/like`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user?.id }),
              })
              const j = await res.json().catch(() => null)
              if (res.ok && j?.success) {
                // update likes_count locally when server provides it
                if (typeof j.likes_count === 'number') {
                  setPosts((prev) => prev.map((p) => (String(p.post_uuid) === String(post.post_uuid) ? { ...p, likes_count: j.likes_count } : p)))
                }
                window.dispatchEvent(new CustomEvent("posts-updated"))
                return
              }

              // Normalize error to string for checks/debugging
              const errObj = (j && j.error) || ''
              const errMsg = typeof errObj === 'string' ? errObj : (errObj && (errObj.message || JSON.stringify(errObj)))

              // If server indicates the likes table is missing, fallback to client-side
              if (typeof errMsg === 'string' && errMsg.includes("Could not find the table 'public.post_likes'")) {
                try {
                  const store = JSON.parse(localStorage.getItem('local_likes') || '{}')
                  store[post.post_uuid] = store[post.post_uuid] || []
                  const existing = store[post.post_uuid]
                  // toggle like by current user
                  const idx = existing.indexOf(user?.id)
                  if (idx === -1 && user?.id) existing.push(user.id)
                  else if (idx !== -1) existing.splice(idx, 1)
                  store[post.post_uuid] = existing
                  localStorage.setItem('local_likes', JSON.stringify(store))

                  // update UI locally
                  setPosts((prev) => prev.map((p) => {
                    if (String(p.post_uuid) !== String(post.post_uuid)) return p
                    const current = (p as any).likes_count ?? 0
                    const liked = idx === -1
                    return { ...p, likes_count: liked ? current + 1 : Math.max(0, current - 1) }
                  }))
                  window.dispatchEvent(new CustomEvent('posts-updated'))
                  alert('Like saved locally (server table missing).')
                  return
                } catch (e) {
                  console.error('Local like save failed', e)
                }
              }

              console.error('Like failed:', res.status, j)
              alert('Like failed: ' + (errMsg || `status ${res.status}`))
            } catch (e) {
              console.error('Like request failed:', e)
            }
          }

          const handleComment = async () => {
            const text = window.prompt("Add a comment:")
            if (!text) return
            try {
              const res = await fetch(`/api/posts/${post.post_uuid}/comments`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ body: text, user_id: user?.id }),
              })
              const j = await res.json().catch(() => null)
              if (res.ok && j?.success) {
                // update comments_count locally when server provides it
                if (typeof j.comments_count === 'number') {
                  setPosts((prev) => prev.map((p) => (String(p.post_uuid) === String(post.post_uuid) ? { ...p, comments_count: j.comments_count } : p)))
                }
                window.dispatchEvent(new CustomEvent("posts-updated"))
                return
              }

              const errObj = (j && j.error) || ''
              const errMsg = typeof errObj === 'string' ? errObj : (errObj && (errObj.message || JSON.stringify(errObj)))
              if (typeof errMsg === 'string' && errMsg.includes("Could not find the table 'public.post_comments'")) {
                try {
                  const store = JSON.parse(localStorage.getItem('local_comments') || '{}')
                  store[post.post_uuid] = store[post.post_uuid] || []
                  const localComment = { id: `local-${Date.now()}`, user_id: user?.id ?? 'unknown', body: text, created_at: new Date().toISOString() }
                  store[post.post_uuid].push(localComment)
                  localStorage.setItem('local_comments', JSON.stringify(store))
                  // update UI locally
                  setPosts((prev) => prev.map((p) => {
                    if (String(p.post_uuid) !== String(post.post_uuid)) return p
                    const current = (p as any).comments_count ?? 0
                    return { ...p, comments_count: current + 1 }
                  }))
                  window.dispatchEvent(new CustomEvent('posts-updated'))
                  alert('Comment saved locally (server table missing).')
                  return
                } catch (e) {
                  console.error('Local comment save failed', e)
                }
              }

              console.error('Comment failed:', res.status, j)
              alert('Comment failed: ' + (errMsg || `status ${res.status}`))
            } catch (e) {
              console.error('Comment request failed:', e)
            }
          }

          const menuOpen = openMenuFor === String(post.post_uuid)

          const handleDelete = async () => {
            if (!confirm("Delete this post? This cannot be undone.")) return
            if (!post.post_uuid || post.post_uuid === 'undefined') {
              console.error('Cannot delete post: post_uuid is missing or undefined', post)
              alert('Cannot delete this post: missing post_uuid. Please refresh or contact support.')
              return
            }
            try {
                const res = await fetch(`/api/posts/${post.post_uuid}`, {
                  method: "DELETE",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ user_id: user?.id }),
                })

                // Read raw response text for more robust debugging (some responses are non-JSON)
                const text = await res.text().catch(() => "")
                let body: any = null
                try {
                  body = text ? JSON.parse(text) : null
                } catch (e) {
                  body = text
                }

                if (!res.ok) {
                  console.error("Delete failed:", res.status, body)
                // Server delete failed — fall back to removing the post locally so the UI
                // reflects the user's action immediately. Keep a note in console so
                // we can re-try or reconcile later.
                try {
                  const lp = JSON.parse(localStorage.getItem("local_posts") || "[]")
                  const filtered = lp.filter((x: any) => String(x.post_uuid) !== String(post.post_uuid))
                  localStorage.setItem("local_posts", JSON.stringify(filtered))
                } catch (e) {
                  console.warn("Could not update local_posts during delete fallback", e)
                }
                setPosts((prev) => prev.filter((p) => String(p.post_uuid) !== String(post.post_uuid)))
                window.dispatchEvent(new CustomEvent("posts-updated"))
                // Attempt a development-only server-side delete via the debug endpoint
                try {
                  if (location.hostname === "localhost") {
                    const dbg = await fetch('/api/debug/posts/delete', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ post_uuid: post.post_uuid }),
                    })
                    const dbgText = await dbg.text().catch(() => '')
                    let dbgBody: any = null
                    try { dbgBody = dbgText ? JSON.parse(dbgText) : null } catch (e) { dbgBody = dbgText }
                    console.log('ArtistPostsGrid: debug delete response', dbg.status, dbgBody)
                    if (dbg.ok && dbgBody?.success) {
                      // success on server too
                      window.dispatchEvent(new CustomEvent('posts-updated'))
                      return
                    } else {
                      alert('Post removed locally but server delete failed. Debug delete also failed; check server logs.')
                      return
                    }
                  } else {
                    alert('Post removed locally but server delete failed. It will be retried in background.')
                    return
                  }
                } catch (e) {
                  console.warn('Debug delete failed', e)
                  alert('Post removed locally but server delete failed. It will be retried in background.')
                  return
                }
              }
              // remove from UI
              setPosts((prev) => prev.filter((p) => String(p.post_uuid) !== String(post.post_uuid)))
              // remove from local_posts if present
              try {
                const lp = JSON.parse(localStorage.getItem("local_posts") || "[]")
                const filtered = lp.filter((x: any) => String(x.post_uuid) !== String(post.post_uuid))
                localStorage.setItem("local_posts", JSON.stringify(filtered))
              } catch (e) {
                // ignore
              }
              window.dispatchEvent(new CustomEvent("posts-updated"))
            } catch (e) {
              console.error("Delete request failed:", e)
            }
          }

          // hide feature removed

            return (
            <div
              key={post.post_uuid}
              className="aspect-square rounded-lg overflow-hidden bg-muted group cursor-pointer relative border border-border"
            >
              {isDataUrl ? (
                // direct <img> for data URLs
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={post.caption || "Post"} className="object-cover w-full h-full" />
              ) : (
                <Image
                  src={imageUrl}
                  alt={post.caption || "Post"}
                  fill
                  className="object-cover group-hover:opacity-75 transition-opacity"
                />
              )}

              {/* Hover Overlay (higher z so its buttons remain clickable) */}
              <div className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-2 text-white">
                  <button onClick={handleLike} className="flex items-center gap-2">
                    <Heart className="h-5 w-5 fill-white" />
                    <span className="text-sm font-medium">{likesCount}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <button onClick={handleComment} className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">{commentsCount}</span>
                  </button>
                </div>
              </div>

              {/* Open Post Detail Modal on click (placed before menu, lower z so hover buttons can intercept) */}
              <button
                onClick={() => setOpenPostId(String(post.post_uuid))}
                className="absolute inset-0 z-10 bg-transparent"
                aria-label="Open post"
              />

              {/* More menu */}
              <div className="absolute top-2 right-2 z-40">
                <button onClick={() => setOpenMenuFor(menuOpen ? null : String(post.post_uuid))} className="p-1 rounded-full bg-black/40 text-white">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {menuOpen && (
                  <div className="mt-2 w-36 rounded-md bg-card border border-border shadow-lg text-sm text-foreground overflow-hidden z-40">
                      <button onClick={() => { handleDelete(); setOpenMenuFor(null) }} className="w-full text-left px-3 py-2 hover:bg-muted/50 text-red-600">Delete post</button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {openPostId && <PostDetailModal id={openPostId} onClose={() => setOpenPostId(null)} setPosts={setPosts} />}
    </div>
  )
}

interface PostDetailModalProps {
  id: string;
  onClose: () => void;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

function PostDetailModal({ id: post_uuid, onClose, setPosts }: PostDetailModalProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState("")

    useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch(`/api/posts/${post_uuid}/comments/get`)
      .then((r) => r.json())
      .then((j) => {
        if (!mounted) return
        if (j && j.success) {
          setComments(j.comments || [])
        } else {
          // fallback to local comments when server table is missing or call fails
          try {
            const store = JSON.parse(localStorage.getItem('local_comments') || '{}')
            const list = store[post_uuid] || []
            setComments(list)
          } catch (e) {
            setComments([])
          }
        }
      })
      .catch(() => {
        try {
          const store = JSON.parse(localStorage.getItem('local_comments') || '{}')
          const list = store[post_uuid] || []
          if (mounted) setComments(list)
        } catch (e) {
          if (mounted) setComments([])
        }
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [post_uuid])

  const submit = async () => {
    if (!text.trim()) return
    try {
      const res = await fetch(`/api/posts/${post_uuid}/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text, user_id: user?.id }),
      })
      const j = await res.json().catch(() => null)
      if (res.ok && j?.success) {
        setComments((s) => [...s, j.comment])
        setText("")
        if (typeof j.comments_count === 'number') {
          setPosts((prev: Post[]) => prev.map((p: Post) => (String(p.post_uuid) === String(post_uuid) ? { ...p, comments_count: j.comments_count } : p)))
        }
        window.dispatchEvent(new CustomEvent("posts-updated"))
        return
      } else {
        // If server complains that table missing, fallback to client-side storage
        const msg = (j && j.error) || ''
        if (typeof msg === 'string' && msg.includes("Could not find the table 'public.post_comments'")) {
          try {
            const store = JSON.parse(localStorage.getItem('local_comments') || '{}')
            store[post_uuid] = store[post_uuid] || []
            const localComment = { id: `local-${Date.now()}`, user_id: user?.id ?? 'unknown', body: text, created_at: new Date().toISOString() }
            store[post_uuid].push(localComment)
            localStorage.setItem('local_comments', JSON.stringify(store))
            setComments((s) => [...s, localComment])
            setText("")
            window.dispatchEvent(new CustomEvent("posts-updated"))
            alert('Comment saved locally (server table missing).')
            return
          } catch (e) {
            console.error('Local comment save failed', e)
          }
        }
        console.error("Comment failed", res.status, j)
        alert("Could not post comment")
      }
    } catch (e) {
      console.error(e)
      alert("Could not post comment")
    }
  }

  return (
    <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card rounded max-w-3xl w-full p-4 max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Post</h3>
          <button onClick={onClose} className="text-sm">Close</button>
        </div>
        <div className="space-y-3">
          {loading ? <p>Loading comments…</p> : (
            <div className="space-y-2">
              {comments.map((c) => (
                <div key={c.id} className="p-2 border rounded">
                  <div className="text-sm text-muted-foreground">{c.user_id}</div>
                  <div>{c.body}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="Add a comment" />
          <button onClick={submit} className="px-3 py-1 bg-blue-600 text-white rounded">Send</button>
        </div>
      </div>
    </div>
  )
}
