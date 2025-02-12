import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MouseEvent } from "react"

interface HeroProps {
  scrollToTeams: (e: MouseEvent<HTMLAnchorElement>) => void
}

export default function Hero({ scrollToTeams }: HeroProps) {
  return (
    <section className="min-h-screen pt-16 flex flex-col items-center justify-center text-center">
      <div className="space-y-2 mb-8">
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tighter">
          <div className="text-black">Code.</div>
          <div className="text-black">Compete.</div>
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
            Win.
          </div>
        </h1>
      </div>
      <p className="max-w-[600px] text-gray-600 mb-8">
        Join the ultimate coding challenge. Build innovative solutions, showcase your skills, and compete with the best
        developers.
      </p>
      <div className="flex gap-4">
        <Button size="lg" asChild>
          <Link href="/signup">Join Competition</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="#teams" onClick={scrollToTeams}>View Teams</Link>
        </Button>
      </div>
    </section>
  )
}

