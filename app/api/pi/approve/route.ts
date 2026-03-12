import { NextResponse } from "next/server"
import { getAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  try {
    const { paymentId, piUid, username, amount, memo } = await req.json()
    
    // Approve with Pi Network
    const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: { Authorization: `Key ${process.env.PI_API_KEY}` },
    })
    if (!res.ok) return NextResponse.json({ error: "Errore approvazione" }, { status: 500 })

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
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}
