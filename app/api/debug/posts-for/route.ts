import { NextResponse } from "next/server"
import { createSupabaseServiceClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const user_id = url.searchParams.get("id")
    if (!user_id) return NextResponse.json({ success: false, error: "Missing user_id" }, { status: 400 })

    const svc = createSupabaseServiceClient()
    const resp = await svc
      .from("posts")
      .select("post_uuid,user_id,caption,image_url,created_at,post_likes(post_uuid),post_comments(post_uuid)")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (resp.error) {
      return NextResponse.json({ success: false, error: resp.error.message }, { status: 500 })
    }

    // derive counts for convenience
    const postsWithCounts = (resp.data ?? []).map((p: any) => ({
      ...p,
      likes_count: (p.post_likes || []).length,
      comments_count: (p.post_comments || []).length,
    }))

    return NextResponse.json({ success: true, posts: postsWithCounts })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
