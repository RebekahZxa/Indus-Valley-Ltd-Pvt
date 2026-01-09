"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Search, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

interface HeaderProps {
  variant?: "default" | "transparent"
  showAuth?: boolean
  showSearch?: boolean
  isLoggedIn?: boolean
}

export function Header({ variant = "default", showAuth = true, showSearch = false, isLoggedIn = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: "/discover", label: "Discover" },
    { href: "/events", label: "Events" },
    { href: "/workshops", label: "Workshops" },
    { href: "/live", label: "Live" },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors",
        variant === "default" ? "bg-card/95 backdrop-blur-sm border-b border-border" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
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

          <div className="flex items-center gap-3">
            {showSearch && (
              <Button variant="ghost" size="icon" className="hidden sm:flex" aria-label="Search">
                <Search className="h-5 w-5" />
              </Button>
            )}

            {isLoggedIn ? (
              <>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                </Button>
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon" aria-label="Profile" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              </>
            ) : (
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
              {!isLoggedIn && showAuth && (
                <div className="flex flex-col gap-2 mt-4 px-4">
                  <Link href="/login">
                    <Button variant="outline" className="w-full bg-transparent">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full gradient-primary text-primary-foreground">Join Now</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
