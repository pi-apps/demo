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

    // Log ALL access attempts (before any checks) so admin can see everyone who tries to enter
    await supabase.from("access_logs").insert({
      user_id: piUser.uid,
      username,
    })

    // Admin bypasses all checks
    if (!isAdmin) {
      // Check KYC status from multiple possible locations
      const credentials = piData.credentials || piUser.credentials || {}
      
      // KYC can be in different formats depending on Pi SDK version
      const kycStatus = credentials.kyc_verification_status || 
                        credentials.kyc_status ||
                        piUser.kyc_verification_status
      
      const kycVerified = kycStatus === "approved" || 
                          kycStatus === "provisional" ||
                          kycStatus === "APPROVED" ||
                          kycStatus === "PROVISIONAL" ||
                          piUser.kyc_verified === true ||
                          credentials.kyc_verified === true
      
      // Check migration status
      const hasMigrated = credentials.has_migrated === true || 
                          piUser.has_migrated === true ||
                          credentials.migration_status === "completed"

      // Only block if we have explicit negative data
      if (kycStatus && !kycVerified) {
        return NextResponse.json({ 
          error: "KYC non verificato. Devi avere il KYC approvato o provvisorio per accedere." 
        }, { status: 403 })
      }
      
      // Only check migration if KYC status was provided
      if (kycStatus && credentials.has_migrated === false) {
        return NextResponse.json({ 
          error: "Migrazione non completata. Devi completare la prima migrazione per accedere." 
        }, { status: 403 })
      }
    }

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
