"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Importiamo le costanti centrali per evitare disallineamenti con le altre app
const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "cipollas"
const APP_SOURCE = process.env.NEXT_PUBLIC_APP_SOURCE || "app_pionieri"

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
  app: string
}

interface BannedUser {
  id: string
  pi_uid: string
  username: string
  reason: string
  banned_at: string
}

type Tab = "accessi" | "bannati"

export default function AdminPage() {
  const router = useRouter()
  const [logsData, setLogsData] = useState<LogsData | null>(null)
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0])
  const [username, setUsername] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("accessi")
  const [unbanning, setUnbanning] = useState<string | null>(null)

  useEffect(() => {
    const session = localStorage.getItem("pi_session")
    if (!session) {
      router.push("/auth/login")
      return
    }
    const parsed = JSON.parse(session)
    if (parsed.username !== ADMIN_USERNAME) {
      router.push("/chat")
      return
    }
    setUsername(parsed.username)
    setIsAdmin(true)
  }, [router])

  useEffect(() => {
    if (!isAdmin || !username) return
    loadLogs()
  }, [isAdmin, username, selectedDate])

  useEffect(() => {
    if (!isAdmin || !username || activeTab !== "bannati") return
    loadBanned()
  }, [isAdmin, username, activeTab])

  async function loadLogs() {
    setLoading(true)
    setLoadError(null)
    try {
      const res = await fetch(`/api/admin/access-logs?adminUsername=${username}&date=${selectedDate}`)
      const data = await res.json()
      if (res.ok) {
        setLogsData(data)
      } else {
        setLoadError(data.error || "Errore caricamento accessi")
      }
    } catch {
      setLoadError("Errore di rete — riprova")
    }
    setLoading(false)
  }

  async function loadBanned() {
    setLoading(true)
    const res = await fetch(`/api/admin/banned?adminUsername=${username}`)
    if (res.ok) {
      const data = await res.json()
      setBannedUsers(data.bannedUsers || [])
    }
    setLoading(false)
  }

  async function handleUnban(piUid: string) {
    setUnbanning(piUid)
    const res = await fetch("/api/admin/ban", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ piUid, adminUsername: username }),
    })
    if (res.ok) {
      setBannedUsers((prev) => prev.filter((u) => u.pi_uid !== piUid))
    }
    setUnbanning(null)
  }

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
          <h1 className="text-lg font-bold text-foreground">Admin - App Pionieri</h1>
          <p className="text-xs text-muted-foreground">{APP_SOURCE} &middot; {username}</p>
        </div>
        <button
          onClick={() => router.push("/chat")}
          className="rounded-lg border border-border px-3 py-2 text-xs text-foreground"
        >
          Indietro
        </button>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card">
        <button
          onClick={() => setActiveTab("accessi")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "accessi"
              ? "border-b-2 border-[#F7A800] text-[#F7A800]"
              : "text-muted-foreground"
          }`}
        >
          Accessi
        </button>
        <button
          onClick={() => setActiveTab("bannati")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "bannati"
              ? "border-b-2 border-[#F7A800] text-[#F7A800]"
              : "text-muted-foreground"
          }`}
        >
          Bannati
        </button>
      </div>

      <div className="p-4">
        {/* TAB ACCESSI */}
        {activeTab === "accessi" && (
          <>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-foreground">Seleziona data:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground"
              />
            </div>

            {logsData && (
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-2xl font-bold text-[#F7A800]">{logsData.totalAccesses}</p>
                  <p className="text-xs text-muted-foreground">Accessi totali</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-2xl font-bold text-[#F7A800]">{logsData.uniqueUsers}</p>
                  <p className="text-xs text-muted-foreground">Utenti unici</p>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-4 py-3">
                <h2 className="font-bold text-foreground">Accessi del {selectedDate}</h2>
              </div>
              <div className="max-h-[55vh] overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-muted-foreground">Caricamento...</div>
                ) : loadError ? (
                  <div className="p-4 text-center text-red-500 text-sm">{loadError}</div>
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
          </>
        )}

        {/* TAB BANNATI */}
        {activeTab === "bannati" && (
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="font-bold text-foreground">Utenti bannati ({bannedUsers.length})</h2>
              <p className="text-xs text-muted-foreground">Solo ban per {APP_SOURCE}</p>
            </div>
            <div className="max-h-[65vh] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">Caricamento...</div>
              ) : bannedUsers.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">Nessun utente bannato</div>
              ) : (
                <ul className="divide-y divide-border">
                  {bannedUsers.map((user) => (
                    <li key={user.id} className="flex items-start justify-between px-4 py-3">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{user.username}</p>
                        <p className="text-xs text-muted-foreground">PI: {user.pi_uid.slice(0, 12)}...</p>
                        <p className="text-xs text-red-500">{user.reason}</p>
                      </div>
                      <button
                        onClick={() => handleUnban(user.pi_uid)}
                        disabled={unbanning === user.pi_uid}
                        className="ml-2 min-h-[44px] rounded-lg bg-[#F7A800] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        {unbanning === user.pi_uid ? "..." : "Unban"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
