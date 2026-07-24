import { NextResponse } from "next/server"
import { getAdmin, APP_SOURCE, ADMIN_USERNAME } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const supabase = getAdmin()
    // Only get messages for this specific app
    const { data: messages, error } = await supabase
      .from("messages")
      .select("id, content, created_at, user_id, reply_to, image_url, audio_url, app_source")
      .eq("app_source", APP_SOURCE)
      .order("created_at", { ascending: true })
      .limit(200)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!messages || messages.length === 0) return NextResponse.json([])

    const userIds = [...new Set(messages.map((m) => m.user_id))]
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", userIds)
      .eq("app_source", APP_SOURCE)
    const profileMap = new Map(profiles?.map((p) => [p.id, p.display_name]) || [])

    // Get replied-to messages
    const replyIds = messages.map((m) => m.reply_to).filter(Boolean)
    let replyMap = new Map()
    if (replyIds.length > 0) {
      const { data: replies } = await supabase
        .from("messages")
        .select("id, content, user_id")
        .in("id", replyIds)
        .eq("app_source", APP_SOURCE)
      if (replies) {
        for (const r of replies) {
          replyMap.set(r.id, {
            content: r.content,
            display_name: profileMap.get(r.user_id) || "Pioniere",
          })
        }
      }
    }

    const enriched = messages.map((m) => ({
      ...m,
      display_name: profileMap.get(m.user_id) || "Pioniere",
      reply_message: m.reply_to ? replyMap.get(m.reply_to) || null : null,
    }))

    return NextResponse.json(enriched)
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { content, userId, replyTo, imageUrl, audioUrl } = await req.json()
    if ((!content?.trim() && !imageUrl && !audioUrl) || !userId) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 })
    }
    const supabase = getAdmin()

    // Check if banned for this app
    const { data: piUser } = await supabase
      .from("pi_users")
      .select("pi_uid")
      .eq("pi_username",
        (await supabase.from("profiles").select("display_name").eq("id", userId).single()).data?.display_name
      )
      .eq("app_source", APP_SOURCE)
      .maybeSingle()

    if (piUser) {
      const { data: banned } = await supabase
        .from("banned_users")
        .select("id")
        .eq("pi_uid", piUser.pi_uid)
        .eq("app_source", APP_SOURCE)
        .maybeSingle()
      if (banned) return NextResponse.json({ error: "Utente bannato" }, { status: 403 })
    }

    const insertData: Record<string, unknown> = { 
      content: content?.trim() || "", 
      user_id: userId,
      app_source: APP_SOURCE,
    }
    if (replyTo) insertData.reply_to = replyTo
    if (imageUrl) insertData.image_url = imageUrl
    if (audioUrl) insertData.audio_url = audioUrl

    const { error } = await supabase.from("messages").insert(insertData)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { messageId, adminUsername } = await req.json()
    if (adminUsername !== ADMIN_USERNAME) return NextResponse.json({ error: "Non autorizzato" }, { status: 403 })

    const supabase = getAdmin()
    // Only delete messages from this app
    await supabase
      .from("messages")
      .delete()
      .eq("id", messageId)
      .eq("app_source", APP_SOURCE)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}
