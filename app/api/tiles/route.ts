import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: tiles, error } = await supabase
      .from("tiles")
      .select("*")
      .order("page_number", { ascending: true })
      .order("tile_position", { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json({ tiles: tiles || [] })
  } catch (error) {
    console.error("Load tiles error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
