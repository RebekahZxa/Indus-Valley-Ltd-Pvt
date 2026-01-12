// "use client"

// import { useState } from "react"
// import { supabase } from "@/lib/supabase/client"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { cn } from "@/lib/utils"

// type AuthMode = "login" | "signup"

// export function AuthForm({ mode }: { mode: AuthMode }) {
//   const isSignup = mode === "signup"

//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "user",
//   })

//   function update(key: string, value: string) {
//     setForm((prev) => ({ ...prev, [key]: value }))
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)

//     try {
//       // ---------- SIGNUP ----------
//       if (isSignup) {
//         const { error } = await supabase.auth.signUp({
//           email: form.email,
//           password: form.password,
//           options: {
//             data: {
//               name: form.name,
//               role: form.role,
//             },
//           },
//         })

//         if (error) throw error

//         // Go to login after signup
//         window.location.assign("/login")
//         return
//       }

//       // ---------- LOGIN ----------
//       const { error } = await supabase.auth.signInWithPassword({
//         email: form.email,
//         password: form.password,
//       })

//       if (error) throw error

//       /**
//        * CRITICAL:
//        * Must go through server route so cookies are written
//        */
//       window.location.assign("/dashboard")


//     } catch (err: any) {
//       setError(err?.message ?? "Authentication failed")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {error && (
//         <div className="rounded bg-red-50 p-3 text-sm text-red-600">
//           {error}
//         </div>
//       )}

//       {isSignup && (
//         <div className="space-y-3">
//           <Label>I am joining as</Label>
//           <RadioGroup
//             value={form.role}
//             onValueChange={(v) => update("role", v)}
//             className="grid grid-cols-2 gap-4"
//           >
//             {[
//               { id: "artist", label: "Artist" },
//               { id: "user", label: "Art Lover" },
//             ].map((r) => (
//               <Label
//                 key={r.id}
//                 htmlFor={r.id}
//                 className={cn(
//                   "cursor-pointer rounded-xl border p-4 transition",
//                   form.role === r.id && "border-primary bg-primary/5"
//                 )}
//               >
//                 <RadioGroupItem
//                   id={r.id}
//                   value={r.id}
//                   className="sr-only"
//                 />
//                 {r.label}
//               </Label>
//             ))}
//           </RadioGroup>
//         </div>
//       )}

//       {isSignup && (
//         <div>
//           <Label>Full Name</Label>
//           <div className="relative">
//             <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//             <Input
//               className="pl-10"
//               value={form.name}
//               onChange={(e) => update("name", e.target.value)}
//               required
//             />
//           </div>
//         </div>
//       )}

//       <div>
//         <Label>Email</Label>
//         <div className="relative">
//           <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//           <Input
//             type="email"
//             className="pl-10"
//             value={form.email}
//             onChange={(e) => update("email", e.target.value)}
//             required
//           />
//         </div>
//       </div>

//       <div>
//         <Label>Password</Label>
//         <div className="relative">
//           <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//           <Input
//             type={showPassword ? "text" : "password"}
//             className="pl-10 pr-10"
//             value={form.password}
//             onChange={(e) => update("password", e.target.value)}
//             required
//           />
//           <button
//             type="button"
//             className="absolute right-3 top-3"
//             onClick={() => setShowPassword((s) => !s)}
//           >
//             {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//           </button>
//         </div>
//       </div>

//       <Button className="w-full" disabled={loading}>
//         {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//         {isSignup ? "Create account" : "Log in"}
//       </Button>
//     </form>
//   )
// }


"use client"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

type AuthMode = "login" | "signup"

export function AuthForm({ mode }: { mode: AuthMode }) {
  const isSignup = mode === "signup"

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    rememberMe: false,
  })

  function update(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      /* ---------------- SIGNUP ---------------- */
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              name: form.name,
              role: form.role,
            },
          },
        })

        if (error) throw error

        window.location.assign("/login")
        return
      }

      /* ---------------- LOGIN ---------------- */
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })

      if (error) throw error

      // IMPORTANT: hard navigation so cookies flush
      window.location.assign("/dashboard")

    } catch (err: any) {
      setError(err?.message ?? "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ERROR */}
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* ROLE SELECTION (SIGNUP ONLY) */}
        {isSignup && (
          <div className="space-y-3">
            <Label>I want to join as</Label>

            <RadioGroup
              value={form.role}
              onValueChange={(v) => update("role", v)}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { id: "artist", label: "Artist", desc: "Showcase & monetize" },
                { id: "user", label: "Art Lover", desc: "Discover & support" },
              ].map((r) => (
                <Label
                  key={r.id}
                  htmlFor={r.id}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl border-2 p-4 cursor-pointer transition-all",
                    form.role === r.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 bg-card"
                  )}
                >
                  <RadioGroupItem id={r.id} value={r.id} className="sr-only" />
                  <span className="font-medium">{r.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {r.desc}
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* NAME (SIGNUP) */}
        {isSignup && (
          <div className="space-y-2">
            <Label>Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* EMAIL */}
        <div className="space-y-2">
          <Label>Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              className="pl-10"
              placeholder="artist@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Password</Label>
            {!isSignup && (
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/80"
              >
                Forgot password?
              </Link>
            )}
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              className="pl-10 pr-10"
              placeholder={isSignup ? "Create a strong password" : "Enter your password"}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
              minLength={isSignup ? 8 : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {isSignup && (
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters
            </p>
          )}
        </div>

        {/* REMEMBER ME (LOGIN) */}
        {!isSignup && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={form.rememberMe}
              onCheckedChange={(v) => update("rememberMe", v)}
            />
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me for 30 days
            </Label>
          </div>
        )}
      </div>

      {/* SUBMIT */}
      <Button
        type="submit"
        className="w-full gradient-primary text-primary-foreground"
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSignup ? "Create account" : "Log in"}
      </Button>

      {/* LEGAL */}
      <p className="text-xs text-center text-muted-foreground">
        By {isSignup ? "signing up" : "logging in"}, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms
        </Link>{" "}
        &{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
      </p>
    </form>
  )
}
