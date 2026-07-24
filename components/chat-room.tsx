"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { ChatMessage } from "./chat-message"

interface Message {
  id: string
  content: string
  created_at: string
  user_id: string
  display_name: string
  reply_to?: string | null
  reply_message?: { content: string; display_name: string } | null
  image_url?: string | null
  audio_url?: string | null
}

interface ChatRoomProps {
  currentUserId: string
  currentUsername: string
  isAdmin: boolean
}

export function ChatRoom({ currentUserId, currentUsername, isAdmin }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const [banModal, setBanModal] = useState<{ userId: string; username: string } | null>(null)
  const [banReason, setBanReason] = useState("")
  const [onlineUsers, setOnlineUsers] = useState<{ user_id: string; username: string }[]>([])
  const [showOnlineList, setShowOnlineList] = useState(false)
  const [uploading, setUploading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  // Load messages
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/messages")
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    }
    load()
  }, [])

  // Realtime subscription + Presence (online users)
  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Filtra il realtime per app_source=app_pionieri cosi' eventi di altre app
    // non triggerano fetch inutili su questa app
    const APP_SOURCE = process.env.NEXT_PUBLIC_APP_SOURCE || "app_pionieri"

    const channel = supabase
      .channel("messages-realtime", { config: { presence: { key: currentUserId } } })
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `app_source=eq.${APP_SOURCE}`,
      }, async () => {
        const res = await fetch("/api/messages")
        if (res.ok) setMessages(await res.json())
      })
      .on("postgres_changes", {
        event: "DELETE",
        schema: "public",
        table: "messages",
        filter: `app_source=eq.${APP_SOURCE}`,
      }, async () => {
        const res = await fetch("/api/messages")
        if (res.ok) setMessages(await res.json())
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState()
        const users: { user_id: string; username: string }[] = []
        Object.values(state).forEach((presences: any) => {
          presences.forEach((p: any) => {
            if (p.username && !users.find(u => u.user_id === p.user_id)) {
              users.push({ user_id: p.user_id, username: p.username })
            }
          })
        })
        setOnlineUsers(users)
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ user_id: currentUserId, username: currentUsername })
        }
      })

    return () => { supabase.removeChannel(channel) }
  }, [currentUserId, currentUsername])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return

    const content = input.trim()
    setInput("")
    const replyRef = replyTo
    setReplyTo(null)

    const optimistic: Message = {
      id: "temp-" + Date.now(),
      content,
      created_at: new Date().toISOString(),
      user_id: currentUserId,
      display_name: currentUsername,
      reply_to: replyRef?.id || null,
      reply_message: replyRef ? { content: replyRef.content, display_name: replyRef.display_name } : null,
    }
    setMessages((prev) => [...prev, optimistic])

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, userId: currentUserId, replyTo: replyRef?.id || null }),
    })
  }

  async function handleDelete(messageId: string) {
    setMessages((prev) => prev.filter((m) => m.id !== messageId))
    await fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, adminUsername: currentUsername }),
    })
  }

  async function handleBan() {
    if (!banModal) return
    await fetch("/api/admin/ban", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: banModal.userId,
        adminUsername: currentUsername,
        reason: banReason || "Violazione regole",
      }),
    })
    setMessages((prev) => prev.filter((m) => m.user_id !== banModal.userId))
    setBanModal(null)
    setBanReason("")
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      alert("Solo immagini sono permesse")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Immagine troppo grande (max 5MB)")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
      if (!uploadRes.ok) {
        alert("Errore upload immagine")
        return
      }
      const { url } = await uploadRes.json()

      const replyRef = replyTo
      setReplyTo(null)

      const optimistic: Message = {
        id: "temp-" + Date.now(),
        content: "",
        created_at: new Date().toISOString(),
        user_id: currentUserId,
        display_name: currentUsername,
        reply_to: replyRef?.id || null,
        reply_message: replyRef ? { content: replyRef.content, display_name: replyRef.display_name } : null,
        image_url: url,
      }
      setMessages((prev) => [...prev, optimistic])

      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "", userId: currentUserId, replyTo: replyRef?.id || null, imageUrl: url }),
      })
    } catch {
      alert("Errore invio immagine")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleAudioUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("audio/")) {
      alert("Solo file audio sono permessi")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File troppo grande (max 10MB)")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
      if (!uploadRes.ok) {
        alert("Errore upload audio")
        return
      }
      const { url } = await uploadRes.json()

      const replyRef = replyTo
      setReplyTo(null)

      const optimistic: Message = {
        id: "temp-" + Date.now(),
        content: "",
        created_at: new Date().toISOString(),
        user_id: currentUserId,
        display_name: currentUsername,
        reply_to: replyRef?.id || null,
        reply_message: replyRef ? { content: replyRef.content, display_name: replyRef.display_name } : null,
        audio_url: url,
      }
      setMessages((prev) => [...prev, optimistic])

      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "", userId: currentUserId, replyTo: replyRef?.id || null, audioUrl: url }),
      })
    } catch {
      alert("Errore invio audio")
    } finally {
      setUploading(false)
      if (audioInputRef.current) audioInputRef.current.value = ""
    }
  }

  function handleLogout() {
    localStorage.removeItem("pi_session")
    window.location.href = "/auth/login"
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div>
          <h1 className="text-lg font-bold text-foreground">App Pionieri</h1>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">{currentUsername}{isAdmin ? " (Admin)" : ""}</p>
            <button
              onClick={() => setShowOnlineList(!showOnlineList)}
              className="flex items-center gap-1 text-xs text-muted-foreground"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              {onlineUsers.length || 1} online
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <a href="/chat/admin" className="rounded-lg border border-border bg-muted px-3 py-2 text-xs text-foreground">
              Accessi
            </a>
          )}
          <a href="/chat/payment" className="rounded-lg bg-[#F7A800] px-3 py-2 text-xs font-bold text-foreground">
            Pi Pay
          </a>
          <button onClick={handleLogout} className="rounded-lg border border-border px-3 py-2 text-xs text-foreground">
            Esci
          </button>
        </div>
      </header>

      {/* Online users panel */}
      {showOnlineList && (
        <div className="border-b border-border bg-card px-4 py-3">
          <p className="mb-2 text-xs font-bold text-foreground">Utenti online:</p>
          <div className="flex flex-wrap gap-2">
            {onlineUsers.map((u) => (
              <span
                key={u.user_id}
                className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-foreground"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                {u.username}
              </span>
            ))}
            {onlineUsers.length === 0 && (
              <span className="text-xs text-muted-foreground">Nessun utente online</span>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground py-10">Nessun messaggio. Inizia la conversazione!</p>
        )}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isOwn={msg.user_id === currentUserId}
            isAdmin={isAdmin}
            onReply={setReplyTo}
            onDelete={handleDelete}
            onBan={(userId, username) => setBanModal({ userId, username })}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center gap-2 border-t border-border bg-card px-4 py-2">
          <div className="flex-1 truncate text-sm text-muted-foreground">
            <span className="font-bold text-red-600">{replyTo.display_name}:</span> {replyTo.content}
          </div>
          <button onClick={() => setReplyTo(null)} className="text-lg text-muted-foreground">X</button>
        </div>
      )}

      {/* Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleAudioUpload}
      />
      <form onSubmit={sendMessage} className="sticky bottom-0 flex items-center gap-2 border-t border-border bg-card p-3">
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-foreground disabled:opacity-50"
        >
          {uploading ? (
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="10" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          )}
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi un messaggio..."
          className="flex-1 rounded-full border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-[#F7A800]"
        />
        {input.trim() ? (
          <button
            type="submit"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7A800] text-foreground"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => audioInputRef.current?.click()}
            disabled={uploading}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7A800] text-foreground disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
        )}
      </form>

      {/* Ban modal */}
      {banModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-card p-6">
            <h3 className="text-lg font-bold text-foreground">Banna {banModal.username}</h3>
            <p className="mt-2 text-sm text-muted-foreground">Inserisci un motivo per il ban:</p>
            <input
              type="text"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Motivo del ban..."
              className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
            <div className="mt-4 flex gap-2">
              <button onClick={() => setBanModal(null)} className="flex-1 rounded-lg border border-border px-4 py-2 text-sm text-foreground">
                Annulla
              </button>
              <button onClick={handleBan} className="flex-1 rounded-lg bg-destructive px-4 py-2 text-sm text-destructive-foreground">
                Banna
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
