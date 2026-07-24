import { NextResponse } from "next/server"
import { getAdmin, APP_SOURCE } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  try {
    const { paymentId, piUid, username, amount, memo } = await req.json()
    
    if (!process.env.PI_API_KEY) {
      return NextResponse.json({ error: "API key non configurata" }, { status: 500 })
    }

    const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: { 
        Authorization: `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json",
      },
    })
    
    const data = await res.text()
    if (!res.ok) {
      return NextResponse.json({ error: `Errore approvazione: ${data}` }, { status: res.status })
    }

    // Save payment to pi_payments table with 'approved' status and app_source
    const supabase = getAdmin()
    try {
      await supabase.from("pi_payments").insert({
        pi_uid: piUid || "unknown",
        username: username || "Anonimo",
        pi_payment_id: paymentId,
        amount: amount || 0,
        memo: memo || "Donazione",
        status: "approved",
        app_source: APP_SOURCE,
      })
    } catch {
      // DB error non blocca la risposta
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}
