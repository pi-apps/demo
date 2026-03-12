import { NextResponse } from "next/server"
import { getAdmin } from "@/lib/supabase/admin"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const adminUsername = searchParams.get("adminUsername")
    if (adminUsername !== "cipollas") return NextResponse.json({ error: "Non autorizzato" }, { status: 403 })
    
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]
    
    const supabase = getAdmin()
    
    // Get access logs for the specified date
    const startOfDay = `${date}T00:00:00.000Z`
    const endOfDay = `${date}T23:59:59.999Z`
    
    const { data: logs, error } = await supabase
      .from("access_logs")
      .select("id, pi_uid, username, created_at")
      .gte("created_at", startOfDay)
      .lte("created_at", endOfDay)
      .order("created_at", { ascending: false })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Calculate stats
    const totalAccesses = logs?.length || 0
    const uniqueUsers = new Set(logs?.map(l => l.pi_uid) || []).size
    
    return NextResponse.json({
      logs: logs || [],
      stats: {
        totalAccesses,
        uniqueUsers,
      },
    })
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}
