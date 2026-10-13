import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Nessun file fornito" }, { status: 400 })
    }

    // Check file type
    const isImage = file.type.startsWith("image/")
    const isAudio = file.type.startsWith("audio/")
    
    if (!isImage && !isAudio) {
      return NextResponse.json({ error: "Solo immagini e audio sono permessi" }, { status: 400 })
    }

    // Validate file size
    const maxSize = isAudio ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File troppo grande (max ${isAudio ? "10MB" : "5MB"})` }, { status: 400 })
    }

    const folder = isAudio ? "chat-audio" : "chat-images"
    const blob = await put(`${folder}/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Errore upload" }, { status: 500 })
  }
}
