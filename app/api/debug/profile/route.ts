import { NextResponse } from "next/server"
import { createSupabaseServiceClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")
    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 })

    const svc = createSupabaseServiceClient()
    const resp = await svc.from("profiles").select("id,username,full_name,role,avatar_url").eq("id", id).single()

    if (resp.error) {
      return NextResponse.json({ success: false, error: resp.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, profile: resp.data ?? null })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
