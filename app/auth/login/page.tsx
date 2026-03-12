"use client"

import { useEffect, useState } from "react"

function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const session = localStorage.getItem("pi_session")
    if (session) window.location.href = "/chat"
  }, [])

  async function handlePiLogin() {
    const Pi = (window as unknown as Record<string, unknown>).Pi as {
      init: (config: { version: string; sandbox: boolean }) => void
      authenticate: (scopes: string[], onIncomplete: () => void) => Promise<{ accessToken: string; user: { uid: string } }>
    } | undefined

    if (!Pi) {
      setError("Pi SDK non disponibile. Apri nel Pi Browser.")
      return
    }

    setLoading(true)
    setError("")
    setStatus("Connessione a Pi Network...")

    try {
      Pi.init({ version: "2.0", sandbox: false })
      const auth = await Pi.authenticate(["username", "payments"], () => {})
      setStatus("Verifica credenziali...")

      const res = await fetch("/api/pi/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: auth.accessToken, user: auth.user }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Errore di autenticazione")
        setLoading(false)
        return
      }

      setStatus("Accesso riuscito! Reindirizzamento...")
      localStorage.setItem("pi_session", JSON.stringify({
        userId: data.userId,
        username: data.username,
        piUid: data.piUid,
        isAdmin: data.isAdmin,
      }))

      await new Promise((r) => setTimeout(r, 300))
      window.location.href = "/chat"
    } catch {
      setError("Errore durante il login. Riprova.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#F7A800]">
        <span className="text-4xl font-bold text-card">Pi</span>
      </div>

      <h1 className="mt-6 text-2xl font-bold text-foreground">Chat Pionieri</h1>
      <p className="mt-2 text-center text-muted-foreground">
        Chat esclusiva per Pionieri verificati con KYC approvato e prima migrazione completata
      </p>

      <button
        onClick={handlePiLogin}
        disabled={loading}
        className="mt-8 flex w-full max-w-sm items-center justify-center gap-3 rounded-xl bg-[#F7A800] px-6 py-4 text-lg font-bold text-foreground disabled:opacity-50"
      >
        {loading ? status : "Accedi con Pi Network"}
      </button>

      {error && <p className="mt-3 text-center text-sm text-destructive">{error}</p>}

      <div className="mt-6 w-full max-w-sm rounded-xl border border-border bg-card p-4">
        <p className="font-semibold text-foreground">Requisiti di accesso:</p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="text-[#F7A800]">&#10003;</span> KYC approvato su Pi Network
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[#F7A800]">&#10003;</span> Prima migrazione al Mainnet completata
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[#F7A800]">&#10003;</span> Accesso tramite Pi Browser
          </li>
        </ul>
      </div>

      <div className="mt-6 flex gap-4 text-xs text-muted-foreground">
        <a href="/privacy" className="underline">Privacy Policy</a>
        <a href="/terms" className="underline">Terms of Service</a>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <LoginForm />
}
