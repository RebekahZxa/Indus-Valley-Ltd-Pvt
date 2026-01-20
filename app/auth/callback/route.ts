// import { NextResponse } from "next/server"
// import { createServerClient } from "@supabase/ssr"
// import { cookies } from "next/headers"

// export async function GET(request: Request) {
//   const cookieStore = await cookies()

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll: () => cookieStore.getAll(),
//         setAll: (cookiesToSet) => {
//           cookiesToSet.forEach(({ name, value, options }) => {
//             cookieStore.set(name, value, {
//               ...options,
//               secure: false,        // 🔴 REQUIRED FOR localhost
//               sameSite: "lax",
//               path: "/",
//             })
//           })
//         },
//       },
//     }
//   )

//   // Force session write
//   await supabase.auth.getSession()

//   return NextResponse.redirect(new URL("/dashboard", request.url))
// }
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  let role: string | null = null
  if (code) {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.exchangeCodeForSession(code)
    // Fetch user and role
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()
      role = profile?.role || null
    }
  }

  let redirectPath = "/login"
  if (role === "artist") {
    redirectPath = "/dashboard/artist"
  } else if (role === "user") {
    redirectPath = "/dashboard/user"
  }

  return NextResponse.redirect(new URL(redirectPath, request.url))
}
