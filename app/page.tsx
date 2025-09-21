"use client"

import { useState, useEffect } from "react"
import { TileGrid } from "@/components/tile-grid"
import { PageHeader } from "@/components/page-header"
import { RedeemModal } from "@/components/redeem-modal"
import { PageNavigation } from "@/components/page-navigation"
import { PageCompletionModal } from "@/components/page-completion-modal"
import { TimeCapsuleModal } from "@/components/time-capsule-modal"
import { Button } from "@/components/ui/button"
import { TutorialModal } from "@/components/tutorial-modal"

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
  id?: string
  isPersistent?: boolean
}

export default function MiraiWallPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [allTiles, setAllTiles] = useState<TileData[]>([])
  const [redeemModal, setRedeemModal] = useState<{
    isOpen: boolean
    pageNumber: number
    tilePosition: number
  }>({ isOpen: false, pageNumber: 0, tilePosition: 0 })
  const [timeCapsuleModal, setTimeCapsuleModal] = useState<{
    isOpen: boolean
    pageNumber: number
    tilePosition: number
  }>({ isOpen: false, pageNumber: 0, tilePosition: 0 })
  const [completionModal, setCompletionModal] = useState(false)
  const [tutorialModal, setTutorialModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const currentPageTiles = allTiles.filter((tile) => tile.pageNumber === currentPage - 1)

  const loadPersistentTiles = async () => {
    try {
      const response = await fetch("/api/tiles")
      const data = await response.json()

      if (data.tiles) {
        const persistentTiles: TileData[] = data.tiles.map((tile: any) => ({
          pageNumber: tile.page_number,
          tilePosition: tile.tile_position,
          status: "owned" as const,
          content: tile.content,
          owner: "You",
          id: tile.id,
          isPersistent: true,
        }))

        setAllTiles((prev) => {
          // Merge with existing tiles, prioritizing persistent ones
          const merged = [...prev]
          persistentTiles.forEach((persistentTile) => {
            const existingIndex = merged.findIndex(
              (t) => t.pageNumber === persistentTile.pageNumber && t.tilePosition === persistentTile.tilePosition,
            )
            if (existingIndex >= 0) {
              merged[existingIndex] = persistentTile
            } else {
              merged.push(persistentTile)
            }
          })
          return merged
        })
      }
    } catch (error) {
      console.error("Failed to load persistent tiles:", error)
    }
  }

  const loadTiles = () => {
    setIsLoading(true)

    const existingPageTiles = allTiles.filter((tile) => tile.pageNumber === currentPage - 1)

    if (existingPageTiles.length === 0) {
      // Create new tiles for this page
      const pageSize = 25
      const newTiles: TileData[] = Array.from({ length: pageSize }, (_, index) => ({
        pageNumber: currentPage - 1,
        tilePosition: index,
        status: "available" as const,
      }))

      setAllTiles((prev) => [...prev, ...newTiles])
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadPersistentTiles()
  }, [])

  useEffect(() => {
    loadTiles()
  }, [currentPage])

  const handleTileRedeem = (pageNumber: number, tilePosition: number) => {
    setRedeemModal({
      isOpen: true,
      pageNumber,
      tilePosition,
    })
  }

  const handleRedeemSuccess = () => {
    setAllTiles((prev) =>
      prev.map((tile) =>
        tile.pageNumber === redeemModal.pageNumber && tile.tilePosition === redeemModal.tilePosition
          ? {
              ...tile,
              status: "owned" as const,
              owner: "You",
            }
          : tile,
      ),
    )

    setTimeCapsuleModal({
      isOpen: true,
      pageNumber: redeemModal.pageNumber,
      tilePosition: redeemModal.tilePosition,
    })
  }

  const handleCreateTimeCapsule = (pageNumber: number, tilePosition: number) => {
    setTimeCapsuleModal({
      isOpen: true,
      pageNumber,
      tilePosition,
    })
  }

  const handleTimeCapsuleSuccess = (capsuleData: any) => {
    setAllTiles((prev) =>
      prev.map((tile) =>
        tile.pageNumber === timeCapsuleModal.pageNumber && tile.tilePosition === timeCapsuleModal.tilePosition
          ? {
              ...tile,
              timeCapsule: {
                unlockDate: new Date(capsuleData.unlockDate),
                teaserMessage: capsuleData.teaserMessage,
                capsuleContent: capsuleData.content,
                isUnlocked: false,
              },
            }
          : tile,
      ),
    )
  }

  const generateTileContent = (pageNumber: number, tilePosition: number) => {
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

  const checkForPageCompletion = () => {
    const allOwned = currentPageTiles.every((tile) => tile.status === "owned")
    if (allOwned && currentPageTiles.length > 0) {
      setCompletionModal(true)
    }
  }

  const handleNextPage = () => {
    const newPage = currentPage + 1
    setCurrentPage(newPage)
    setTotalPages(Math.max(totalPages, newPage))
    setCompletionModal(false)
  }

  const handlePageChange = (page: number) => {
    if (page <= totalPages) {
      setCurrentPage(page)
    }
  }

  useEffect(() => {
    checkForPageCompletion()
  }, [currentPageTiles])

  const ownedTilesCount = currentPageTiles.filter((t) => t.status === "owned").length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-purple-400 font-orbitron">Loading MiraiWall...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="fixed top-4 right-4 z-40">
        <Button
          onClick={() => setTutorialModal(true)}
          className="bg-purple-600/20 border border-purple-500/50 text-purple-300 hover:bg-purple-600/30 hover:text-white transition-all duration-200 font-orbitron"
          size="sm"
        >
          Tutorial
        </Button>
      </div>

      <PageHeader currentPage={currentPage} />

      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
                 linear-gradient(rgba(155, 89, 182, 0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(155, 89, 182, 0.1) 1px, transparent 1px)
               `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <main className="container mx-auto px-4 py-8 pb-20 relative z-10">
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="font-sans text-4xl md:text-7xl font-black text-primary mb-6 relative">
              <span className="relative z-10 drop-shadow-[0_0_20px_currentColor]">
                MIRAI<span className="text-secondary">WALL</span>
              </span>
              <span className="absolute inset-0 text-secondary opacity-20 animate-pulse">MIRAIWALL</span>
            </h1>

            <div className="absolute -left-8 top-1/2 w-6 h-0.5 bg-gradient-to-r from-primary to-transparent" />
            <div className="absolute -right-8 top-1/2 w-6 h-0.5 bg-gradient-to-l from-secondary to-transparent" />
          </div>

          <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Redeem license keys to claim tiles and reveal exclusive utility content in this{" "}
            <span className="text-primary font-semibold">cyberpunk digital space</span>
          </p>

          <div className="flex justify-center gap-8 mt-8 text-sm font-mono">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-retro-purple rounded bg-retro-purple" />
              <span className="text-retro-purple">AVAILABLE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-retro-gold rounded bg-retro-gold animate-pulse" />
              <span className="text-retro-gold">PROCESSING</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-retro-platinum rounded bg-retro-platinum" />
              <span className="text-retro-platinum">OWNED</span>
            </div>
          </div>
        </div>

        <TileGrid
          tiles={currentPageTiles}
          onTileRedeem={handleTileRedeem}
          onCreateTimeCapsule={handleCreateTimeCapsule}
        />
      </main>

      <PageNavigation currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      <RedeemModal
        isOpen={redeemModal.isOpen}
        onClose={() => setRedeemModal((prev) => ({ ...prev, isOpen: false }))}
        pageNumber={redeemModal.pageNumber}
        tilePosition={redeemModal.tilePosition}
        onSuccess={handleRedeemSuccess}
      />

      <TimeCapsuleModal
        isOpen={timeCapsuleModal.isOpen}
        onClose={() => setTimeCapsuleModal((prev) => ({ ...prev, isOpen: false }))}
        pageNumber={timeCapsuleModal.pageNumber}
        tilePosition={timeCapsuleModal.tilePosition}
        onSuccess={handleTimeCapsuleSuccess}
      />

      <PageCompletionModal
        isOpen={completionModal}
        onClose={() => setCompletionModal(false)}
        onNextPage={handleNextPage}
        currentPage={currentPage}
        tilesOwned={ownedTilesCount}
      />

      <TutorialModal isOpen={tutorialModal} onClose={() => setTutorialModal(false)} />
    </div>
  )
}
