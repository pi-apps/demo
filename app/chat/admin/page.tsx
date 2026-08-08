"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AccessLog {
  id: string
  user_id: string
  username: string
  logged_at: string
}

interface LogsData {
  logs: AccessLog[]
  totalAccesses: number
  uniqueUsers: number
  date: string
}

export default function AdminPage() {
  const router = useRouter()
  const [logsData, setLogsData] = useState<LogsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0])
  const [username, setUsername] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem("pi_session")
    if (!session) {
      router.push("/auth/login")
      return
    }
    const parsed = JSON.parse(session)
    if (parsed.username !== "cipollas") {
      router.push("/chat")
      return
    }
    setUsername(parsed.username)
    setIsAdmin(true)
  }, [router])

  useEffect(() => {
    if (!isAdmin || !username) return

    async function loadLogs() {
      setLoading(true)
      const res = await fetch(`/api/admin/access-logs?adminUsername=${username}&date=${selectedDate}`)
      if (res.ok) {
        const data = await res.json()
        setLogsData(data)
      }
      setLoading(false)
    }
    loadLogs()
  }, [isAdmin, username, selectedDate])

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Verifica accesso...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div>
          <h1 className="text-lg font-bold text-foreground">Registro Accessi</h1>
          <p className="text-xs text-muted-foreground">Solo admin</p>
        </div>
        <button
          onClick={() => router.push("/chat")}
          className="rounded-lg border border-border px-3 py-2 text-xs text-foreground"
        >
          Indietro
        </button>
      </header>

      <div className="p-4">
        {/* Date picker */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">Seleziona data:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground"
          />
        </div>

        {/* Stats */}
        {logsData && (
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-card border border-border p-4">
              <p className="text-2xl font-bold text-[#F7A800]">{logsData.totalAccesses}</p>
              <p className="text-xs text-muted-foreground">Accessi totali</p>
            </div>
            <div className="rounded-xl bg-card border border-border p-4">
              <p className="text-2xl font-bold text-[#F7A800]">{logsData.uniqueUsers}</p>
              <p className="text-xs text-muted-foreground">Utenti unici</p>
            </div>
          </div>
        )}

        {/* Logs list */}
        <div className="rounded-xl bg-card border border-border">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-bold text-foreground">Accessi del {selectedDate}</h2>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">Caricamento...</div>
            ) : logsData?.logs.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">Nessun accesso in questa data</div>
            ) : (
              <ul className="divide-y divide-border">
                {logsData?.logs.map((log) => (
                  <li key={log.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{log.username}</p>
                      <p className="text-xs text-muted-foreground">ID: {log.user_id.slice(0, 8)}...</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.logged_at).toLocaleTimeString("it-IT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
