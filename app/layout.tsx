// import type React from "react"
// import type { Metadata } from "next"
// import { DM_Sans, Playfair_Display } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
// import "./globals.css"

// const dmSans = DM_Sans({
//   subsets: ["latin"],
//   variable: "--font-dm-sans",
// })

// const playfairDisplay = Playfair_Display({
//   subsets: ["latin"],
//   variable: "--font-playfair",
// })

// export const metadata: Metadata = {
//   title: "Artistry - The Professional Platform for Artists",
//   description:
//     "Connect, showcase, and grow your artistic career. The professional platform for filmmakers, musicians, painters, craftsmen, dancers, and artisans.",
//   generator: "v0.app",
//   icons: {
//     icon: [
//       {
//         url: "/icon-light-32x32.png",
//         media: "(prefers-color-scheme: light)",
//       },
//       {
//         url: "/icon-dark-32x32.png",
//         media: "(prefers-color-scheme: dark)",
//       },
//       {
//         url: "/icon.svg",
//         type: "image/svg+xml",
//       },
//     ],
//     apple: "/apple-icon.png",
//   },
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${dmSans.variable} ${playfairDisplay.variable} font-sans antialiased`}>
//         {children}
//         <Analytics />
//       </body>
//     </html>
//   )
// }
// app/layout.tsx
import type React from "react"
import { DM_Sans, Playfair_Display } from "next/font/google"
import { AuthProvider } from "../AuthContext/AuthContext"

// relative path
import "./globals.css"

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" })
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfairDisplay.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
