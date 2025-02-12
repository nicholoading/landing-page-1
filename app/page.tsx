"use client"

import { useEffect, MouseEvent } from "react"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Teams from "@/components/Teams"

export default function Home() {
  const scrollToTeams = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const teamsSection = document.getElementById("teams")
    if (teamsSection) {
      const yOffset = -80 // Adjust this value based on your header height
      const y = teamsSection.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  useEffect(() => {
    const hash = window.location.hash
    if (hash === "#teams") {
      setTimeout(() => {
        const teamsSection = document.getElementById("teams")
        if (teamsSection) {
          const yOffset = -80
          const y = teamsSection.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: "smooth" })
        }
      }, 100)
    }
  }, [])

  return (
    <>
      <Header />
      <main>
        <Hero scrollToTeams={scrollToTeams} />
        <Teams />
      </main>
    </>
  )
}

