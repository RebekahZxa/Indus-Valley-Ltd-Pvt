import { NextResponse } from "next/server"
import { createSupabaseServiceClient } from "@/lib/supabase/server"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id: user_id } = params
    if (!user_id) return NextResponse.json({ success: false, error: "Missing user_id" }, { status: 400 })

    const svc = createSupabaseServiceClient()
    const resp = await svc.from("posts").select("post_uuid,user_id,caption,image_url,created_at").eq("user_id", user_id).order("created_at", { ascending: false }).limit(50)

    if (resp.error) {
      return NextResponse.json({ success: false, error: resp.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, posts: resp.data ?? [] })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
