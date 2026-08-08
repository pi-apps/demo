import { NextResponse } from "next/server"
import { getAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  try {
    const { userId, adminUsername, reason } = await req.json()
    if (adminUsername !== "cipollas") return NextResponse.json({ error: "Non autorizzato" }, { status: 403 })

    const supabase = getAdmin()
    const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", userId).single()
    if (!profile) return NextResponse.json({ error: "Utente non trovato" }, { status: 404 })

    const { data: piUser } = await supabase.from("pi_users").select("pi_uid").eq("username", profile.display_name).maybeSingle()
    if (!piUser) return NextResponse.json({ error: "Pi user non trovato" }, { status: 404 })

    await supabase.from("banned_users").upsert({
      pi_uid: piUser.pi_uid,
      username: profile.display_name,
      reason: reason || "Violazione regole chat",
    }, { onConflict: "pi_uid" })

    // Delete all messages from banned user
    await supabase.from("messages").delete().eq("user_id", userId)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}
