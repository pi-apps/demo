import { NextResponse } from "next/server"
import { getAdmin, APP_SOURCE, ADMIN_USERNAME } from "@/lib/supabase/admin"

const PI_API_KEY = process.env.PI_API_KEY!

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

    // Log ALL access attempts per questa app.
    // Il DB puo' avere la colonna "pi_uid" (script 002) o "user_id" (versione precedente).
    // Proviamo prima con pi_uid, se fallisce usiamo user_id.
    const { error: logErr1 } = await supabase.from("access_logs").insert({
      pi_uid: piUser.uid,
      username,
      app_source: APP_SOURCE,
    })
    if (logErr1) {
      await supabase.from("access_logs").insert({
        user_id: piUser.uid,
        username,
        app_source: APP_SOURCE,
      })
    }

    // Admin bypasses all checks
    if (!isAdmin) {
      // -------------------------------------------------------------------
      // KYC & MIGRATION CHECK — logica strict
      //
      // Fonte primaria: piData (risposta verificata da /v2/me tramite Pi API Key)
      // Fonte secondaria: piUser.credentials (dati lato client — NON affidabili da soli)
      //
      // Regole di accesso:
      //   ACCESSO CONSENTITO se:
      //     (A) kycStatus === "approved" / "APPROVED"            (KYC pieno)
      //     (B) kycStatus === "provisional" / "PROVISIONAL"
      //         AND hasMigrated === true                         (KYC provvisorio + migrazione)
      //
      //   ACCESSO NEGATO in tutti gli altri casi, incluso quando
      //   Pi SDK non ritorna kycStatus (comportamento strict per sicurezza)
      // -------------------------------------------------------------------

      const credentials = piData.credentials || piUser.credentials || {}

      // Raccoglie kycStatus da tutte le posizioni note (Pi SDK v1/v2/v2.0)
      const rawKycStatus: string | undefined =
        piData.kyc_verification_status ||
        credentials.kyc_verification_status ||
        credentials.kyc_status ||
        piUser.kyc_verification_status ||
        undefined

      const normalizedKyc = rawKycStatus?.toLowerCase()

      const kycApproved =
        normalizedKyc === "approved" ||
        piData.kyc_verified === true ||
        credentials.kyc_verified === true

      const kycProvisional = normalizedKyc === "provisional"

      // Raccoglie migrazione da tutte le posizioni note
      const hasMigrated: boolean =
        piData.has_migrated === true ||
        credentials.has_migrated === true ||
        piUser.has_migrated === true ||
        credentials.migration_status === "completed" ||
        piData.migration_status === "completed"

      // Caso A: KYC approvato completamente — accesso consentito
      if (kycApproved) {
        // pass — continua il flusso
      }
      // Caso B: KYC provvisorio + migrazione completata — accesso consentito
      else if (kycProvisional && hasMigrated) {
        // pass — continua il flusso
      }
      // Caso C: KYC provvisorio ma migrazione NON completata — blocco
      else if (kycProvisional && !hasMigrated) {
        return NextResponse.json({
          error: "Hai il KYC provvisorio ma non hai ancora completato la prima migrazione. Completa la migrazione su Pi Browser per accedere.",
          code: "MIGRATION_REQUIRED",
          kycStatus: rawKycStatus,
        }, { status: 403 })
      }
      // Caso D: KYC esplicitamente negativo (pending, rejected, ecc.)
      else if (rawKycStatus !== undefined) {
        return NextResponse.json({
          error: "KYC non verificato. Devi avere il KYC approvato (o provvisorio con migrazione completata) per accedere.",
          code: "KYC_NOT_VERIFIED",
          kycStatus: rawKycStatus,
        }, { status: 403 })
      }
      // Caso E: Pi SDK non ha restituito alcun dato KYC — blocco strict
      else {
        return NextResponse.json({
          error: "Impossibile verificare il tuo KYC. Assicurati di usare Pi Browser aggiornato e riprova.",
          code: "KYC_UNAVAILABLE",
        }, { status: 403 })
      }
    }

    // Check if banned for this app
    const { data: banned } = await supabase
      .from("banned_users")
      .select("id")
      .eq("pi_uid", piUser.uid)
      .eq("app_source", APP_SOURCE)
      .maybeSingle()

    if (banned) {
      return NextResponse.json({ error: "Utente bannato dalla chat" }, { status: 403 })
    }

    // Upsert pi_users with app_source
    // onConflict: "pi_uid,app_source" — dopo lo script 007 il UNIQUE e' su (pi_uid, app_source)
    // cosi' lo stesso utente Pi puo' avere un record separato per ogni app, senza sovrascrivere
    await supabase.from("pi_users").upsert({
      pi_uid: piUser.uid,
      pi_username: username,
      access_token: accessToken,
      is_admin: isAdmin,
      app_source: APP_SOURCE,
    }, { onConflict: "pi_uid,app_source" })

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

    // Upsert profile with app_source
    await supabase.from("profiles").upsert({
      id: userId,
      display_name: username,
      app_source: APP_SOURCE,
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
