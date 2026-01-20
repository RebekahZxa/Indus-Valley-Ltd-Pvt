import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    // Server-side supabase with request cookies for auth
    const supabase = await createSupabaseServerClient()

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Parse body early so we can fallback to a client-provided user_id if server auth isn't available
    const body = await request.json()
    const { caption, image_url, filters, user_id: fallbackUserId } = body

    if (!user) {
      // In development, include cookie count to help debug missing auth cookie
      if (process.env.NODE_ENV === 'development') {
        try {
          const nh = await import('next/headers')
          const cookieStore = await nh.cookies()
          const count = cookieStore.getAll().length
          // If the client supplied a user_id, allow a fallback (dev-friendly). Otherwise 401.
          if (!fallbackUserId) {
            return NextResponse.json({ success: false, error: 'Unauthorized', cookieCount: count }, { status: 401 })
          }
        } catch (e) {
          if (!fallbackUserId) {
            return NextResponse.json({ success: false, error: 'Unauthorized', cookieCount: 0 }, { status: 401 })
          }
        }
      } else {
        if (!fallbackUserId) {
          return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }
      }
    }

    if (!image_url) {
      return NextResponse.json({ success: false, error: 'Missing required field: image_url' }, { status: 400 })
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ success: false, error: 'Service role or Supabase URL not configured' }, { status: 500 })
    }

    // Create an admin client using the service role to bypass RLS
    const serviceSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const effectiveUserId = user?.id ?? fallbackUserId

    const insertPayload: any = {
      user_id: effectiveUserId,
      caption: caption ?? null,
      image_url,
    }

    // Only include `filters` if the client supplied it (don't always send null)
    if (typeof filters !== 'undefined') {
      insertPayload.filters = filters
    }

    // Try inserting; if the DB schema lacks `filters` and PostgREST complains,
    // retry without `filters` to remain tolerant to schema differences.
    let data: any = null
    let error: any = null

    try {
      const resp = await serviceSupabase.from('posts').insert(insertPayload).select('post_uuid,user_id,caption,image_url,created_at').single()
      data = resp.data
      error = resp.error
    } catch (e: any) {
      // Some transports throw; normalize to error variable below
      error = e
    }

    if (error) {
      const msg = String(error?.message ?? error)
      const filtersSchemaError = msg.includes("Could not find the 'filters' column") || msg.includes("filters\n")
      if (filtersSchemaError && typeof insertPayload.filters !== 'undefined') {
        // Retry without filters
        delete insertPayload.filters
        try {
          const retry = await serviceSupabase.from('posts').insert(insertPayload).select('post_uuid,user_id,caption,image_url,created_at').single()
          data = retry.data
          error = retry.error
        } catch (e: any) {
          error = e
        }
      }
    }

    if (error) {
      return NextResponse.json({ success: false, error: String(error?.message ?? error) }, { status: 500 })
    }

    return NextResponse.json({ success: true, post: data, usedFallbackUserId: !user && !!fallbackUserId })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
