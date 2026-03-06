import { NextResponse } from "next/server"
import { getAdmin } from "@/lib/supabase/admin"

const PI_API_KEY = process.env.PI_API_KEY!
const ADMIN_USERNAME = "cipollas"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { accessToken, user: piUser } = body

    if (!accessToken || !piUser?.uid) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 })
    }

    // Verify with Pi Network
    const piRes = await fetch("https://api.minepi.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!piRes.ok) {
      return NextResponse.json({ error: "Token Pi non valido" }, { status: 401 })
    }
    const piData = await piRes.json()

    const supabase = getAdmin()
    const username = piData.username || piUser.uid
    const isAdmin = username === ADMIN_USERNAME

    // Check if banned
    const { data: banned } = await supabase
      .from("banned_users")
      .select("id")
      .eq("pi_uid", piUser.uid)
      .maybeSingle()

    if (banned) {
      return NextResponse.json({ error: "Utente bannato dalla chat" }, { status: 403 })
    }

    // Upsert pi_users
    await supabase.from("pi_users").upsert({
      pi_uid: piUser.uid,
      username,
      access_token: accessToken,
      is_admin: isAdmin,
    }, { onConflict: "pi_uid" })

    // Upsert auth user + profile
    const email = `${piUser.uid}@pi.user`
    const { data: authData } = await supabase.auth.admin.listUsers()
    let userId: string

    const existing = authData?.users?.find((u) => u.email === email)
    if (existing) {
      userId = existing.id
    } else {
      const { data: newUser, error } = await supabase.auth.admin.createUser({
        email,
        password: piUser.uid + "_pi_secret_2024",
        email_confirm: true,
      })
      if (error || !newUser.user) {
        return NextResponse.json({ error: "Errore creazione utente" }, { status: 500 })
      }
      userId = newUser.user.id
    }

    // Upsert profile
    await supabase.from("profiles").upsert({
      id: userId,
      display_name: username,
    }, { onConflict: "id" })

    // Log access
    await supabase.from("access_logs").insert({
      user_id: piUser.uid,
      username,
    })

    return NextResponse.json({
      userId,
      username,
      piUid: piUser.uid,
      isAdmin,
    })
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}
