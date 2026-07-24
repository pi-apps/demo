import { NextResponse } from "next/server"
import { getAdmin, APP_SOURCE, ADMIN_USERNAME } from "@/lib/supabase/admin"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const adminUsername = searchParams.get("adminUsername")
    const date = searchParams.get("date") // Format: YYYY-MM-DD

    if (adminUsername !== ADMIN_USERNAME) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 })
    }

    const supabase = getAdmin()

    // Costruisce range giornaliero come stringhe pure YYYY-MM-DD
    // per evitare problemi di timezone server vs client.
    // Supabase confronta TIMESTAMPTZ con stringhe ISO — usiamo T00:00:00 e T23:59:59
    // con offset +00:00 (UTC) cosi' copriamo l'intera giornata indipendentemente dal fuso.
    const targetDateStr = date || new Date().toISOString().split("T")[0]
    const startOfDay = `${targetDateStr}T00:00:00+00:00`
    const endOfDay   = `${targetDateStr}T23:59:59.999+00:00`

    // Strategia di query doppia:
    // Prima tenta con "logged_at" (script 006), poi fallback su "created_at" (script 002).
    // In questo modo funziona sia prima che dopo l'esecuzione dello script 006.
    // Il DB puo' avere la colonna chiamata "pi_uid" (script 002) oppure "user_id" (versione precedente).
    // Proviamo tutte le combinazioni possibili di colonna ID e colonna timestamp
    // finche' non troviamo quella che funziona nel DB reale.
    type LogRow = {
      id: string
      uid: string       // valore normalizzato (pi_uid o user_id che sia)
      username: string
      timestamp: string // valore normalizzato (logged_at o created_at che sia)
      app_source: string
    }

    let logs: LogRow[] = []
    let resolved = false

    // Combinazioni da tentare in ordine: [colonna_uid, colonna_timestamp]
    const combos = [
      ["pi_uid", "logged_at"],
      ["pi_uid", "created_at"],
      ["user_id", "logged_at"],
      ["user_id", "created_at"],
    ]

    for (const [uidCol, tsCol] of combos) {
      if (resolved) break

      // Usiamo select("*") per evitare il ParserError di TypeScript con select dinamico.
      // Filtriamo poi i campi necessari nel mapping.
      const { data: rows, error } = await supabase
        .from("access_logs")
        .select("*")
        .eq("app_source", APP_SOURCE)
        .gte(tsCol, startOfDay)
        .lte(tsCol, endOfDay)
        .order(tsCol, { ascending: false })

      // Verifica che la riga abbia effettivamente la colonna attesa (non undefined)
      if (!error && rows && rows.length >= 0 && (rows.length === 0 || rows[0][uidCol] !== undefined)) {
        logs = (rows as Record<string, unknown>[]).map((r) => ({
          id: String(r.id ?? ""),
          uid: String(r[uidCol] ?? ""),
          username: String(r.username ?? ""),
          timestamp: String(r[tsCol] ?? ""),
          app_source: String(r.app_source ?? APP_SOURCE),
        }))
        resolved = true
      }
    }

    if (!resolved) {
      return NextResponse.json({ error: "Struttura tabella access_logs non riconosciuta. Eseguire gli script di migrazione." }, { status: 500 })
    }

    // Normalizza per il frontend: espone sia user_id che pi_uid e logged_at
    const normalizedLogs = logs.map((log) => ({
      id: log.id,
      pi_uid: log.uid,
      user_id: log.uid,
      username: log.username,
      logged_at: log.timestamp,
      app_source: log.app_source,
    }))

    const uniqueUsers = new Set(logs.map((log) => log.uid))

    return NextResponse.json({
      logs: normalizedLogs,
      totalAccesses: normalizedLogs.length,
      uniqueUsers: uniqueUsers.size,
      date: targetDateStr,
      app: APP_SOURCE,
    })
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}
