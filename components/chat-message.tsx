"use client"

import { useState } from "react"

interface Message {
  id: string
  content: string
  created_at: string
  user_id: string
  display_name: string
  reply_to?: string | null
  reply_message?: { content: string; display_name: string } | null
  media_url?: string | null
  media_type?: "image" | "video" | null
  image_url?: string | null
  audio_url?: string | null
}

interface ChatMessageProps {
  message: Message
  isOwn: boolean
  isAdmin: boolean
  onReply: (msg: Message) => void
  onDelete: (id: string) => void
  onBan: (userId: string, username: string) => void
}

export function ChatMessage({ message, isOwn, isAdmin, onReply, onDelete, onBan }: ChatMessageProps) {
  const [showMenu, setShowMenu] = useState(false)

  const date = new Date(message.created_at)
  const timeStr = date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }) + " " + date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })

  return (
    <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} relative`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isOwn ? "bg-[#F7A800] text-foreground" : "bg-card text-foreground border border-border"
        }`}
        onClick={() => { if (!isOwn) setShowMenu(!showMenu) }}
      >
        {!isOwn && (
          <p className="text-xs font-bold text-red-600">{message.display_name}</p>
        )}

        {message.reply_message && (
          <div className={`mb-1 rounded-lg px-2 py-1 text-xs border-l-2 border-[#F7A800] ${
            isOwn ? "bg-[#e09600] text-foreground" : "bg-muted text-muted-foreground"
          }`}>
            <span className="font-bold">{message.reply_message.display_name}:</span>{" "}
            {message.reply_message.content.length > 50
              ? message.reply_message.content.slice(0, 50) + "..."
              : message.reply_message.content}
          </div>
        )}

        {/* Media content */}
        {message.media_url && message.media_type === "image" && (
          <img 
            src={message.media_url} 
            alt="Immagine condivisa"
            className="mt-1 max-w-full rounded-lg"
            style={{ maxHeight: "300px" }}
          />
        )}
        {message.media_url && message.media_type === "video" && (
          <video 
            src={message.media_url} 
            controls
            className="mt-1 max-w-full rounded-lg"
            style={{ maxHeight: "300px" }}
          />
        )}

        {/* Text content */}
        {message.content && (
          <p className="text-sm break-words text-foreground">{message.content}</p>
        )}
        {message.image_url && (
          <img
            src={message.image_url}
            alt="Immagine condivisa"
            className="mt-1 max-w-full rounded-lg"
            style={{ maxHeight: 300 }}
          />
        )}
        {message.audio_url && (
          <audio controls className="mt-1 w-full max-w-[250px]" preload="metadata">
            <source src={message.audio_url} type="audio/webm" />
            <source src={message.audio_url} type="audio/mp4" />
            Il tuo browser non supporta l'audio.
          </audio>
        )}
        <p className={`mt-1 text-[10px] ${isOwn ? "text-foreground/70" : "text-muted-foreground"}`}>
          {timeStr}
        </p>
      </div>

      {showMenu && !isOwn && (
        <div className="absolute top-full z-10 mt-1 rounded-lg border border-border bg-card shadow-lg">
          <button
            onClick={() => { onReply(message); setShowMenu(false) }}
            className="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted"
          >
            Rispondi
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => { onDelete(message.id); setShowMenu(false) }}
                className="block w-full px-4 py-2 text-left text-sm text-destructive hover:bg-muted"
              >
                Elimina messaggio
              </button>
              <button
                onClick={() => { onBan(message.user_id, message.display_name); setShowMenu(false) }}
                className="block w-full px-4 py-2 text-left text-sm text-destructive hover:bg-muted"
              >
                Banna utente
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
