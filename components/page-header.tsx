interface PageHeaderProps {
  currentPage: number
}

export function PageHeader({ currentPage }: PageHeaderProps) {
  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-card/90 backdrop-blur-md border-2 border-secondary/50 rounded-lg px-6 py-3 shadow-[0_0_20px_rgba(241,196,15,0.3)]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
          <span className="font-sans text-sm font-bold text-secondary tracking-wider">
            PAGE <span className="font-display">{currentPage.toString().padStart(2, "0")}</span>
          </span>
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
        </div>

        <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-secondary" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-secondary" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-secondary" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-secondary" />
      </div>
    </div>
  )
}
