import { NextResponse } from "next/server"
import { getAdmin, APP_SOURCE } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  try {
    const { paymentId, txid } = await req.json()
    
    if (!process.env.PI_API_KEY) {
      return NextResponse.json({ error: "API key non configurata" }, { status: 500 })
    }

    const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txid }),
    })
    
    const data = await res.text()
    if (!res.ok) {
      return NextResponse.json({ error: `Errore completamento: ${data}` }, { status: res.status })
    }

    // Update payment status to completed in pi_payments table
    const supabase = getAdmin()
    try {
      await supabase
        .from("pi_payments")
        .update({ 
          status: "completed", 
          tx_id: txid,
          completed_at: new Date().toISOString()
        })
        .eq("pi_payment_id", paymentId)
        .eq("app_source", APP_SOURCE)
    } catch {
      // DB error non blocca la risposta
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}
