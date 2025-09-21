"use client"

interface PageNavigationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PageNavigation({ currentPage, totalPages, onPageChange }: PageNavigationProps) {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-card/90 backdrop-blur-md border-2 border-primary/50 rounded-lg px-6 py-3 shadow-[0_0_20px_rgba(155,89,182,0.3)]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            className="font-sans text-sm font-bold text-secondary hover:text-secondary/80 disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
          >
            ◀ <span className="font-display">PREV</span>
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, currentPage - 2) + i
              if (pageNum > totalPages) return null

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 rounded border-2 font-display text-xs font-bold transition-all ${
                    pageNum === currentPage
                      ? "border-secondary bg-secondary text-black shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                      : "border-primary/30 text-white hover:border-primary hover:bg-primary/10 hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            className="font-sans text-sm font-bold text-secondary hover:text-secondary/80 disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
          >
            <span className="font-display">NEXT</span> ▶
          </button>
        </div>

        <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-secondary" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-secondary" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-secondary" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-secondary" />
      </div>
    </div>
  )
}
