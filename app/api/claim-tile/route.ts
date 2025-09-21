import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const demoKeys = [
  "2Z23H-YA548-FKBU2-8LAUL",
  "9X7K2-M4N8P-Q1W5E-R3T6Y",
  "A5B9C-D2F7G-H4J8K-L1M6N",
  "P8Q3R-S7T2U-V6W9X-Y4Z1A",
  "B3C8D-E1F6G-H9I4J-K7L2M",
  "N6O1P-Q5R9S-T3U8V-W2X7Y",
  "Z4A9B-C6D1E-F8G3H-I5J2K",
  "L7M2N-O4P8Q-R1S6T-U9V3W",
  "X5Y1Z-A8B3C-D6E2F-G9H4I",
  "J2K7L-M1N5O-P8Q3R-S6T9U",
]

function validateKeyFormat(key: string): boolean {
  const keyPattern = /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/
  return keyPattern.test(key)
}

function generateTileContent(pageNumber: number, tilePosition: number) {
  const contentTypes = [
    { type: "GitHub Repo", content: `https://github.com/miraiwall/tile-${pageNumber}-${tilePosition}` },
    { type: "Legal Pack", content: `Legal document bundle #${pageNumber}-${tilePosition} - Terms, Privacy, GDPR` },
    {
      type: "ASCII QR",
      content: `QR Code: TILE-${pageNumber}-${tilePosition}\n████ ██ ████\n██ ████ ██ ██\n████ ██ ████`,
    },
    { type: "Dataset", content: `ML Dataset: tile_${pageNumber}_${tilePosition}_training_data.json (2.3MB)` },
    {
      type: "API Key",
      content: `API_KEY_TILE_${pageNumber}_${tilePosition}: sk-${Math.random().toString(36).substring(2)}`,
    },
    {
      type: "Script",
      content: `#!/bin/bash\n# Utility script for tile ${pageNumber}-${tilePosition}\necho "MiraiWall utility activated"`,
    },
  ]

  const randomContent = contentTypes[Math.floor(Math.random() * contentTypes.length)]
  return `${randomContent.type}: ${randomContent.content}`
}

export async function POST(request: NextRequest) {
  try {
    const { licenseKey, pageNumber, tilePosition } = await request.json()

    if (!licenseKey || pageNumber === undefined || tilePosition === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!validateKeyFormat(licenseKey)) {
      return NextResponse.json({ error: "Invalid key format. Use: XXXXX-XXXXX-XXXXX-XXXXX" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: existingKey } = await supabase.from("license_keys").select("*").eq("license_key", licenseKey).single()

    if (existingKey?.is_redeemed) {
      return NextResponse.json({ error: "This license key has already been used" }, { status: 400 })
    }

    const isDemoKey = demoKeys.includes(licenseKey)

    if (!isDemoKey && !existingKey) {
      return NextResponse.json({ error: "Invalid license key" }, { status: 400 })
    }

    if (isDemoKey) {
      const tileData = {
        id: `demo-tile-${pageNumber}-${tilePosition}`,
        page_number: pageNumber,
        tile_position: tilePosition,
        content: generateTileContent(pageNumber, tilePosition),
        claimed_at: new Date().toISOString(),
        license_key_used: licenseKey,
        is_demo: true,
      }

      return NextResponse.json({
        success: true,
        tile: tileData,
        message: "Demo tile claimed successfully! (Not permanently saved)",
      })
    }

    const tileContent = generateTileContent(pageNumber, tilePosition)

    // Mark license key as redeemed
    await supabase
      .from("license_keys")
      .update({
        is_redeemed: true,
        redeemed_at: new Date().toISOString(),
      })
      .eq("license_key", licenseKey)

    // Create tile record
    const { data: tileData, error: tileError } = await supabase
      .from("tiles")
      .insert({
        page_number: pageNumber,
        tile_position: tilePosition,
        content: tileContent,
        license_key_used: existingKey.id,
        purchased_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (tileError) {
      throw tileError
    }

    return NextResponse.json({
      success: true,
      tile: tileData,
      message: "Tile claimed successfully and permanently saved!",
    })
  } catch (error) {
    console.error("Claim tile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
