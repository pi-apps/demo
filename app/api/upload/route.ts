import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Nessun file fornito" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm", "video/quicktime"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipo di file non supportato" }, { status: 400 })
    }

    // Validate file size (max 10MB for images, 50MB for videos)
    const maxSize = file.type.startsWith("video/") ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File troppo grande" }, { status: 400 })
    }

    // Upload to Vercel Blob (public for chat media)
    const blob = await put(`chat/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    // Determine media type
    const mediaType = file.type.startsWith("video/") ? "video" : "image"

    return NextResponse.json({ url: blob.url, mediaType })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload fallito" }, { status: 500 })
  }
}
