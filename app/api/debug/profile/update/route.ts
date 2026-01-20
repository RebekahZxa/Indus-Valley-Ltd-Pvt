import { NextResponse } from "next/server"
import { createSupabaseServiceClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { id, role } = body || {}
    if (!id || !role) return NextResponse.json({ success: false, error: "Missing id or role" }, { status: 400 })

    const svc = createSupabaseServiceClient()
    const resp = await svc.from("profiles").update({ role }).eq("id", id).select().single()

    if (resp.error) {
      return NextResponse.json({ success: false, error: resp.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, profile: resp.data })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
