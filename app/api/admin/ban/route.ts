import { NextResponse } from "next/server"
import { getAdmin, APP_SOURCE, ADMIN_USERNAME } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  try {
    const { userId, adminUsername, reason } = await req.json()
    if (adminUsername !== ADMIN_USERNAME) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 })
    }

    const supabase = getAdmin()
    
    // Get profile for this app
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", userId)
      .eq("app_source", APP_SOURCE)
      .single()
    
    if (!profile) return NextResponse.json({ error: "Utente non trovato" }, { status: 404 })

    // Get pi_user for this app
    const { data: piUser } = await supabase
      .from("pi_users")
      .select("pi_uid")
      .eq("pi_username", profile.display_name)
      .eq("app_source", APP_SOURCE)
      .maybeSingle()
    
    if (!piUser) return NextResponse.json({ error: "Pi user non trovato" }, { status: 404 })

    // Ban user for this specific app only - check if already banned first
    const { data: alreadyBanned } = await supabase
      .from("banned_users")
      .select("id")
      .eq("pi_uid", piUser.pi_uid)
      .eq("app_source", APP_SOURCE)
      .maybeSingle()

    if (!alreadyBanned) {
      await supabase.from("banned_users").insert({
        pi_uid: piUser.pi_uid,
        username: profile.display_name,
        reason: reason || "Violazione regole chat",
        app_source: APP_SOURCE,
      })
    }

    // Delete all messages from banned user for this app
    await supabase
      .from("messages")
      .delete()
      .eq("user_id", userId)
      .eq("app_source", APP_SOURCE)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}

// DELETE - rimuove il ban di un utente per questa app
export async function DELETE(req: Request) {
  try {
    const { piUid, adminUsername } = await req.json()

    if (adminUsername !== ADMIN_USERNAME) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 })
    }

    if (!piUid) {
      return NextResponse.json({ error: "pi_uid mancante" }, { status: 400 })
    }

    const supabase = getAdmin()

    // Only unban for this specific app
    const { error } = await supabase
      .from("banned_users")
      .delete()
      .eq("pi_uid", piUid)
      .eq("app_source", APP_SOURCE)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}
