"use client"

interface PageCompletionModalProps {
  isOpen: boolean
  onClose: () => void
  onNextPage: () => void
  currentPage: number
  tilesOwned: number
}

export function PageCompletionModal({
  isOpen,
  onClose,
  onNextPage,
  currentPage,
  tilesOwned,
}: PageCompletionModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card border-2 border-secondary/70 rounded-lg p-8 max-w-lg w-full shadow-[0_0_40px_rgba(241,196,15,0.6)]">
        <div className="absolute -top-2 -left-2 w-6 h-6 border-l-4 border-t-4 border-secondary animate-pulse" />
        <div className="absolute -top-2 -right-2 w-6 h-6 border-r-4 border-t-4 border-secondary animate-pulse" />
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-4 border-b-4 border-secondary animate-pulse" />
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-4 border-b-4 border-secondary animate-pulse" />

        <div className="text-center">
          <div className="mb-6">
            <h2 className="font-display text-3xl font-black text-secondary mb-2 animate-pulse">PAGE COMPLETE</h2>
            <div className="font-mono text-primary text-lg">
              LEVEL {currentPage.toString().padStart(2, "0")} CLEARED
            </div>
          </div>

          <div className="bg-background/50 border border-secondary/30 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="font-display text-2xl font-bold text-secondary">{tilesOwned}</div>
                <div className="font-mono text-xs text-muted-foreground">TILES ACQUIRED</div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-primary">100%</div>
                <div className="font-mono text-xs text-muted-foreground">COMPLETION</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onNextPage}
              className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-display font-bold py-3 px-6 rounded-lg transition-colors shadow-[0_0_15px_rgba(241,196,15,0.3)]"
            >
              ADVANCE TO NEXT LEVEL
            </button>
            <button
              onClick={onClose}
              className="w-full bg-primary/20 hover:bg-primary/30 text-primary font-display font-bold py-2 px-6 rounded-lg transition-colors"
            >
              STAY ON CURRENT LEVEL
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
