"use client"

import { useEffect, useState } from "react"
import { ChatRoom } from "@/components/chat-room"

interface Session {
  userId: string
  username: string
  piUid: string
  isAdmin: boolean
}

export default function ChatPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem("pi_session")
    if (!raw) {
      window.location.href = "/auth/login"
      return
    }
    try {
      setSession(JSON.parse(raw))
    } catch {
      localStorage.removeItem("pi_session")
      window.location.href = "/auth/login"
    }
    setLoading(false)
  }, [])

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F7A800] border-t-transparent" />
      </div>
    )
  }

  return <ChatRoom currentUserId={session.userId} currentUsername={session.username} isAdmin={session.isAdmin} />
}
