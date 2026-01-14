"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Bell, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface HeaderProps {
  variant?: "default" | "transparent"
  showAuth?: boolean
}

export function Header({
  variant = "default",
  showAuth = true,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)

  const navLinks = [
    { href: "/discover", label: "Discover" },
    { href: "/events", label: "Events" },
    { href: "/workshops", label: "Workshops" },
    { href: "/live", label: "Live" },
  ]

  /* ================= AUTH STATE ================= */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  /* ================= LOGOUT HANDLER ================= */
  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?")
    if (!confirmed) return
    await supabase.auth.signOut()
  }

  /* ================= UI ================= */
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors",
        variant === "default"
          ? "bg-card/95 backdrop-blur-sm border-b border-border"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* LOGGED IN */}
            {user ? (
              <>
                {/* Notifications */}
                <Link href="/notifications">
                  <Button variant="ghost" size="icon" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                  </Button>
                </Link>

                {/* Profile */}
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Profile"
                    className="rounded-full"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>

                {/* Logout */}
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Logout"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              /* LOGGED OUT */
              showAuth && (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="gradient-primary text-primary-foreground">
                      Join Now
                    </Button>
                  </Link>
                </div>
              )
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {!user && showAuth && (
                <div className="flex flex-col gap-2 mt-4 px-4">
                  <Link href="/login">
                    <Button variant="outline" className="w-full bg-transparent">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full gradient-primary text-primary-foreground">
                      Join Now
                    </Button>
                  </Link>
                </div>
              )}

              {user && (
                <div className="flex flex-col gap-2 mt-4 px-4">
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full bg-transparent">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
