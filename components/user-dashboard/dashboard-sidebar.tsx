"use client";
// User Dashboard Sidebar (copied from dashboard-sidebar, user links only)
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  GraduationCap,
  Ticket,
  Bell,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export function UserDashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const userLinks = [
    { href: "/dashboard/user", label: "Overview", icon: Home },
    { href: "/dashboard/user/following", label: "Following", icon: Users },
    { href: "/dashboard/user/workshops", label: "My Workshops", icon: GraduationCap },
    { href: "/dashboard/user/tickets", label: "My Tickets", icon: Ticket },
    { href: "/dashboard/user/notifications", label: "Notifications", icon: Bell },
    { href: "/dashboard/user/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-20 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      {isOpen && <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border transition-transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border lg:hidden">
            <Logo />
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {userLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "gradient-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
