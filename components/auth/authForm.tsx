"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

type AuthMode = "login" | "signup"

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter()
  const isSignup = mode === "signup"

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "artist", // default
  })

  const update = (key: string, value: string) =>
    setForm((p) => ({ ...p, [key]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo: `${window.location.origin}/signup/verify-email`,
            data: { name: form.name, role: form.role },
          },
        })
        if (error) throw error

        // store email for verify page
        localStorage.setItem("signupEmail", form.email)

        // redirect to verify-email page
        router.push("/signup/verify-email")
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })
        if (error) throw error

        router.push("/dashboard") // change to your app dashboard
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{error}</div>}

      {/* Signup role selection */}
      {isSignup && (
        <div className="space-y-3">
          <Label>I am joining as</Label>
          <RadioGroup
            value={form.role}
            onValueChange={(v) => update("role", v)}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { id: "artist", label: "Artist", desc: "Create & sell art" },
              { id: "user", label: "Art Lover", desc: "Discover & support" },
            ].map((r) => (
              <Label
                key={r.id}
                htmlFor={r.id}
                className={cn(
                  "cursor-pointer rounded-xl border-2 p-4 transition",
                  form.role === r.id ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                <RadioGroupItem id={r.id} value={r.id} className="sr-only" />
                <div className="font-medium">{r.label}</div>
                <div className="text-xs text-muted-foreground">{r.desc}</div>
              </Label>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Name (signup) */}
      {isSignup && (
        <div className="space-y-2">
          <Label>Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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

      {/* Email */}
      <div className="space-y-2">
        <Label>Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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

      {/* Password */}
      <div className="space-y-2">
        <Label>Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type={showPassword ? "text" : "password"}
            className="pl-10 pr-10"
            placeholder={isSignup ? "Create a strong password" : "Your password"}
            minLength={8}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <Button disabled={loading} className="w-full gradient-primary">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSignup ? "Create account" : "Log in"}
      </Button>
    </form>
  )
}
