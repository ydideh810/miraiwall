"use client"

import { useState } from "react"
import { Tile } from "./tile"
import { TileContentModal } from "./tile-content-modal"

interface TileData {
  pageNumber: number
  tilePosition: number
  status: "available" | "pending" | "owned"
  content?: string
  owner?: string
  timeCapsule?: {
    unlockDate: Date
    teaserMessage?: string
    capsuleContent: {
      type: "text" | "image" | "audio" | "file"
      data: string
      filename?: string
    }
    isUnlocked: boolean
  }
}

interface TileGridProps {
  tiles: TileData[]
  onTileRedeem: (pageNumber: number, tilePosition: number) => void
  onCreateTimeCapsule?: (pageNumber: number, tilePosition: number) => void
}

export function TileGrid({ tiles, onTileRedeem, onCreateTimeCapsule }: TileGridProps) {
  const [selectedTile, setSelectedTile] = useState<{
    pageNumber: number
    tilePosition: number
    content: string
    timeCapsule?: TileData["timeCapsule"]
  } | null>(null)

  const handleViewContent = (
    pageNumber: number,
    tilePosition: number,
    content: string,
    timeCapsule?: TileData["timeCapsule"],
  ) => {
    setSelectedTile({ pageNumber, tilePosition, content, timeCapsule })
  }

  const closeModal = () => {
    setSelectedTile(null)
  }

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-center gap-6 mb-6 text-sm font-mono">
          <div className="text-green-400">Available: {tiles.filter((t) => t.status === "available").length}</div>
          <div className="text-blue-400">Processing: {tiles.filter((t) => t.status === "pending").length}</div>
          <div className="text-red-400">Owned: {tiles.filter((t) => t.status === "owned").length}</div>
          <div className="text-amber-400">
            Sealed: {tiles.filter((t) => t.timeCapsule && !t.timeCapsule.isUnlocked).length}
          </div>
          <div className="text-emerald-400">
            Unlocked: {tiles.filter((t) => t.timeCapsule && t.timeCapsule.isUnlocked).length}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 md:gap-4 aspect-square max-w-lg mx-auto">
          {tiles.map((tile) => (
            <Tile
              key={`${tile.pageNumber}-${tile.tilePosition}`}
              pageNumber={tile.pageNumber}
              tilePosition={tile.tilePosition}
              status={tile.status}
              content={tile.content}
              owner={tile.owner}
              timeCapsule={tile.timeCapsule}
              onRedeem={onTileRedeem}
              onCreateTimeCapsule={onCreateTimeCapsule}
              onViewContent={
                (tile.status === "owned" && tile.content) || (tile.timeCapsule && tile.timeCapsule.isUnlocked)
                  ? () =>
                      handleViewContent(
                        tile.pageNumber,
                        tile.tilePosition,
                        tile.content || "Time Capsule Content",
                        tile.timeCapsule,
                      )
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      <TileContentModal
        isOpen={!!selectedTile}
        onClose={closeModal}
        tileId={selectedTile ? `${selectedTile.pageNumber}-${selectedTile.tilePosition}` : ""}
        content={selectedTile?.content || ""}
        timeCapsule={selectedTile?.timeCapsule}
      />
    </>
  )
}
