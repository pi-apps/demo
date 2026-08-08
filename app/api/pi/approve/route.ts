import { NextResponse } from "next/server"
import { getAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  try {
    const { paymentId, piUid, username, amount, memo } = await req.json()
    
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
    
    if (!res.ok) {
      return NextResponse.json({ error: `Errore approvazione: ${data}` }, { status: res.status })
    }

    // Save donation to database with 'approved' status
    const supabase = getAdmin()
    try {
      await supabase.from("donations").insert({
        pi_uid: piUid || "unknown",
        username: username || "Anonimo",
        pi_payment_id: paymentId,
        amount: amount || 0,
        memo: memo || "Donazione",
        status: "approved",
      })
    } catch {
      // Table might not exist yet, continue
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[v0] Approve error:", err)
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}
