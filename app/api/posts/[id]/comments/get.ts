import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const svc = createSupabaseServerClient()
    const { data, error } = await svc
      .from("post_comments")
      .select("id, user_id, body, created_at")
      .eq("post_id", params.id)
      .order("created_at", { ascending: true })

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, comments: data ?? [] })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
