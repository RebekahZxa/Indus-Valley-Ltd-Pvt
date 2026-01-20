import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Parse optional body to support a development fallback user_id when server-side auth is not available
    let body: any = {}
    try {
      body = await request.json()
    } catch (e) {
      body = {}
    }

    const fallbackUserId = body?.user_id || null

    // If there is no server-authenticated user, allow a dev-only fallback when enabled
    if (!user) {
      if (process.env.NODE_ENV === "development") {
        if (!fallbackUserId) {
          return NextResponse.json({ success: false, error: "Unauthorized", note: "no server user and no fallbackUserId" }, { status: 401 })
        }
      } else {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
      }
    }

    const post_uuid = params.id

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ success: false, error: 'Service role or Supabase URL not configured' }, { status: 500 })
    }

    const serviceSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Ensure the user owns the post before deleting (service role used to bypass RLS but we still check)
    const { data: existing, error: selErr } = await serviceSupabase
      .from("posts")
      .select("user_id")
      .eq("post_uuid", post_uuid)
      .maybeSingle()

    if (selErr) {
      const cookieStore = await cookies()
      const payload: any = {
        success: false,
        error: String(selErr?.message ?? selErr),
      }
      if (process.env.NODE_ENV === "development") {
        try {
          payload.debug = JSON.parse(JSON.stringify(selErr))
        } catch (e) {
          payload.debug = String(selErr)
        }
        payload.cookieCount = cookieStore.getAll().length
      }
      return NextResponse.json(payload, { status: 500 })
    }

    if (!existing) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 })
    }

    const effectiveUserId = user?.id ?? fallbackUserId

    if (existing.user_id !== effectiveUserId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const delResp = await serviceSupabase.from("posts").delete().eq("post_uuid", post_uuid)
    const delErr = delResp.error

    // If the delete reported an error but the row no longer exists, treat as success.
    if (delErr) {
      try {
        const { data: check, error: checkErr } = await serviceSupabase.from("posts").select("post_uuid").eq("post_uuid", post_uuid).maybeSingle()
        if (!check && !checkErr) {
          // row gone - consider delete successful
          if (process.env.NODE_ENV === "development") {
            const cookieStore = await cookies()
            return NextResponse.json({ success: true, debug: { note: "delete reported error but row absent, treating as success", delResp: JSON.parse(JSON.stringify(delResp)), cookieCount: cookieStore.getAll().length } })
          }
          return NextResponse.json({ success: true })
        }
      } catch (e) {
        // fall through to returning the original error payload below
      }

      const cookieStore = await cookies()
      const payload: any = {
        success: false,
        error: String(delErr?.message ?? delErr),
      }
      if (process.env.NODE_ENV === "development") {
        try {
          payload.debug = JSON.parse(JSON.stringify(delResp))
        } catch (e) {
          payload.debug = String(delResp)
        }
        payload.existing = existing
        payload.effectiveUserId = effectiveUserId
        payload.cookieCount = cookieStore.getAll().length
      }
      return NextResponse.json(payload, { status: 500 })
    }

    // Return success with debug info in development to aid troubleshooting
    if (process.env.NODE_ENV === "development") {
      const cookieStore = await cookies()
      return NextResponse.json({ success: true, debug: { delResp, existing, effectiveUserId, cookieCount: cookieStore.getAll().length } })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
