import { NextResponse } from "next/server"
import { getAdmin } from "@/lib/supabase/admin"

const ADMIN_USERNAME = "cipollas"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const adminUsername = searchParams.get("adminUsername")
    const date = searchParams.get("date") // Format: YYYY-MM-DD

    if (adminUsername !== ADMIN_USERNAME) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 })
    }

    const supabase = getAdmin()

    // Get start and end of the requested day (or today)
    const targetDate = date ? new Date(date) : new Date()
    const startOfDay = new Date(targetDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(targetDate)
    endOfDay.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
      .from("access_logs")
      .select("id, user_id, username, logged_at")
      .gte("logged_at", startOfDay.toISOString())
      .lte("logged_at", endOfDay.toISOString())
      .order("logged_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Errore database: " + error.message }, { status: 500 })
    }

    // Count unique users
    const uniqueUsers = new Set(data?.map(log => log.user_id) || [])

    return NextResponse.json({
      logs: data || [],
      totalAccesses: data?.length || 0,
      uniqueUsers: uniqueUsers.size,
      date: targetDate.toISOString().split("T")[0],
    })
  } catch {
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}
