import { NextResponse } from "next/server"
import { getAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  try {
    const { paymentId, txid } = await req.json()
    
    // Complete with Pi Network
    const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txid }),
    })
    if (!res.ok) return NextResponse.json({ error: "Errore completamento" }, { status: 500 })

    // Update donation status to completed
    const supabase = getAdmin()
    try {
      await supabase
        .from("donations")
        .update({ 
          status: "completed", 
          tx_id: txid,
          completed_at: new Date().toISOString()
        })
        .eq("pi_payment_id", paymentId)
    } catch {
      // Table might not exist yet, continue
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}
