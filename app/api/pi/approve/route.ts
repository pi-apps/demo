import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { paymentId } = await req.json()
    if (!process.env.PI_API_KEY) {
      console.error("[v0] PI_API_KEY non configurata")
      return NextResponse.json({ error: "API key non configurata" }, { status: 500 })
    }
    console.log("[v0] Approving payment:", paymentId)
    const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: { 
        Authorization: `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json",
      },
    })
    const data = await res.text()
    console.log("[v0] Approve response:", res.status, data)
    if (!res.ok) return NextResponse.json({ error: `Errore approvazione: ${data}` }, { status: res.status })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[v0] Approve error:", err)
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}
