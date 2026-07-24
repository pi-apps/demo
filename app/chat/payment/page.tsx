"use client"

import { useState, useEffect, useRef } from "react"

type PiSDK = {
  init: (config: { version: string; sandbox: boolean }) => void
  authenticate: (scopes: string[], onIncomplete: () => void) => Promise<{ user?: { uid?: string; username?: string } }>
  createPayment: (data: Record<string, unknown>, callbacks: Record<string, unknown>) => void
}

const QUICK_AMOUNTS = [0.1, 0.5, 1, 5, 10]

export default function PaymentPage() {
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [amount, setAmount] = useState("")
  const [sdkReady, setSdkReady] = useState(false)
  const piRef = useRef<PiSDK | null>(null)

  useEffect(() => {
    // Initialize Pi SDK on mount
    function initPiSDK() {
      const Pi = (window as unknown as Record<string, unknown>).Pi as PiSDK | undefined
      if (Pi) {
        try {
          Pi.init({ version: "2.0", sandbox: false })
          piRef.current = Pi
          setSdkReady(true)
        } catch {
          // SDK might already be initialized, that's ok
          piRef.current = Pi
          setSdkReady(true)
        }
      } else {
        // SDK not loaded yet, retry in 500ms
        setTimeout(initPiSDK, 500)
      }
    }
    initPiSDK()
  }, [])

  function selectQuickAmount(value: number) {
    setAmount(value.toString())
  }

  async function handlePayment() {
    const parsedAmount = parseFloat(amount)
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg("Inserisci un importo valido maggiore di 0")
      setStatus("error")
      return
    }

    const Pi = piRef.current

    if (!Pi) {
      setErrorMsg("Pi SDK non disponibile. Apri nel Pi Browser.")
      setStatus("error")
      return
    }

    setStatus("processing")
    setErrorMsg("")

    try {
      const authResult = await Pi.authenticate(["payments", "username"], () => {})
      const piUid = authResult?.user?.uid || "unknown"
      const username = authResult?.user?.username || "Anonimo"
      const memo = `Donazione ${parsedAmount} Pi - App Pionieri`

      Pi.createPayment(
        { amount: parsedAmount, memo, metadata: { purpose: "donation" } },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            const res = await fetch("/api/pi/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, piUid, username, amount: parsedAmount, memo }),
            })
            if (!res.ok) {
              const data = await res.json().catch(() => ({}))
              console.error("Approve error:", data)
              setErrorMsg(data.error || "Errore approvazione pagamento")
              setStatus("error")
            }
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            const res = await fetch("/api/pi/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid }),
            })
            if (!res.ok) {
              const data = await res.json().catch(() => ({}))
              console.error("Complete error:", data)
              setErrorMsg(data.error || "Errore completamento pagamento")
              setStatus("error")
              return
            }
            setStatus("success")
          },
          onCancel: () => setStatus("idle"),
          onError: (err: Error) => {
            setErrorMsg(err?.message || "Errore durante il pagamento")
            setStatus("error")
          },
        }
      )
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Errore sconosciuto")
      setStatus("error")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <a href="/chat" className="rounded-lg border border-border px-3 py-1 text-sm text-foreground">Indietro</a>
        <h1 className="text-lg font-bold text-foreground">Donazione Pi</h1>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F7A800]">
          <span className="text-3xl font-bold text-card">Pi</span>
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">Aiuta o supporta l'app con una donazione</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Scegli un contributo per il supporto e aggiornamento dell'app, non è obbligatorio il supporto o aiuto.
        </p>

        {/* Quick amount buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {QUICK_AMOUNTS.map((val) => (
            <button
              key={val}
              onClick={() => selectQuickAmount(val)}
              className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors ${
                amount === val.toString()
                  ? "border-[#F7A800] bg-[#F7A800] text-white"
                  : "border-border bg-card text-foreground"
              }`}
            >
              {val} Pi
            </button>
          ))}
        </div>

        {/* Custom amount input */}
        <div className="mt-4 w-full max-w-xs">
          <label className="mb-1 block text-xs font-bold text-muted-foreground">Oppure inserisci un importo personalizzato:</label>
          <div className="flex items-center gap-2 rounded-xl border-2 border-border bg-card px-4 py-3">
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-lg font-bold text-foreground outline-none"
              style={{ fontSize: "18px" }}
            />
            <span className="text-lg font-bold text-[#F7A800]">Pi</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={status === "processing" || status === "success" || !amount}
          className="mt-6 w-full max-w-xs rounded-xl bg-[#F7A800] px-6 py-4 text-lg font-bold text-white disabled:opacity-50"
        >
          {status === "processing"
            ? "Elaborazione..."
            : status === "success"
              ? "Grazie per la donazione!"
              : amount
                ? `Dona ${amount} Pi`
                : "Scegli un importo"}
        </button>

        {errorMsg && <p className="mt-3 text-center text-sm text-destructive">{errorMsg}</p>}
        {status === "success" && (
          <div className="mt-4 text-center">
            <p className="text-sm font-bold text-green-600">Donazione completata con successo!</p>
            <button
              onClick={() => { setStatus("idle"); setAmount("") }}
              className="mt-2 text-sm text-[#F7A800] underline"
            >
              Fai un&apos;altra donazione
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
