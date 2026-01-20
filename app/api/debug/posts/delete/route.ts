import { NextResponse } from "next/server"
import { createSupabaseServiceClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ success: false, error: "Not allowed" }, { status: 403 })
    }

    const body = await request.json().catch(() => ({}))
    const { post_uuid } = body || {}
    if (!post_uuid) return NextResponse.json({ success: false, error: "Missing post_uuid" }, { status: 400 })

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ success: false, error: 'Service role or Supabase URL not configured' }, { status: 500 })
    }

    const svc = createSupabaseServiceClient()
    // Use service-role client to delete safely regardless of RLS
    const { data, error } = await svc.from('posts').delete().eq('post_uuid', post_uuid)
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
