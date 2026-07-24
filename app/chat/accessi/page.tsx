"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AccessLog {
  id: string
  user_id: string
  username: string
  logged_at: string
}

interface AccessData {
  logs: AccessLog[]
  totalAccesses: number
  uniqueUsers: number
}

export default function AccessiPage() {
  const router = useRouter()
  const [data, setData] = useState<AccessData | null>(null)
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0]
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUsername, setAdminUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Check if user is admin — redirect immediato se non autorizzato
    const session = localStorage.getItem("pi_session")
    if (session) {
      try {
        const parsed = JSON.parse(session)
        if (parsed.isAdmin === true) {
          setIsAdmin(true)
          setAdminUsername(parsed.username)
        } else {
          // Non e' admin: redirect a /chat
          router.replace("/chat")
          return
        }
      } catch {
        router.replace("/chat")
        return
      }
    } else {
      // Nessuna sessione: redirect a login
      router.replace("/auth/login")
      return
    }
    setAuthChecked(true)
  }, [router])

  useEffect(() => {
    async function loadLogs() {
      if (!adminUsername) return
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/access-logs?date=${selectedDate}&adminUsername=${encodeURIComponent(adminUsername)}`)
        if (res.ok) {
          const result = await res.json()
          setData(result)
        }
      } catch {
        // Handle error
      } finally {
        setLoading(false)
      }
    }
    loadLogs()
  }, [selectedDate, adminUsername])

  function formatTime(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })
  }

  // Non renderizza nulla finche' l'auth non e' verificata (evita flash di contenuto)
  if (!authChecked || !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <p className="text-center text-muted-foreground">Verifica accesso...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div>
          <h1 className="text-lg font-bold text-foreground">Registro Accessi</h1>
          <p className="text-xs text-muted-foreground">Solo admin</p>
        </div>
        <a href="/chat" className="rounded-lg border border-border px-3 py-2 text-sm text-foreground">
          Indietro
        </a>
      </header>

      <div className="p-4">
        {/* Date selector */}
        <div className="mb-4">
          <label className="mb-1 block text-sm text-muted-foreground">Seleziona data:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-foreground"
          />
        </div>

        {/* Stats */}
        {data && (
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-2xl font-bold text-[#F7A800]">{data.totalAccesses}</p>
              <p className="text-xs text-muted-foreground">Accessi totali</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-2xl font-bold text-[#F7A800]">{data.uniqueUsers}</p>
              <p className="text-xs text-muted-foreground">Utenti unici</p>
            </div>
          </div>
        )}

        {/* Logs list */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-bold text-foreground">Accessi del {formatDate(selectedDate)}</h2>
          </div>
          
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Caricamento...</div>
          ) : data?.logs.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">Nessun accesso registrato</div>
          ) : (
            <div className="divide-y divide-border">
              {data?.logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-bold text-foreground">{log.username}</p>
                    <p className="text-xs text-muted-foreground">
                      Pi UID: {(log.user_id || "").substring(0, 10)}...
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatTime(log.logged_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
