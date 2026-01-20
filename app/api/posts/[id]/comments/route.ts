import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const body = await request.json().catch(() => ({}))
    const fallbackUserId = body.user_id
    const commentBody = body.body

    if (!user && !fallbackUserId) {
      if (process.env.NODE_ENV === "development") {
        try {
          const nh = await import("next/headers")
          const cookieStore = await nh.cookies()
          const count = cookieStore.getAll().length
          return NextResponse.json({ success: false, error: "Unauthorized", cookieCount: count }, { status: 401 })
        } catch (e) {
          return NextResponse.json({ success: false, error: "Unauthorized", cookieCount: 0 }, { status: 401 })
        }
      }
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    if (!commentBody || typeof commentBody !== "string") {
      return NextResponse.json({ success: false, error: "Missing comment body" }, { status: 400 })
    }

    const effectiveUserId = user?.id ?? fallbackUserId
    let postUuidRaw = params.id

    // If params.id is missing (edge case), try to extract from the request URL as a fallback
    if (!postUuidRaw) {
      try {
        const url = new URL(request.url)
        const m = url.pathname.match(/\/api\/posts\/([^\/]+)\//)
        if (m && m[1]) postUuidRaw = m[1]
      } catch (e) {
        // ignore
      }
    }

    if (!postUuidRaw) {
      console.error('Comments route missing params.id', { params, url: request.url })
      return NextResponse.json({ success: false, error: 'Missing post uuid in route params' }, { status: 400 })
    }

    const post_uuid = postUuidRaw
    console.log('Comments route params:', { postUuidRaw, post_uuid, effectiveUserId })

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ success: false, error: 'Service role or Supabase URL not configured' }, { status: 500 })
    }

    const serviceSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data: inserted, error: insErr } = await serviceSupabase
      .from("post_comments")
      .insert({ post_uuid, user_id: effectiveUserId, body: commentBody })
      .select()
      .single()

    if (insErr) {
      console.error('post_comments insert error', insErr)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: insErr.message,
            details: (insErr as any).details ?? null,
            hint: (insErr as any).hint ?? null,
            code: (insErr as any).code ?? null,
          },
        },
        { status: 500 }
      )
    }

    // compute updated comments count
    const { data: commentRowsAfter, count: commentCountAfter } = await serviceSupabase
      .from('post_comments')
      .select('id', { count: 'exact' })
      .eq('post_uuid', post_uuid)

    return NextResponse.json({ success: true, comment: inserted, comments_count: commentCountAfter ?? 0 })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
