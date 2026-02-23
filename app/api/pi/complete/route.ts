import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { paymentId, txid } = await req.json()
    if (!process.env.PI_API_KEY) {
      console.error("[v0] PI_API_KEY non configurata")
      return NextResponse.json({ error: "API key non configurata" }, { status: 500 })
    }
    console.log("[v0] Completing payment:", paymentId, "txid:", txid)
    const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txid }),
    })
    const data = await res.text()
    console.log("[v0] Complete response:", res.status, data)
    if (!res.ok) return NextResponse.json({ error: `Errore completamento: ${data}` }, { status: res.status })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[v0] Complete error:", err)
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}
