import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { Instagram, Twitter, Youtube, Linkedin } from "lucide-react"

export function Footer() {
  const footerLinks = {
    platform: [
      { href: "/discover", label: "Discover Artists" },
      { href: "/events", label: "Events" },
      { href: "/workshops", label: "Workshops" },
      { href: "/live", label: "Live" },
    ],
    artists: [
      { href: "/signup?role=artist", label: "Join as Artist" },
      { href: "/artist-resources", label: "Resources" },
      { href: "/pricing", label: "Pricing" },
      { href: "/success-stories", label: "Success Stories" },
    ],
    company: [
      { href: "/about", label: "About Us" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
      { href: "/press", label: "Press" },
    ],
    legal: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/cookies", label: "Cookie Policy" },
    ],
  }

  const socialLinks = [
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "#", icon: Twitter, label: "Twitter" },
    { href: "#", icon: Youtube, label: "YouTube" },
    { href: "#", icon: Linkedin, label: "LinkedIn" },
  ]

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Logo className="mb-4" />
            <p className="text-sm text-muted-foreground mb-4">The professional platform for artists worldwide.</p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">For Artists</h3>
            <ul className="space-y-2">
              {footerLinks.artists.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Indus Valley Digital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
