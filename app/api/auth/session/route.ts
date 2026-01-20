import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { access_token, refresh_token } = body || {}
    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: 'Missing tokens' }, { status: 400 })
    }

    const supabase = await createSupabaseServerClient()
    // Set server-side session cookies by calling setSession
    await supabase.auth.setSession({ access_token, refresh_token })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: (err as any).message ?? 'server error' }, { status: 500 })
  }
}
