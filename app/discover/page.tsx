import type { Metadata } from "next"
import DiscoverClient from "./DiscoverClient"

export const metadata: Metadata = {
  title: "Discover Artists - Indus Valley Digital",
  description:
    "Explore talented filmmakers, musicians, painters, craftsmen, dancers, and artisans from around the world",
}

export default function DiscoverPage() {
  return <DiscoverClient />
}
