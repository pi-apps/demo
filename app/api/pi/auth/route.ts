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

    // Check KYC status (must be approved or provisional)
    const credentials = piData.credentials || piUser.credentials || {}
    const kycVerified = credentials.kyc_verification_status === "approved" || 
                        credentials.kyc_verification_status === "provisional" ||
                        piUser.kyc_verified === true
    
    // Check migration status
    const hasMigrated = credentials.has_migrated === true || 
                        piUser.has_migrated === true

    // Require both KYC and migration (unless no credentials data available - fallback to allow)
    const hasCredentialsData = Object.keys(credentials).length > 0 || 
                               piUser.kyc_verified !== undefined || 
                               piUser.has_migrated !== undefined
    
    if (hasCredentialsData) {
      if (!kycVerified) {
        return NextResponse.json({ 
          error: "KYC non verificato. Devi avere il KYC approvato o provvisorio per accedere." 
        }, { status: 403 })
      }
      if (!hasMigrated) {
        return NextResponse.json({ 
          error: "Migrazione non completata. Devi completare la prima migrazione per accedere." 
        }, { status: 403 })
      }
    }

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
    // Log the access for admin panel (use correct column names: user_id, logged_at)
    const { error: logError } = await supabase.from("access_logs").insert({
      user_id: piUser.uid,
      username,
    })
    if (logError) {
      console.error("[v0] Failed to log access:", logError)
      console.log("[v0] Access log error:", logError.message)
    }

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
