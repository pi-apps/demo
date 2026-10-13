"use client"

import { useEffect, useState } from "react"

export default function Home() {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem("pi_session")
    if (session) {
      window.location.href = "/chat"
      return
    }
    window.location.href = "/auth/login"
    const t = setTimeout(() => setShowButton(true), 2000)
    return () => clearTimeout(t)
  }, [])

  if (showButton) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <a
          href="/auth/login"
          className="rounded-xl bg-[#F7A800] px-8 py-4 text-lg font-bold text-foreground"
        >
          Accedi alla Chat Pionieri
        </a>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F7A800] border-t-transparent" />
    </div>
  )
}
